import { ValidatorOptions } from 'class-validator';

import { ClassTransformOptions } from './declare';

export interface Class<T = any> extends Function {
  new (...args: any[]): T;
}

export interface ValidateMetaData {
  /** The argument index. */
  index: number;
  /** The classes that need to be validated. */
  type?: Class;
  /** The error message. */
  message?: string;
  /** The custom validation function */
  validator?: (...args: any[]) => boolean;
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

