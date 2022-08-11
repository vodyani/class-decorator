import { validate } from 'class-validator';
import { isValidArray, isValidObject } from '@vodyani/utils';

import { Class, ClassValidateOptions } from '../common';

import { toAssemble } from './transformer';

/**
 * Validate the class structure against the incoming classes and data.
 *
 * @param type The classes that need to be validated.
 * @param data The data that needs to be validated.
 * @param options The rules options for data conversion and validation.
 * @returns string (error message)
 *
 * @publicApi
 */
export async function toValidateClass(type: Class, data: any, options?: ClassValidateOptions) {
  let errorMessage: string = null;
  const validateOptions = options?.validate;
  const transformOptions = options?.transform;

  if (type) {
    const metadata = toAssemble(type, data, transformOptions);
    const errors = await validate(metadata, validateOptions);

    if (isValidArray(errors)) {
      const stack = [];

      stack.push(errors);

      while (stack.length > 0) {
        const node = stack.pop();

        for (const info of node) {
          if (isValidObject(info.constraints)) {
            errorMessage = Object.values(info.constraints)[0];

            break;
          } else {
            stack.push(info.children);
          }
        }
      }

      return errorMessage;
    }
  }

  return errorMessage;
}
