export interface CdcAiAgentResponse {
  status: Status;
  result: {
    action: string;
    message: string;
    data: object;
  };
}

export enum Status {
  Success = 'Success',
  Failed = 'Failed',
}

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
};

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
