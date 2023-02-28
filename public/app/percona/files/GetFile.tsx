import React, { useState } from 'react';

import { Button, Field, Form, Input, Legend } from '@grafana/ui';

import { FileService } from '../shared/services/file/File.service';
import { GetFileResponse } from '../shared/services/file/File.types';

const GetFile: React.FC = () => {
  const [result, setResult] = useState<GetFileResponse>();

  const handleGetFile = async ({ name }: { name: string }) => {
    const result = await FileService.get(name);

    setResult(result);
  };
  return (
    <div>
      <Form onSubmit={handleGetFile}>
        {({ register, formState: { isSubmitting } }) => (
          <>
            <Legend>Get File</Legend>
            <Field label="File Name">
              <Input {...register('name')} />
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              Get Content
            </Button>
          </>
        )}
      </Form>
      {result && <pre>{atob(result.content || '') || 'No content'}</pre>}
    </div>
  );
};

export default GetFile;
