import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import loggerFactory from '@alias/logger';

import { withUnstatedContainers } from '../../UnstatedUtils';
import { toastError } from '../../../util/apiNotification';

import MarkDownSettingContents from './MarkDownSettingContents';
import AdminMarkDownContainer from '../../../services/AdminMarkDownContainer';

const logger = loggerFactory('growi:MarkDown');

function MarkdownSetting(props) {
  return (
    <Suspense
      fallback={(
        <div className="row">
          <i className="fa fa-5x fa-spinner fa-pulse mx-auto text-muted"></i>
        </div>
      )}
    >
      <RenderMarkdownSettingWrapper />
    </Suspense>
  );
}

function RenderMarkdownSetting(props) {
  const { adminMarkDownContainer } = props;

  if (adminMarkDownContainer.state.isEnabledLinebreaks === adminMarkDownContainer.dummyIsEnabledLinebreaks) {
    throw new Promise(async() => {
      try {
        await adminMarkDownContainer.retrieveMarkdownData();
      }
      catch (err) {
        toastError(err);
        adminMarkDownContainer.setState({ retrieveError: err.message });
        logger.error(err);
      }
    });
  }

  return <MarkDownSettingContents />;
}

const RenderMarkdownSettingWrapper = withUnstatedContainers(RenderMarkdownSetting, [AdminMarkDownContainer]);

RenderMarkdownSetting.propTypes = {
  adminMarkDownContainer: PropTypes.instanceOf(AdminMarkDownContainer).isRequired,
};

export default MarkdownSetting;
