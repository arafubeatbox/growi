
import React, { useState, useMemo, useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  Modal, ModalHeader, ModalBody,
} from 'reactstrap';

import { useIsSharedUser } from '~/stores/context';
import { useDescendantsPageListModal } from '~/stores/modal';

import { CustomNavTab } from './CustomNavigation/CustomNav';
import CustomTabContent from './CustomNavigation/CustomTabContent';
import { DescendantsPageListProps } from './DescendantsPageList';
import ExpandOrContractButton from './ExpandOrContractButton';
import PageListIcon from './Icons/PageListIcon';
import TimeLineIcon from './Icons/TimeLineIcon';

import styles from './DescendantsPageListModal.module.scss';

const DescendantsPageList = dynamic<DescendantsPageListProps>(() => import('./DescendantsPageList').then(mod => mod.DescendantsPageList), { ssr: false });

const PageTimeline = dynamic(() => import('./PageTimeline').then(mod => mod.PageTimeline), { ssr: false });

export const DescendantsPageListModal = (): JSX.Element => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('pagelist');
  const [isWindowExpanded, setIsWindowExpanded] = useState(false);

  const { data: isSharedUser } = useIsSharedUser();

  const { data: status, close } = useDescendantsPageListModal();

  const { events } = useRouter();

  useEffect(() => {
    events.on('routeChangeStart', close);
    return () => {
      events.off('routeChangeStart', close);
    };
  }, [close, events]);

  const navTabMapping = useMemo(() => {
    return {
      pagelist: {
        Icon: PageListIcon,
        Content: () => {
          if (status == null || status.path == null || !status.isOpened) {
            return <></>;
          }
          return <DescendantsPageList path={status.path} />;
        },
        i18n: t('page_list'),
        index: 0,
        isLinkEnabled: () => !isSharedUser,
      },
      timeline: {
        Icon: TimeLineIcon,
        Content: () => {
          if (status == null || !status.isOpened) {
            return <></>;
          }
          return <PageTimeline />;
        },
        i18n: t('Timeline View'),
        index: 1,
        isLinkEnabled: () => !isSharedUser,
      },
    };
  }, [isSharedUser, status, t]);

  const buttons = useMemo(() => (
    <div className="d-flex flex-nowrap">
      <ExpandOrContractButton
        isWindowExpanded={isWindowExpanded}
        expandWindow={() => setIsWindowExpanded(true)}
        contractWindow={() => setIsWindowExpanded(false)}
      />
      <button type="button" className="close" onClick={close} aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  ), [close, isWindowExpanded]);


  if (status == null) {
    return <></>;
  }

  const { isOpened } = status;

  return (
    <Modal
      size="xl"
      isOpen={isOpened}
      toggle={close}
      data-testid="descendants-page-list-modal"
      className={`grw-descendants-page-list-modal ${styles['grw-descendants-page-list-modal']} ${isWindowExpanded ? 'grw-modal-expanded' : ''} `}
    >
      <ModalHeader className="p-0" toggle={close} close={buttons}>
        <CustomNavTab
          activeTab={activeTab}
          navTabMapping={navTabMapping}
          breakpointToHideInactiveTabsDown="md"
          onNavSelected={v => setActiveTab(v)}
          hideBorderBottom
        />
      </ModalHeader>
      <ModalBody>
        <CustomTabContent activeTab={activeTab} navTabMapping={navTabMapping} />
      </ModalBody>
    </Modal>
  );

};
