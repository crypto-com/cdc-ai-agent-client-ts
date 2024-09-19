export enum HttpCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export enum HttpStatus {
  Success = 'success',
  Failed = 'failed',
}

export enum HttpMessages {
  InvalidApiKey = 'Invalid API key',
  AuthorizationFailed = 'Failed to authorize endpoint',
  MessageOk = 'OK',
}

export interface VerificationErrorModel {
  [key: string]: string;
}

export interface Output {
  action: string;
  message: string;
  object: object;
}
