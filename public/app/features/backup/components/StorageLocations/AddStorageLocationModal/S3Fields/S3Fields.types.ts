import { TypeFieldCommonProps } from '../AddStorageLocationModal.types';

export interface S3FieldsProps extends TypeFieldCommonProps {
  endpoint?: string;
  accessKey?: string;
  secretKey?: string;
  bucketName?: string;
}
