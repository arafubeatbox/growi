import React, {
  useEffect, useState,
} from 'react';

import { IRevisionHasId, IRevisionHasPageId } from '@growi/core';
import { useTranslation } from 'next-i18next';

import { useCurrentPageId } from '~/stores/context';
import { useSWRxInfinitePageRevisions } from '~/stores/page';

import InfiniteScroll from '../InfiniteScroll';
import { RevisionComparer } from '../RevisionComparer/RevisionComparer';

import { Revision } from './Revision';

import styles from './PageRevisionTable.module.scss';

type PageRevisionTAble = {
  onClose: () => void,
}

export const PageRevisionTable = (props: PageRevisionTAble): JSX.Element => {
  const { t } = useTranslation();

  const REVISIONS_PER_PAGE = 10;

  const {
    onClose,
  } = props;


  const { data: currentPageId } = useCurrentPageId();
  const swrInifiniteResponse = useSWRxInfinitePageRevisions(currentPageId);

  const { data: revisionsData } = swrInifiniteResponse;
  const revisions = revisionsData && revisionsData[0];
  const oldestRevision = revisions && revisions[revisions.length - 1];


  const isEmpty = revisionsData?.[0].length === 0;
  const isReachingEnd = isEmpty
   || (revisionsData && revisionsData[revisionsData.length - 1]?.length < REVISIONS_PER_PAGE);


  const [sourceRevision, setSourceRevision] = useState<IRevisionHasPageId>();
  const [targetRevision, setTargetRevision] = useState<IRevisionHasPageId>();
  const latestRevision = revisionsData != null ? revisionsData[0][0] : null;


  useEffect(() => {
    if (latestRevision != null) {
      setSourceRevision(latestRevision);
      setTargetRevision(latestRevision);
    }
  }, [latestRevision]);

  const onChangeSourceInvoked: React.Dispatch<React.SetStateAction<IRevisionHasId | undefined>> = (revision: IRevisionHasPageId) => {
    setSourceRevision(revision);
  };
  const onChangeTargetInvoked: React.Dispatch<React.SetStateAction<IRevisionHasId | undefined>> = (revision: IRevisionHasPageId) => {
    setTargetRevision(revision);
  };


  const renderRow = (revision: IRevisionHasPageId, previousRevision: IRevisionHasPageId, latestRevision: IRevisionHasPageId,
      isOldestRevision: boolean, hasDiff: boolean) => {

    const revisionId = revision._id;

    const handleCompareLatestRevisionButton = () => {
      onChangeSourceInvoked(revision);
      onChangeTargetInvoked(latestRevision);
    };

    const handleComparePreviousRevisionButton = () => {
      onChangeSourceInvoked(previousRevision);
      onChangeTargetInvoked(revision);
    };

    return (
      <tr className="d-flex" key={`revision-history-${revisionId}`}>
        <td className="col" key={`revision-history-top-${revisionId}`}>
          <div className="d-lg-flex">
            <Revision
              revision={revision}
              isLatestRevision={revision === latestRevision}
              hasDiff={hasDiff}
              key={`revision-history-rev-${revisionId}`}
              onClose={onClose}
            />
            {hasDiff && (
              <div className="ml-md-3 mt-auto">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleCompareLatestRevisionButton}
                  >
                    {t('page_history.compare_latest')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleComparePreviousRevisionButton}
                    disabled={isOldestRevision}
                  >
                    {t('page_history.compare_previous')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="col-1">
          {(hasDiff || revisionId === sourceRevision?._id) && (
            <div className="custom-control custom-radio custom-control-inline mr-0">
              <input
                type="radio"
                className="custom-control-input"
                id={`compareSource-${revisionId}`}
                name="compareSource"
                value={revisionId}
                checked={revisionId === sourceRevision?._id}
                onChange={() => onChangeSourceInvoked(revision)}
              />
              <label className="custom-control-label" htmlFor={`compareSource-${revisionId}`} />
            </div>
          )}
        </td>
        <td className="col-2">
          {(hasDiff || revisionId === targetRevision?._id) && (
            <div className="custom-control custom-radio custom-control-inline mr-0">
              <input
                type="radio"
                className="custom-control-input"
                id={`compareTarget-${revisionId}`}
                name="compareTarget"
                value={revisionId}
                checked={revisionId === targetRevision?._id}
                onChange={() => onChangeTargetInvoked(revision)}
              />
              <label className="custom-control-label" htmlFor={`compareTarget-${revisionId}`} />
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <>
      <table className={`${styles['revision-history-table']} table revision-history-table`}>
        <thead>
          <tr className="d-flex">
            <th className="col">{t('page_history.revision')}</th>
            <th className="col-1">{t('page_history.comparing_source')}</th>
            <th className="col-2">{t('page_history.comparing_target')}</th>
          </tr>
        </thead>
        <tbody className="overflow-auto d-block">
          {revisions && (
            <InfiniteScroll
              swrInifiniteResponse={swrInifiniteResponse}
              isReachingEnd={isReachingEnd}
              isLoadingIndicatorShown ={false}
            >
              {pageRevisions => pageRevisions.map((revision, idx) => {

                const previousRevision = (idx + 1 < revisions?.length) ? revisions[idx + 1] : revision;

                const isOldestRevision = revision === oldestRevision;
                const latestRevision = revisions[0];

                // set 'true' if undefined for backward compatibility
                const hasDiff = revision.hasDiffToPrev !== false;
                return renderRow(revision, previousRevision, latestRevision, isOldestRevision, hasDiff);
              })}
            </InfiniteScroll>
          )}
        </tbody>
      </table>

      { sourceRevision && targetRevision && (
        <RevisionComparer
          sourceRevision={sourceRevision}
          targetRevision={targetRevision}
          onClose={onClose}
        />)
      }
    </>
  );

};
