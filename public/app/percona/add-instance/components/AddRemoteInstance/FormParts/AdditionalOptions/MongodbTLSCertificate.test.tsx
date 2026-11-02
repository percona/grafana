import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { MongodbTLSCertificate } from './MongodbTLSCertificate';

describe('MongodbTLSCertificate::', () => {
  it('names the key file password as the API does, which drops unknown fields', () => {
    const { container } = render(
      <Form
        onSubmit={jest.fn()}
        initialValues={{ tls: true }}
        render={({ form }) => <MongodbTLSCertificate form={form} />}
      />
    );

    expect(container.querySelector('input[name="tls_certificate_key_file_password"]')).toBeInTheDocument();
  });
});
