import { getLinkSrv } from 'app/features/panel/panellinks/link_srv';

export const useLinkWithVariables = (url?: string) => {
  if (url?.match('/d/')) {
    return getLinkSrv().getLinkUrl({
      url: url,
      keepTime: true,
      includeVars: true,
    });
  } else {
    return url ? url : '#';
  }
};
