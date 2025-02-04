import type { ColorScheme, IUserHasId } from '@growi/core';
import { SWRResponse } from 'swr';
import useSWRImmutable from 'swr/immutable';

import { SupportedActionType } from '~/interfaces/activity';
import { EditorConfig } from '~/interfaces/editor-settings';
import { RendererConfig } from '~/interfaces/services/renderer';
import InterceptorManager from '~/services/interceptor-manager';

import { TargetAndAncestors } from '../interfaces/page-listing-results';

import { useContextSWR } from './use-context-swr';
import { useStaticSWR } from './use-static-swr';


type Nullable<T> = T | null;


export const useInterceptorManager = (): SWRResponse<InterceptorManager, Error> => {
  return useContextSWR<InterceptorManager, Error>('interceptorManager', undefined, { fallbackData: new InterceptorManager() });
};

export const useCsrfToken = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR<string, Error>('csrfToken', initialData);
};

export const useAppTitle = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR('appTitle', initialData);
};

export const useSiteUrl = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR<string, Error>('siteUrl', initialData);
};

export const useConfidential = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR('confidential', initialData);
};

export const useCurrentUser = (initialData?: Nullable<IUserHasId>): SWRResponse<Nullable<IUserHasId>, Error> => {
  return useContextSWR('currentUser', initialData);
};

export const useCurrentPathname = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR('currentPathname', initialData);
};

export const useIsIdenticalPath = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isIdenticalPath', initialData, { fallbackData: false });
};

export const useIsForbidden = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isForbidden', initialData, { fallbackData: false });
};

export const useIsNotCreatable = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isNotCreatable', initialData, { fallbackData: false });
};

export const useIsSharedUser = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isSharedUser', initialData);
};

export const useShareLinkId = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR('shareLinkId', initialData);
};

export const useDisableLinkSharing = (initialData?: Nullable<boolean>): SWRResponse<Nullable<boolean>, Error> => {
  return useContextSWR<Nullable<boolean>, Error>('disableLinkSharing', initialData);
};

export const useRegistrationWhiteList = (initialData?: Nullable<string[]>): SWRResponse<Nullable<string[]>, Error> => {
  return useContextSWR<Nullable<string[]>, Error>('registrationWhiteList', initialData);
};

export const useDrawioUri = (initialData?: Nullable<string>): SWRResponse<string, Error> => {
  return useContextSWR('drawioUri', initialData ?? undefined, { fallbackData: 'https://embed.diagrams.net/' });
};

export const useHackmdUri = (initialData?: Nullable<string>): SWRResponse<Nullable<string>, Error> => {
  return useContextSWR<Nullable<string>, Error>('hackmdUri', initialData);
};

export const useIsSearchPage = (initialData?: Nullable<boolean>) : SWRResponse<Nullable<boolean>, Error> => {
  return useContextSWR<Nullable<any>, Error>('isSearchPage', initialData);
};

export const useTargetAndAncestors = (initialData?: TargetAndAncestors): SWRResponse<TargetAndAncestors, Error> => {
  return useContextSWR<TargetAndAncestors, Error>('targetAndAncestors', initialData);
};

export const useIsAclEnabled = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isAclEnabled', initialData);
};

export const useIsSearchServiceConfigured = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isSearchServiceConfigured', initialData);
};

export const useIsSearchServiceReachable = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isSearchServiceReachable', initialData);
};

export const useIsMailerSetup = (initialData?: boolean): SWRResponse<boolean, any> => {
  return useContextSWR('isMailerSetup', initialData);
};

export const useIsSearchScopeChildrenAsDefault = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isSearchScopeChildrenAsDefault', initialData, { fallbackData: false });
};

export const useIsSlackConfigured = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isSlackConfigured', initialData);
};

export const useIsEnabledAttachTitleHeader = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isEnabledAttachTitleHeader', initialData);
};

export const useIsIndentSizeForced = (initialData?: boolean) : SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('isIndentSizeForced', initialData, { fallbackData: false });
};

export const useDefaultIndentSize = (initialData?: number) : SWRResponse<number, Error> => {
  return useContextSWR<number, Error>('defaultIndentSize', initialData, { fallbackData: 4 });
};

export const useAuditLogEnabled = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR<boolean, Error>('auditLogEnabled', initialData, { fallbackData: false });
};

// TODO: initialize in [[..path]].page.tsx?
export const useActivityExpirationSeconds = (initialData?: number) : SWRResponse<number, Error> => {
  return useContextSWR<number, Error>('activityExpirationSeconds', initialData);
};

export const useAuditLogAvailableActions = (initialData?: Array<SupportedActionType>) : SWRResponse<Array<SupportedActionType>, Error> => {
  return useContextSWR<Array<SupportedActionType>, Error>('auditLogAvailableActions', initialData);
};

export const useGrowiVersion = (initialData?: string): SWRResponse<string, any> => {
  return useContextSWR('growiVersion', initialData);
};

export const useIsEnabledStaleNotification = (initialData?: boolean): SWRResponse<boolean, any> => {
  return useContextSWR('isEnabledStaleNotification', initialData);
};

export const useEditorConfig = (initialData?: EditorConfig): SWRResponse<EditorConfig, Error> => {
  return useContextSWR<EditorConfig, Error>('editorConfig', initialData);
};

export const useRendererConfig = (initialData?: RendererConfig): SWRResponse<RendererConfig, any> => {
  return useContextSWR('growiRendererConfig', initialData);
};

export const useIsAllReplyShown = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR('isAllReplyShown', initialData);
};

export const useIsBlinkedHeaderAtBoot = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR('isBlinkedAtBoot', initialData, { fallbackData: false });
};

export const useIsUploadableImage = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR('isUploadableImage', initialData);
};

export const useIsUploadableFile = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR('isUploadableFile', initialData);
};

export const useShowPageLimitationL = (initialData?: number): SWRResponse<number, Error> => {
  return useContextSWR('showPageLimitationL', initialData);
};

export const useShowPageLimitationXL = (initialData?: number): SWRResponse<number, Error> => {
  return useContextSWR('showPageLimitationXL', initialData);
};

export const useCustomizeTitle = (initialData?: string): SWRResponse<string, Error> => {
  return useContextSWR('CustomizeTitle', initialData);
};

export const useIsDefaultLogo = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useContextSWR('isDefaultLogo', initialData);
};

export const useIsCustomizedLogoUploaded = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useStaticSWR('isCustomizedLogoUploaded', initialData);
};

export const useForcedColorScheme = (initialData?: ColorScheme): SWRResponse<ColorScheme, Error> => {
  return useContextSWR('forcedColorScheme', initialData);
};

export const useGrowiCloudUri = (initialData?: string): SWRResponse<string, Error> => {
  return useStaticSWR('growiCloudUri', initialData);
};

export const useGrowiAppIdForGrowiCloud = (initialData?: number): SWRResponse<number, Error> => {
  return useStaticSWR('growiAppIdForGrowiCloud', initialData);
};

export const useIsContainerFluid = (initialData?: boolean): SWRResponse<boolean, Error> => {
  return useStaticSWR('isContainerFluid', initialData);
};

/** **********************************************************
 *                     Computed contexts
 *********************************************************** */

export const useIsGuestUser = (): SWRResponse<boolean, Error> => {
  const { data: currentUser, isLoading } = useCurrentUser();

  return useSWRImmutable(
    isLoading ? null : ['isGuestUser', currentUser?._id],
    ([, currentUserId]) => currentUserId == null,
    { fallbackData: currentUser?._id == null },
  );
};

export const useIsEditable = (): SWRResponse<boolean, Error> => {
  const { data: isGuestUser } = useIsGuestUser();
  const { data: isForbidden } = useIsForbidden();
  const { data: isNotCreatable } = useIsNotCreatable();
  const { data: isIdenticalPath } = useIsIdenticalPath();

  return useSWRImmutable(
    ['isEditable', isGuestUser, isForbidden, isNotCreatable, isIdenticalPath],
    ([, isGuestUser, isForbidden, isNotCreatable, isIdenticalPath]) => {
      return (!isForbidden && !isIdenticalPath && !isNotCreatable && !isGuestUser);
    },
  );
};
