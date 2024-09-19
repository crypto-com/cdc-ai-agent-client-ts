import winston, { createLogger, format, transports } from 'winston';

/**
 * A Winston log format wrapper that modifies log information for error objects.
 *
 * @param {winston.Logform.TransformableInfo} info - Log information that may contain an error object.
 * @returns {winston.Logform.TransformableInfo} The transformed log information.
 *
 * @example
 * const data = enumerateErrorFormat();
 */
export const enumerateErrorFormat: winston.Logform.FormatWrap = format(
  (info: winston.Logform.TransformableInfo) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  }
);

export const logger: winston.Logger = createLogger({
  level: 'info',
  format: format.combine(
    enumerateErrorFormat(),
    format.colorize(),
    format.splat(),
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});
