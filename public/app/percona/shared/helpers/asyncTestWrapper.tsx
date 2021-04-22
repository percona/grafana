import { ReactElement } from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

export const generateMountWrapper = async (node: ReactElement): Promise<ReactWrapper> => {
  let wrapper: ReactWrapper = null as any;

  //@ts-ignore
  await act(async () => {
    wrapper = await mount(node);
  });

  return wrapper;
};

export const generateShallowWrapper = async (node: ReactElement): Promise<ShallowWrapper> => {
  let wrapper: ShallowWrapper = null as any;

  //@ts-ignore
  await act(async () => {
    wrapper = await shallow(node);
  });

  return wrapper;
};
