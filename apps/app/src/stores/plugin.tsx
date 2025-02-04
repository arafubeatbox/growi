import useSWR, { SWRResponse } from 'swr';

import { apiv3Get } from '~/client/util/apiv3-client';
import { GrowiPluginHasId } from '~/interfaces/plugin';

type Plugins = {
  plugins: GrowiPluginHasId[]
}

const pluginsFetcher = () => {
  return async() => {
    const reqUrl = '/plugins';

    try {
      const res = await apiv3Get(reqUrl);
      return res.data;
    }
    catch (err) {
      throw new Error(err);
    }
  };
};

export const useSWRxPlugins = (): SWRResponse<Plugins, Error> => {
  return useSWR('/plugins', pluginsFetcher());
};
