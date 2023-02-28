import React, { FC } from 'react';

import GetFile from './GetFile';
import UpdateFile from './UpdateFile';

const FilesPage: FC = () => {
  return (
    <div>
      <hr />
      <h1>Files</h1>
      <GetFile />
      <hr />
      <UpdateFile />
    </div>
  );
};

export default FilesPage;
