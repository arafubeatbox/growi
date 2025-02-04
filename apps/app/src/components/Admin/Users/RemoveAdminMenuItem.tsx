import React, { useCallback } from 'react';

import type { IUserHasId } from '@growi/core';
import { useTranslation } from 'next-i18next';

import AdminUsersContainer from '~/client/services/AdminUsersContainer';
import { toastSuccess, toastError } from '~/client/util/toastr';
import { useCurrentUser } from '~/stores/context';

import { withUnstatedContainers } from '../../UnstatedUtils';


const RemoveAdminAlert = React.memo((): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <i className="icon-fw icon-user-unfollow mb-2"></i>{t('admin:user_management.user_table.remove_admin_access')}
      <p className="alert alert-danger">{t('admin:user_management.user_table.cannot_remove')}</p>
    </div>
  );
});
RemoveAdminAlert.displayName = 'RemoveAdminAlert';


type Props = {
  adminUsersContainer: AdminUsersContainer,
  user: IUserHasId,
}

const RemoveAdminMenuItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('admin');

  const { adminUsersContainer, user } = props;

  const { data: currentUser } = useCurrentUser();

  const clickRemoveAdminBtnHandler = useCallback(async() => {
    try {
      const username = await adminUsersContainer.removeUserAdmin(user._id);
      toastSuccess(t('toaster.remove_user_admin', { username }));
    }
    catch (err) {
      toastError(err);
    }
  }, [adminUsersContainer, t, user._id]);


  return user.username !== currentUser?.username
    ? (
      <button className="dropdown-item" type="button" onClick={clickRemoveAdminBtnHandler}>
        <i className="icon-fw icon-user-unfollow"></i> {t('user_management.user_table.remove_admin_access')}
      </button>
    )
    : <RemoveAdminAlert />;
};

/**
* Wrapper component for using unstated
*/
// eslint-disable-next-line max-len
const RemoveAdminMenuItemWrapper: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<any>> = withUnstatedContainers(RemoveAdminMenuItem, [AdminUsersContainer]);

export default RemoveAdminMenuItemWrapper;
