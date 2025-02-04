import { type RefObject, useCallback, useEffect } from 'react';

import {
  isClient, isServer, pagePathUtils, PageGrant, withUtils,
} from '@growi/core';
import type { Nullable, SWRResponseWithUtils } from '@growi/core';
import { Breakpoint } from '@growi/ui/dist/interfaces/breakpoints';
import { addBreakpointListener, cleanupBreakpointListener } from '@growi/ui/dist/utils';
import type { HtmlElementNode } from 'rehype-toc';
import type SimpleBar from 'simplebar-react';
import {
  useSWRConfig, type SWRResponse, type Key,
} from 'swr';
import useSWRImmutable from 'swr/immutable';

import type { IFocusable } from '~/client/interfaces/focusable';
import { useUserUISettings } from '~/client/services/user-ui-settings';
import { apiv3Get, apiv3Put } from '~/client/util/apiv3-client';
import type { IPageGrantData } from '~/interfaces/page';
import type { ISidebarConfig } from '~/interfaces/sidebar-config';
import { SidebarContentsType } from '~/interfaces/ui';
import type { UpdateDescCountData } from '~/interfaces/websocket';
import {
  useIsNotFound, useCurrentPagePath, useIsTrashPage, useCurrentPageId,
} from '~/stores/page';
import loggerFactory from '~/utils/logger';

import {
  useIsEditable,
  useIsSharedUser, useIsIdenticalPath, useCurrentUser, useShareLinkId,
} from './context';
import { useStaticSWR } from './use-static-swr';

const { isTrashTopPage, isUsersTopPage } = pagePathUtils;

const logger = loggerFactory('growi:stores:ui');


/** **********************************************************
 *                          Unions
 *********************************************************** */

export const EditorMode = {
  View: 'view',
  Editor: 'editor',
  HackMD: 'hackmd',
} as const;
export type EditorMode = typeof EditorMode[keyof typeof EditorMode];


/** **********************************************************
 *                     Storing objects to ref
 *********************************************************** */

export const useSidebarScrollerRef = (initialData?: RefObject<SimpleBar>): SWRResponse<RefObject<SimpleBar>, Error> => {
  return useStaticSWR<RefObject<SimpleBar>, Error>('sidebarScrollerRef', initialData);
};

export const useCurrentPageTocNode = (): SWRResponse<HtmlElementNode, any> => {
  const { data: currentPagePath } = useCurrentPagePath();

  return useStaticSWR(['currentPageTocNode', currentPagePath]);
};

/** **********************************************************
 *                          SWR Hooks
 *                      for switching UI
 *********************************************************** */

export const useIsMobile = (): SWRResponse<boolean, Error> => {
  const key = isClient() ? 'isMobile' : null;

  let configuration;
  if (isClient()) {
    const userAgent = window.navigator.userAgent.toLowerCase();
    configuration = {
      fallbackData: /iphone|ipad|android/.test(userAgent),
    };
  }

  return useStaticSWR<boolean, Error>(key, undefined, configuration);
};

const getClassNamesByEditorMode = (editorMode: EditorMode | undefined): string[] => {
  const classNames: string[] = [];
  switch (editorMode) {
    case EditorMode.Editor:
      classNames.push('editing', 'builtin-editor');
      break;
    case EditorMode.HackMD:
      classNames.push('editing', 'hackmd');
      break;
  }

  return classNames;
};

export const EditorModeHash = {
  View: '',
  Edit: '#edit',
  HackMD: '#hackmd',
} as const;
export type EditorModeHash = typeof EditorModeHash[keyof typeof EditorModeHash];

export const isEditorModeHash = (hash: string): hash is EditorModeHash => Object.values<string>(EditorModeHash).includes(hash);

const updateHashByEditorMode = (newEditorMode: EditorMode) => {
  const { pathname, search } = window.location;

  switch (newEditorMode) {
    case EditorMode.View:
      window.history.replaceState(null, '', `${pathname}${search}${EditorModeHash.View}`);
      break;
    case EditorMode.Editor:
      window.history.replaceState(null, '', `${pathname}${search}${EditorModeHash.Edit}`);
      break;
    case EditorMode.HackMD:
      window.history.replaceState(null, '', `${pathname}${search}${EditorModeHash.HackMD}`);
      break;
  }
};

export const determineEditorModeByHash = (): EditorMode => {
  if (isServer()) {
    return EditorMode.View;
  }

  const { hash } = window.location;

  switch (hash) {
    case EditorModeHash.Edit:
      return EditorMode.Editor;
    case EditorModeHash.HackMD:
      return EditorMode.HackMD;
    default:
      return EditorMode.View;
  }
};

type EditorModeUtils = {
  getClassNamesByEditorMode: () => string[],
}

export const useEditorMode = (): SWRResponseWithUtils<EditorModeUtils, EditorMode> => {
  const { data: _isEditable } = useIsEditable();

  const editorModeByHash = determineEditorModeByHash();

  const isLoading = _isEditable === undefined;
  const isEditable = !isLoading && _isEditable;
  const initialData = isEditable ? editorModeByHash : EditorMode.View;

  const swrResponse = useSWRImmutable(
    isLoading ? null : ['editorMode', isEditable],
    null,
    { fallbackData: initialData },
  );

  // construct overriding mutate method
  const mutateOriginal = swrResponse.mutate;
  const mutate = useCallback((editorMode: EditorMode, shouldRevalidate?: boolean) => {
    if (!isEditable) {
      return Promise.resolve(EditorMode.View); // fixed if not editable
    }
    updateHashByEditorMode(editorMode);
    return mutateOriginal(editorMode, shouldRevalidate);
  }, [isEditable, mutateOriginal]);

  const getClassNames = useCallback(() => {
    return getClassNamesByEditorMode(swrResponse.data);
  }, [swrResponse.data]);

  return Object.assign(swrResponse, {
    mutate,
    getClassNamesByEditorMode: getClassNames,
  });
};

export const useIsDeviceSmallerThanMd = (): SWRResponse<boolean, Error> => {
  const key: Key = isClient() ? 'isDeviceSmallerThanMd' : null;

  const { cache, mutate } = useSWRConfig();

  useEffect(() => {
    if (isClient()) {
      const mdOrAvobeHandler = function(this: MediaQueryList): void {
        // sm -> md: matches will be true
        // md -> sm: matches will be false
        mutate(key, !this.matches);
      };
      const mql = addBreakpointListener(Breakpoint.MD, mdOrAvobeHandler);

      // initialize
      if (cache.get(key)?.data == null) {
        cache.set(key, { ...cache.get(key), data: !mql.matches });
      }

      return () => {
        cleanupBreakpointListener(mql, mdOrAvobeHandler);
      };
    }
  }, [cache, key, mutate]);

  return useStaticSWR(key);
};

export const useIsDeviceSmallerThanLg = (): SWRResponse<boolean, Error> => {
  const key: Key = isClient() ? 'isDeviceSmallerThanLg' : null;

  const { cache, mutate } = useSWRConfig();

  useEffect(() => {
    if (isClient()) {
      const lgOrAvobeHandler = function(this: MediaQueryList): void {
        // md -> lg: matches will be true
        // lg -> md: matches will be false
        mutate(key, !this.matches);
      };
      const mql = addBreakpointListener(Breakpoint.LG, lgOrAvobeHandler);

      // initialize
      if (cache.get(key)?.data == null) {
        cache.set(key, { ...cache.get(key), data: !mql.matches });
      }

      return () => {
        cleanupBreakpointListener(mql, lgOrAvobeHandler);
      };
    }
  }, [cache, key, mutate]);

  return useStaticSWR(key);
};

type PreferDrawerModeByUserUtils = {
  update: (preferDrawerMode: boolean) => void
}

export const usePreferDrawerModeByUser = (initialData?: boolean): SWRResponseWithUtils<PreferDrawerModeByUserUtils, boolean> => {
  const { scheduleToPut } = useUserUISettings();

  const swrResponse: SWRResponse<boolean, Error> = useStaticSWR('preferDrawerModeByUser', initialData);

  const utils: PreferDrawerModeByUserUtils = {
    update: (preferDrawerMode: boolean) => {
      swrResponse.mutate(preferDrawerMode);
      scheduleToPut({ preferDrawerModeByUser: preferDrawerMode });
    },
  };

  return withUtils<PreferDrawerModeByUserUtils>(swrResponse, utils);

};

export const usePreferDrawerModeOnEditByUser = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useStaticSWR('preferDrawerModeOnEditByUser', initialData, { fallbackData: true });
};

export const useSidebarCollapsed = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useStaticSWR('isSidebarCollapsed', initialData, { fallbackData: false });
};

export const useCurrentSidebarContents = (initialData?: SidebarContentsType): SWRResponse<SidebarContentsType, Error> => {
  return useStaticSWR('sidebarContents', initialData, { fallbackData: SidebarContentsType.TREE });
};

export const useCurrentProductNavWidth = (initialData?: number): SWRResponse<number, Error> => {
  return useStaticSWR('productNavWidth', initialData, { fallbackData: 320 });
};

export const useDrawerMode = (): SWRResponse<boolean, Error> => {
  const { data: preferDrawerModeByUser } = usePreferDrawerModeByUser();
  const { data: preferDrawerModeOnEditByUser } = usePreferDrawerModeOnEditByUser();
  const { data: editorMode } = useEditorMode();
  const { data: isDeviceSmallerThanMd } = useIsDeviceSmallerThanMd();

  const condition = editorMode != null && preferDrawerModeByUser != null && preferDrawerModeOnEditByUser != null && isDeviceSmallerThanMd != null;

  const calcDrawerMode = (
      endpoint: string,
      editorMode: EditorMode,
      preferDrawerModeByUser: boolean,
      preferDrawerModeOnEditByUser: boolean,
      isDeviceSmallerThanMd: boolean,
  ): boolean => {
    // get preference on view or edit
    const preferDrawerMode = editorMode !== EditorMode.View ? preferDrawerModeOnEditByUser : preferDrawerModeByUser;

    return isDeviceSmallerThanMd ?? preferDrawerMode ?? false;
  };

  const isViewModeWithPreferDrawerMode = editorMode === EditorMode.View && preferDrawerModeByUser;
  const isEditModeWithPreferDrawerMode = editorMode !== EditorMode.View && preferDrawerModeOnEditByUser;
  const isDrawerModeFixed = isViewModeWithPreferDrawerMode || isEditModeWithPreferDrawerMode;

  return useSWRImmutable(
    condition ? ['isDrawerMode', editorMode, preferDrawerModeByUser, preferDrawerModeOnEditByUser, isDeviceSmallerThanMd] : null,
    // calcDrawerMode,
    key => calcDrawerMode(...key),
    condition
      ? {
        fallbackData: isDrawerModeFixed
          ? true
          : calcDrawerMode('isDrawerMode', editorMode, preferDrawerModeByUser, preferDrawerModeOnEditByUser, isDeviceSmallerThanMd),
      }
      : undefined,
  );
};

type SidebarConfigOption = {
  update: () => Promise<void>,
  isSidebarDrawerMode: boolean|undefined,
  isSidebarClosedAtDockMode: boolean|undefined,
  setIsSidebarDrawerMode: (isSidebarDrawerMode: boolean) => void,
  setIsSidebarClosedAtDockMode: (isSidebarClosedAtDockMode: boolean) => void
}

export const useSWRxSidebarConfig = (): SWRResponse<ISidebarConfig, Error> & SidebarConfigOption => {
  const swrResponse = useSWRImmutable(
    '/customize-setting/sidebar',
    endpoint => apiv3Get(endpoint).then(result => result.data),
  );
  return {
    ...swrResponse,
    update: async() => {
      const { data } = swrResponse;

      if (data == null) {
        return;
      }

      const { isSidebarDrawerMode, isSidebarClosedAtDockMode } = data;

      const updateData = {
        isSidebarDrawerMode,
        isSidebarClosedAtDockMode,
      };

      // invoke API
      await apiv3Put('/customize-setting/sidebar', updateData);
    },
    isSidebarDrawerMode: swrResponse.data?.isSidebarDrawerMode,
    isSidebarClosedAtDockMode: swrResponse.data?.isSidebarClosedAtDockMode,
    setIsSidebarDrawerMode: (isSidebarDrawerMode) => {
      const { data, mutate } = swrResponse;

      if (data == null) {
        return;
      }

      const updateData = {
        isSidebarDrawerMode,
      };

      // update isSidebarDrawerMode in cache, not revalidate
      mutate({ ...data, ...updateData }, false);

    },
    setIsSidebarClosedAtDockMode: (isSidebarClosedAtDockMode) => {
      const { data, mutate } = swrResponse;

      if (data == null) {
        return;
      }

      const updateData = {
        isSidebarClosedAtDockMode,
      };

      // update isSidebarClosedAtDockMode in cache, not revalidate
      mutate({ ...data, ...updateData }, false);
    },
  };
};

export const useDrawerOpened = (isOpened?: boolean): SWRResponse<boolean, Error> => {
  return useStaticSWR('isDrawerOpened', isOpened, { fallbackData: false });
};

export const useSidebarResizeDisabled = (isDisabled?: boolean): SWRResponse<boolean, Error> => {
  return useStaticSWR('isSidebarResizeDisabled', isDisabled, { fallbackData: false });
};

export const useSelectedGrant = (initialData?: Nullable<IPageGrantData>): SWRResponse<Nullable<IPageGrantData>, Error> => {
  return useStaticSWR<Nullable<IPageGrantData>, Error>('selectedGrant', initialData, { fallbackData: { grant: PageGrant.GRANT_PUBLIC } });
};

export const useGlobalSearchFormRef = (initialData?: RefObject<IFocusable>): SWRResponse<RefObject<IFocusable>, Error> => {
  return useStaticSWR('globalSearchTypeahead', initialData);
};

type PageTreeDescCountMapUtils = {
  update(newData?: UpdateDescCountData): Promise<UpdateDescCountData | undefined>
  getDescCount(pageId?: string): number | null | undefined
}

export const usePageTreeDescCountMap = (initialData?: UpdateDescCountData): SWRResponse<UpdateDescCountData, Error> & PageTreeDescCountMapUtils => {
  const key = 'pageTreeDescCountMap';

  const swrResponse = useStaticSWR<UpdateDescCountData, Error>(key, initialData, { fallbackData: new Map() });

  return {
    ...swrResponse,
    getDescCount: (pageId?: string) => (pageId != null ? swrResponse.data?.get(pageId) : null),
    update: (newData: UpdateDescCountData) => swrResponse.mutate(new Map([...(swrResponse.data || new Map()), ...newData])),
  };
};

/** **********************************************************
 *                          SWR Hooks
 *                Determined value by context
 *********************************************************** */

export const useIsAbleToShowTrashPageManagementButtons = (): SWRResponse<boolean, Error> => {
  const { data: currentUser } = useCurrentUser();
  const { data: isTrashPage } = useIsTrashPage();

  return useStaticSWR('isAbleToShowTrashPageManagementButtons', isTrashPage && currentUser != null);
};

export const useIsAbleToShowPageManagement = (): SWRResponse<boolean, Error> => {
  const key = 'isAbleToShowPageManagement';
  const { data: currentPageId } = useCurrentPageId();
  const { data: _isTrashPage } = useIsTrashPage();
  const { data: _isSharedUser } = useIsSharedUser();
  const { data: isNotFound } = useIsNotFound();

  const pageId = currentPageId;
  const includesUndefined = [pageId, _isTrashPage, _isSharedUser, isNotFound].some(v => v === undefined);
  const isPageExist = (pageId != null) && isNotFound === false;
  const isEmptyPage = (pageId != null) && isNotFound === true;
  const isTrashPage = isPageExist && _isTrashPage === true;
  const isSharedUser = isPageExist && _isSharedUser === true;

  return useSWRImmutable(
    includesUndefined ? null : [key, pageId, isPageExist, isEmptyPage, isTrashPage, isSharedUser],
    ([, , isPageExist, isEmptyPage, isTrashPage, isSharedUser]) => (isPageExist && !isTrashPage && !isSharedUser) || isEmptyPage,
  );
};

export const useIsAbleToShowTagLabel = (): SWRResponse<boolean, Error> => {
  const key = 'isAbleToShowTagLabel';
  const { data: pageId } = useCurrentPageId();
  const { data: currentPagePath } = useCurrentPagePath();
  const { data: isIdenticalPath } = useIsIdenticalPath();
  const { data: isNotFound } = useIsNotFound();
  const { data: editorMode } = useEditorMode();
  const { data: shareLinkId } = useShareLinkId();

  const includesUndefined = [currentPagePath, isIdenticalPath, isNotFound, editorMode].some(v => v === undefined);

  const isViewMode = editorMode === EditorMode.View;

  return useSWRImmutable(
    includesUndefined ? null : [key, pageId, currentPagePath, isIdenticalPath, isNotFound, editorMode, shareLinkId],
    // "/trash" page does not exist on page collection and unable to add tags
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => !isUsersTopPage(currentPagePath!) && !isTrashTopPage(currentPagePath!) && shareLinkId == null && !isIdenticalPath && !(isViewMode && isNotFound),
  );
};

export const useIsAbleToChangeEditorMode = (): SWRResponse<boolean, Error> => {
  const key = 'isAbleToChangeEditorMode';
  const { data: isEditable } = useIsEditable();
  const { data: isSharedUser } = useIsSharedUser();

  const includesUndefined = [isEditable, isSharedUser].some(v => v === undefined);

  return useSWRImmutable(
    includesUndefined ? null : [key, isEditable, isSharedUser],
    () => !!isEditable && !isSharedUser,
  );
};

export const useIsAbleToShowPageAuthors = (): SWRResponse<boolean, Error> => {
  const key = 'isAbleToShowPageAuthors';
  const { data: pageId } = useCurrentPageId();
  const { data: pagePath } = useCurrentPagePath();
  const { data: isNotFound } = useIsNotFound();

  const includesUndefined = [pageId, pagePath, isNotFound].some(v => v === undefined);
  const isPageExist = (pageId != null) && !isNotFound;
  const isUsersTopPagePath = pagePath != null && isUsersTopPage(pagePath);

  return useSWRImmutable(
    includesUndefined ? null : [key, pageId, pagePath, isNotFound],
    () => isPageExist && !isUsersTopPagePath,
  );
};
