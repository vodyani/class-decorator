import {
  toValidated,
  toEachValidate,
  toValidateRequired,
  getReflectOwnMetadata,
  toCustomValidate,
} from '../method';
import {
  Class,
  RequiredKey,
  ValidatedKey,
  PromiseMethod,
  EachValidatedKey,
  ValidateMetaData,
  CustomValidatedKey,
  ArgumentValidateOptions,
  ValidateMethod,
} from '../common';

/**
 * Specify a method parameter that must be passed in, or throw an exception.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `ArgumentValidator` !
 *
 * @param message The error message. (default: `missing required argument !`)
 *
 * @publicApi
 */
export function Required(message?: string) {
  return function(target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(RequiredKey, target, property);
    const metadata: ValidateMetaData = { index, message };

    data.push(metadata);

    Reflect.defineMetadata(RequiredKey, data, target, property);
  };
}
/**
 * Specify a method parameter for the method that needs to be executed in the validator.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `ArgumentValidator` !
 *
 * @publicApi
 */
export function Validated(target: any, property: any, index: number) {
  const data = getReflectOwnMetadata(ValidatedKey, target, property);
  const metadata: ValidateMetaData = { index };

  data.push(metadata);
  Reflect.defineMetadata(ValidatedKey, data, target, property);
}
/**
 * Specify a method parameter that needs to be executed in the validator, and this parameter needs to be looped through.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `ArgumentValidator` !
 *
 * @param type The classes that need to be validated.
 *
 * @publicApi
 */
export function EachValidated(type: Class) {
  return function (target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(EachValidatedKey, target, property);
    const metadata: ValidateMetaData = { index, type };

    data.push(metadata);

    Reflect.defineMetadata(EachValidatedKey, data, target, property);
  };
}
/**
 * Validate parameters using custom validators.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `ArgumentValidator` !
 *
 * @param validator The validation function.
 * @param message The error message.
 *
 * @publicApi
 */
export function CustomValidated(validator: ValidateMethod, message: string) {
  return function(target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(CustomValidatedKey, target, property);
    const metadata: ValidateMetaData = { index, message, validator };

    data.push(metadata);

    Reflect.defineMetadata(CustomValidatedKey, data, target, property);
  };
}
/**
 * Method validator, needs to be used in combination with other parameter decorators.
 *
 * @param options The argument validator options.
 *
 * @publicApi
 */
export function ArgumentValidator(options?: ArgumentValidateOptions) {
  return function(target: any, property: string, descriptor: TypedPropertyDescriptor<PromiseMethod>) {
    const method = descriptor.value;
    const errorMode = options?.Mode || Error;

    descriptor.value = async function(...args: any[]) {
      toCustomValidate(args, target, property, errorMode);
      toValidateRequired(args, target, property, errorMode);

      await toValidated(args, target, property, errorMode, options);
      await toEachValidate(args, target, property, errorMode, options);

      const result = await method.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
