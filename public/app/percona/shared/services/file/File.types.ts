export interface GetFilePayload {
  name: string;
}

export interface GetFileResponse {
  name: string;
  /**
   * Base64 encoded file content
   */
  content: string;
  updated_at: string;
}

export interface UpdateFilePayload {
  name: string;
  /**
   * Base64 encoded file content
   */
  content: string;
}
