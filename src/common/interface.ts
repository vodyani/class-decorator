import { Method } from '@vodyani/utils';
import { ValidatorOptions } from 'class-validator';

import { ClassTransformOptions } from './declare';

/**
 * The class for typescript.
 */
export interface Class<T = any> extends Function {
  new (...args: any[]): T;
}
/**
 * Choices for conversion functions.
 */
export interface ConvertOptions {
  /**
   * When the received value does not correspond to expectations, this value is returned.
   *
   * @default null
   */
  default?: any;
  /**
   * The conversion is carried out if the outcome of the conditional validation function execution is true.
   *
   * @empale (num: number) => num > 0
   */
  condition?: Method;
  /**
   * The process that carries out the transition.
   *
   * @empale (data: any) => Number(data)
   */
  transformer?: Method;
}

export interface ValidateMetaData {
  /** The argument index. */
  index: number;
  /** The classes that need to be validated. */
  type?: Class;
  /** The error message. */
  message?: string;
  /** The custom validation function */
  validator?: Method<boolean>;
}

/**
 * The class-validator options.
 *
 * It's highly advised to set forbidUnknownValues: true as it will prevent unknown objects from passing validation.
 *
 * @see [ValidatorOptions](https://github.com/typestack/class-validator#passing-options)
 */
export interface ArgumentValidateOptions extends ClassValidateOptions {
  /** The error mode */
  error?: Class<Error>;
}

export interface ClassValidateOptions {
  /**
   * The class-validator options.
   *
   * It's highly advised to set forbidUnknownValues: true as it will prevent unknown objects from passing validation.
   *
   * @see [ValidatorOptions](https://github.com/typestack/class-validator#passing-options)
   */
  validate?: ValidatorOptions;
  /**
   * The class-transformer options. (`excludeExtraneousValues` is enabled by default)
   *
   * @see [ClassTransformOptions](https://github.com/typestack/class-transformer#advanced-usage)
   */
  transform?: ClassTransformOptions;
}

