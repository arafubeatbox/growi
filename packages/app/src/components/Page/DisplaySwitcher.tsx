import React, { useCallback, useEffect, useMemo } from 'react';

import { pagePathUtils } from '@growi/core';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { Link } from 'react-scroll';

import { DEFAULT_AUTO_SCROLL_OPTS } from '~/client/util/smooth-scroll';
import { SocketEventName } from '~/interfaces/websocket';
import {
  useIsSharedUser, useIsEditable, useShareLinkId, useIsNotFound,
} from '~/stores/context';
import { useDescendantsPageListModal } from '~/stores/modal';
import { useCurrentPagePath, useSWRxCurrentPage } from '~/stores/page';
import {
  useRemoteRevisionBody, useRemoteRevisionId, useRemoteRevisionLastUpdatedAt, useRemoteRevisionLastUpdatUser, useSetRemoteLatestPageData,
} from '~/stores/remote-latest-page';
import { EditorMode, useEditorMode } from '~/stores/ui';
import { useGlobalSocket } from '~/stores/websocket';

import CountBadge from '../Common/CountBadge';
import { ContentLinkButtonsProps } from '../ContentLinkButtons';
import CustomTabContent from '../CustomNavigation/CustomTabContent';
import PageListIcon from '../Icons/PageListIcon';
import { Page } from '../Page';
import TableOfContents from '../TableOfContents';
import { UserInfoProps } from '../User/UserInfo';

import styles from './DisplaySwitcher.module.scss';

const { isTopPage, isUsersHomePage } = pagePathUtils;


const PageEditor = dynamic(() => import('../PageEditor'), { ssr: false });
const PageEditorByHackmd = dynamic(() => import('../PageEditorByHackmd').then(mod => mod.PageEditorByHackmd), { ssr: false });
const EditorNavbarBottom = dynamic(() => import('../PageEditor/EditorNavbarBottom'), { ssr: false });
const HashChanged = dynamic(() => import('../EventListeneres/HashChanged'), { ssr: false });
const ContentLinkButtons = dynamic<ContentLinkButtonsProps>(() => import('../ContentLinkButtons').then(mod => mod.ContentLinkButtons), { ssr: false });
const NotFoundPage = dynamic(() => import('../NotFoundPage'), { ssr: false });
const UserInfo = dynamic<UserInfoProps>(() => import('../User/UserInfo').then(mod => mod.UserInfo), { ssr: false });


const PageView = React.memo((): JSX.Element => {
  const { t } = useTranslation();

  const { data: currentPagePath } = useCurrentPagePath();
  const { data: isSharedUser } = useIsSharedUser();
  const { data: shareLinkId } = useShareLinkId();
  const { data: isNotFound } = useIsNotFound();
  const { data: currentPage } = useSWRxCurrentPage(shareLinkId ?? undefined);
  const { open: openDescendantPageListModal } = useDescendantsPageListModal();
  const { setRemoteLatestPageData } = useSetRemoteLatestPageData();
  // const { mutate: mutateRemoteRevisionId } = useRemoteRevisionId();
  // const { mutate: mutateRemoteRevisionLastUpdateUser } = useRemoteRevisionLastUpdatUser();
  // const { mutate: mutateRemoteRevisionBody } = useRemoteRevisionBody();
  // const { mutate: mutateRemoteRevisionLastUpdatedAt } = useRemoteRevisionLastUpdatedAt();

  const isTopPagePath = isTopPage(currentPagePath ?? '');
  const isUsersHomePagePath = isUsersHomePage(currentPagePath ?? '');

  const { data: socket } = useGlobalSocket();

  const setLatestRemotePageData = useCallback((data) => {
    const { s2cMessagePageUpdated } = data;

    const remoteData = {
      remoteRevisionId: s2cMessagePageUpdated.revisionId,
      remoteRevisionBody: s2cMessagePageUpdated.revisionBody,
      remoteRevisionLastUpdateUser: s2cMessagePageUpdated.remoteLastUpdateUser,
      remoteRevisionLastUpdatedAt: s2cMessagePageUpdated.revisionUpdateAt,
    };
    setRemoteLatestPageData(remoteData);
  }, [setRemoteLatestPageData]);

  // listen socket for someone updating this page
  useEffect(() => {

    if (socket == null) { return }

    socket.on(SocketEventName.PageUpdated, setLatestRemotePageData);

    return () => {
      socket.off(SocketEventName.PageUpdated, setLatestRemotePageData);
    };

  }, [setLatestRemotePageData, socket]);

  return (
    <div className="d-flex flex-column flex-lg-row">

      <div className="flex-grow-1 flex-basis-0 mw-0">
        { isUsersHomePagePath && <UserInfo author={currentPage?.creator} /> }
        { !isNotFound && <Page /> }
        { isNotFound && <NotFoundPage /> }
      </div>

      { !isNotFound && (
        <div className="grw-side-contents-container">
          <div className="grw-side-contents-sticky-container">

            {/* Page list */}
            <div className={`grw-page-accessories-control ${styles['grw-page-accessories-control']}`}>
              { currentPagePath != null && !isSharedUser && (
                <button
                  type="button"
                  className="btn btn-block btn-outline-secondary grw-btn-page-accessories rounded-pill d-flex justify-content-between align-items-center"
                  onClick={() => openDescendantPageListModal(currentPagePath)}
                  data-testid="pageListButton"
                >
                  <div className="grw-page-accessories-control-icon">
                    <PageListIcon />
                  </div>
                  {t('page_list')}
                  <CountBadge count={currentPage?.descendantCount} offset={1} />
                </button>
              ) }
            </div>

            {/* Comments */}
            { !isTopPagePath && (
              <div className={`mt-2 grw-page-accessories-control ${styles['grw-page-accessories-control']}`}>
                <Link to={'page-comments'} offset={-100} {...DEFAULT_AUTO_SCROLL_OPTS}>
                  <button
                    type="button"
                    className="btn btn-block btn-outline-secondary grw-btn-page-accessories rounded-pill d-flex justify-content-between align-items-center"
                  >
                    <i className="icon-fw icon-bubbles grw-page-accessories-control-icon"></i>
                    <span>Comments</span>
                    <CountBadge count={currentPage?.commentCount} />
                  </button>
                </Link>
              </div>
            ) }

            <div className="d-none d-lg-block">
              <TableOfContents />
              { isUsersHomePagePath && <ContentLinkButtons author={currentPage?.creator} /> }
            </div>

          </div>
        </div>
      ) }
    </div>
  );
});
PageView.displayName = 'PageView';


const DisplaySwitcher = React.memo((): JSX.Element => {

  const { data: isEditable } = useIsEditable();

  const { data: editorMode = EditorMode.View } = useEditorMode();

  const isViewMode = editorMode === EditorMode.View;

  const navTabMapping = useMemo(() => {
    return {
      [EditorMode.View]: {
        Content: () => (
          <div data-testid="page-view" id="page-view">
            <PageView />
          </div>
        ),
      },
      [EditorMode.Editor]: {
        Content: () => (
          isEditable
            ? (
              <div data-testid="page-editor" id="page-editor">
                <PageEditor />
              </div>
            )
            : <></>
        ),
      },
      [EditorMode.HackMD]: {
        Content: () => (
          isEditable
            ? (
              <div id="page-editor-with-hackmd">
                <PageEditorByHackmd />
              </div>
            )
            : <></>
        ),
      },
    };
  }, [isEditable]);


  return (
    <>
      <CustomTabContent activeTab={editorMode} navTabMapping={navTabMapping} />

      { isEditable && !isViewMode && <EditorNavbarBottom /> }
      { isEditable && <HashChanged></HashChanged> }
    </>
  );
});
DisplaySwitcher.displayName = 'DisplaySwitcher';

export default DisplaySwitcher;
