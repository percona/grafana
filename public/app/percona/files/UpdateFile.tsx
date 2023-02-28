import React, { useState } from 'react';

import { Button, Field, FileDropzone, Form, Input, Legend, TextArea } from '@grafana/ui';

import { FileService } from '../shared/services/file/File.service';
import { GetFileResponse } from '../shared/services/file/File.types';

const UpdateFile: React.FC = () => {
  const [result, setResult] = useState<GetFileResponse>();

  const handleSubmit = async ({ name, content }: { name: string; content: string }) => {
    await FileService.update({ name, content: btoa(content) });
    const result = await FileService.get(name);

    setResult(result);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {({ register, formState: { isSubmitting }, setValue }) => (
          <>
            <Legend>Update File</Legend>
            <Field label="Name">
              <Input {...register('name')} />
            </Field>
            <Field label="Content">
              <TextArea {...register('content')} />
            </Field>
            <FileDropzone readAs="readAsText" onLoad={(result) => setValue('content', String(result))} />
            <Button type="submit" disabled={isSubmitting}>
              Update Content
            </Button>
          </>
        )}
      </Form>
      {result && <pre>{result.content || 'No content'}</pre>}
    </div>
  );
};

export default UpdateFile;
