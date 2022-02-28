import React from 'react';
import { useTranslation } from 'react-i18next';

import { IPageWithMeta } from '~/interfaces/page';
import { OnDeletedFunction } from '~/interfaces/ui';

import { PageListItemL } from './PageListItemL';


type Props = {
  pages: IPageWithMeta[],
  isEnableActions?: boolean,
  onPagesDeleted?: OnDeletedFunction,
}

const PageList = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const { pages, isEnableActions, onPagesDeleted } = props;

  if (pages == null) {
    return (
      <div className="wiki">
        <div className="text-muted text-center">
          <i className="fa fa-2x fa-spinner fa-pulse mr-1"></i>
        </div>
      </div>
    );
  }

  const pageList = pages.map(page => (
    <PageListItemL
      key={page.data._id}
      page={page}
      isEnableActions={isEnableActions}
      onPageDeleted={onPagesDeleted}
    />
  ));

  if (pageList.length === 0) {
    return (
      <div className="mt-2">
        <p>{t('custom_navigation.no_page_list')}</p>
      </div>
    );
  }

  return (
    <div className="page-list">
      <ul className="page-list-ul list-group-flush">
        {pageList}
      </ul>
    </div>
  );
};

export default PageList;
