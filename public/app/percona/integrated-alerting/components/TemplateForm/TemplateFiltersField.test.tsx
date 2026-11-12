import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import TemplateFiltersField from './TemplateFiltersField';
import { Messages } from './TemplateForm.messages';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({ defaultValues: { filters: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const setup = (description?: string) =>
  render(
    <Wrapper>
      <TemplateFiltersField description={description} />
    </Wrapper>
  );

describe('Messages.getFiltersDescription', () => {
  it('does not add the QAN hint for Metrics-based templates', () => {
    expect(Messages.getFiltersDescription(false)).toBe(Messages.tooltips.filters);
  });

  it('adds the QAN hint for ClickHouse-based templates', () => {
    expect(Messages.getFiltersDescription(true)).toBe(
      `${Messages.tooltips.filters} ${Messages.tooltips.filtersQanHint}`
    );
  });
});

describe('TemplateFiltersField', () => {
  it('falls back to the default filters description when none is given', () => {
    const { container } = setup();

    expect(container.textContent).toContain(Messages.tooltips.filters);
  });

  it('renders whatever description it is given', () => {
    const { container } = setup('a custom description');

    expect(container.textContent).toContain('a custom description');
  });
});
