import React, { ReactElement } from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { Form } from 'react-final-form';
import { Config } from 'final-form';
import { act } from 'react-dom/test-utils';

export const getMount = async (node: ReactElement): Promise<ReactWrapper> => {
  let wrapper: ReactWrapper = {} as ReactWrapper;

  //@ts-ignore
  await act(async () => {
    wrapper = await mount(node);
  });

  return wrapper;
};

export const getShallow = async (node: ReactElement): Promise<ShallowWrapper> => {
  let wrapper: ShallowWrapper = {} as ShallowWrapper;

  //@ts-ignore
  await act(async () => {
    wrapper = await shallow(node);
  });

  return wrapper;
};

export const asyncAct = (cb: () => any): Promise<any> => {
  //@ts-ignore
  return act(async () => cb());
};

export const getFormWrapper = (node: ReactElement, onSubmit: Config['onSubmit'] = () => {}) =>
  mount(<Form onSubmit={onSubmit} render={() => <form>{node}</form>} />);
