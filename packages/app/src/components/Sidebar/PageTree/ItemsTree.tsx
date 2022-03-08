import React, {
  FC, useEffect, useRef, useState, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';

import { debounce } from 'throttle-debounce';

import loggerFactory from '~/utils/logger';

import { usePageTreeTermManager, useSWRxPageAncestorsChildren, useSWRxRootPage } from '~/stores/page-listing';
import { TargetAndAncestors } from '~/interfaces/page-listing-results';
import { IPageHasId, IPageToDeleteWithMeta } from '~/interfaces/page';
import { OnDuplicatedFunction, OnDeletedFunction, SidebarScrollerEvent } from '~/interfaces/ui';
import { SocketEventName, UpdateDescCountData, UpdateDescCountRawData } from '~/interfaces/websocket';
import { toastError, toastSuccess } from '~/client/util/apiNotification';
import {
  IPageForPageDuplicateModal, usePageDuplicateModal, usePageDeleteModal,
} from '~/stores/modal';
import { jQuerySlimScrollIntoView } from '~/client/util/smooth-scroll';

import { useIsEnabledAttachTitleHeader } from '~/stores/context';
import { useFullTextSearchTermManager } from '~/stores/search';
import { useDescendantsPageListForCurrentPathTermManager } from '~/stores/page';
import { useGlobalSocket } from '~/stores/websocket';
import { usePageTreeDescCountMap } from '~/stores/ui';

import { ItemNode } from './ItemNode';
import Item from './Item';

const SCROLL_OFFSET_TOP = 60; // approximate height of navigation

const logger = loggerFactory('growi:cli:ItemsTree');

/*
 * Utility to generate initial node
 */
const generateInitialNodeBeforeResponse = (targetAndAncestors: Partial<IPageHasId>[]): ItemNode => {
  const nodes = targetAndAncestors.map((page): ItemNode => {
    return new ItemNode(page, []);
  });

  // update children for each node
  const rootNode = nodes.reduce((child, parent) => {
    parent.children = [child];
    return parent;
  });

  return rootNode;
};

const generateInitialNodeAfterResponse = (ancestorsChildren: Record<string, Partial<IPageHasId>[]>, rootNode: ItemNode): ItemNode => {
  const paths = Object.keys(ancestorsChildren);

  let currentNode = rootNode;
  paths.every((path) => {
    // stop rendering when non-migrated pages found
    if (currentNode == null) {
      return false;
    }

    const childPages = ancestorsChildren[path];
    currentNode.children = ItemNode.generateNodesFromPages(childPages);
    const nextNode = currentNode.children.filter((node) => {
      return paths.includes(node.page.path as string);
    })[0];
    currentNode = nextNode;
    return true;
  });

  return rootNode;
};


// Auto scroll by jquery slimScroll
const scrollPageTree = () => {
  // const scrollElement = document.getElementById('grw-sidebar-contents-scroll-target');
  // const scrollTargetElement = document.getElementById('grw-pagetree-is-target');

  // if (scrollElement != null && scrollTargetElement != null) {
  //   jQuerySlimScrollIntoView(scrollElement, scrollTargetElement, SCROLL_OFFSET_TOP);
  // }
};


type ItemsTreeProps = {
  isEnableActions: boolean
  targetPath: string
  targetPathOrId?: string
  targetAndAncestorsData?: TargetAndAncestors
}

/*
 * ItemsTree
 */
const ItemsTree: FC<ItemsTreeProps> = (props: ItemsTreeProps) => {
  const {
    targetPath, targetPathOrId, targetAndAncestorsData, isEnableActions,
  } = props;

  const { t } = useTranslation();

  const { data: ancestorsChildrenData, error: error1 } = useSWRxPageAncestorsChildren(targetPath);
  const { data: rootPageData, error: error2 } = useSWRxRootPage();
  const { data: isEnabledAttachTitleHeader } = useIsEnabledAttachTitleHeader();
  const { open: openDuplicateModal } = usePageDuplicateModal();
  const { open: openDeleteModal } = usePageDeleteModal();

  const { data: socket } = useGlobalSocket();
  const { data: ptDescCountMap, update: updatePtDescCountMap } = usePageTreeDescCountMap();


  // for mutation
  const { advance: advancePt } = usePageTreeTermManager();
  const { advance: advanceFts } = useFullTextSearchTermManager();
  const { advance: advanceDpl } = useDescendantsPageListForCurrentPathTermManager();

  const [isInitialScrollCompleted, setIsInitialScrollCompleted] = useState(false);

  const rootElemRef = useRef(null);


  const isSecondStageRendering = ancestorsChildrenData != null && rootPageData != null;


  useEffect(() => {
    if (socket == null) {
      return;
    }

    socket.on(SocketEventName.UpdateDescCount, (data: UpdateDescCountRawData) => {
      // save to global state
      const newData: UpdateDescCountData = new Map(Object.entries(data));

      updatePtDescCountMap(newData);
    });

    return () => { socket.off(SocketEventName.UpdateDescCount) };

  }, [socket, ptDescCountMap, updatePtDescCountMap]);

  const onRenamed = () => {
    advancePt();
    advanceFts();
    advanceDpl();
  };

  const initialScrollDebounced = useMemo(() => {
    return debounce(100, () => {
      logger.debug('initialScrollDebounced called');

      if (isInitialScrollCompleted) {
        return;
      }

      logger.debug('scrollPageTree has invoked after debounce');

      document.dispatchEvent(new CustomEvent(SidebarScrollerEvent.RESET_SCROLLBAR));
      // use setTimeout as resetScrollbar in StickyStretchableScroller component uses debounce and wait 100ms
      setTimeout(scrollPageTree, 100);

      setIsInitialScrollCompleted(true);
    });
  }, [isInitialScrollCompleted]);


  // ***************************  Auto Scroll  ***************************
  useEffect(() => {
    if (!isSecondStageRendering || isInitialScrollCompleted) {
      return;
    }

    const rootElement = rootElemRef.current as HTMLElement | null;
    if (rootElement == null) {
      return;
    }

    const observerCallback = (mutationRecords: MutationRecord[]) => {
      mutationRecords.forEach(() => initialScrollDebounced());
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(rootElement, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [initialScrollDebounced, isInitialScrollCompleted, isSecondStageRendering]);
  // *******************************  end  *******************************

  const onClickDuplicateMenuItem = (pageToDuplicate: IPageForPageDuplicateModal) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const duplicatedHandler: OnDuplicatedFunction = (fromPath, toPath) => {
      toastSuccess(t('duplicated_pages', { fromPath }));

      advancePt();
      advanceFts();
      advanceDpl();
    };

    openDuplicateModal(pageToDuplicate, { onDuplicated: duplicatedHandler });
  };

  const onClickDeleteMenuItem = (pageToDelete: IPageToDeleteWithMeta) => {
    const onDeletedHandler: OnDeletedFunction = (pathOrPathsToDelete, isRecursively, isCompletely) => {
      if (typeof pathOrPathsToDelete !== 'string') {
        return;
      }

      const path = pathOrPathsToDelete;

      if (isCompletely) {
        toastSuccess(t('deleted_pages_completely', { path }));
      }
      else {
        toastSuccess(t('deleted_pages', { path }));
      }

      advancePt();
      advanceFts();
      advanceDpl();
    };

    openDeleteModal([pageToDelete], { onDeleted: onDeletedHandler });
  };

  if (error1 != null || error2 != null) {
    // TODO: improve message
    toastError('Error occurred while fetching pages to render PageTree');
    return null;
  }

  let initialItemNode;
  /*
   * Render second stage
   */
  if (isSecondStageRendering) {
    initialItemNode = generateInitialNodeAfterResponse(ancestorsChildrenData.ancestorsChildren, new ItemNode(rootPageData.rootPage));
  }
  /*
   * Before swr response comes back
   */
  else if (targetAndAncestorsData != null) {
    initialItemNode = generateInitialNodeBeforeResponse(targetAndAncestorsData.targetAndAncestors);
  }

  if (initialItemNode != null) {
    return (
      <ul className="grw-pagetree list-group p-3" ref={rootElemRef}>
        <Item
          key={initialItemNode.page.path}
          targetPathOrId={targetPathOrId}
          itemNode={initialItemNode}
          isOpen
          isEnabledAttachTitleHeader={isEnabledAttachTitleHeader}
          isEnableActions={isEnableActions}
          onRenamed={onRenamed}
          onClickDuplicateMenuItem={onClickDuplicateMenuItem}
          onClickDeleteMenuItem={onClickDeleteMenuItem}
        />
      </ul>
    );
  }

  return <></>;
};

export default ItemsTree;
