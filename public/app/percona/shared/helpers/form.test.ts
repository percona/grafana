import { FormEvent } from 'react';
import { getChosenRadioOption } from './form';

const buildEventWithLabels = (label: string): FormEvent<HTMLInputElement> => {
  const labels: HTMLLabelElement = { textContent: label } as HTMLLabelElement;
  const input: HTMLInputElement = {
    labels: ([labels] as unknown) as NodeListOf<HTMLLabelElement>,
  } as HTMLInputElement;
  const e: FormEvent<HTMLInputElement> = { target: input } as any;
  return e;
};
describe('form utils', () => {
  test('getChosenRadioOption', () => {
    expect(
      getChosenRadioOption<string>(buildEventWithLabels('Foo'), [{ label: 'Foo', value: 'foo' }])?.value
    ).toBe('foo');
    expect(
      getChosenRadioOption<string>(buildEventWithLabels('Foo'), [{ label: 'Bar', value: 'foo' }])
    ).toBeNull();
    expect(
      getChosenRadioOption<string>(buildEventWithLabels('Bar'), [
        { label: 'Foo', value: 'foo' },
        { label: 'Bar', value: 'bar' },
      ])?.value
    ).toBe('bar');
    expect(
      getChosenRadioOption<string>({ target: null } as any, [{ label: 'Bar', value: 'foo' }])
    ).toBeNull();
  });
});
