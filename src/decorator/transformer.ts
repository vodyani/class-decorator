import { isPromise } from 'util/types';

import { ClassTransformOptions, Transform } from 'class-transformer';

import { toAssemble } from '../method';
import { Class, Method } from '../common';

/**
 * Following the function's successful completion, the result is automatically loaded using the class that was supplied.
 *
 * @tips This decorator should only be used if the return value is specified.
 *
 * @see [ClassTransformOptions](https://github.com/typestack/class-transformer#advanced-usage)
 *
 * @param type The intended class for conversion.
 * @param options The class-transformer options. (`excludeExtraneousValues` is enabled by default)
 *
 * @publicApi
 */
export function Assemble(type: Class, options?: ClassTransformOptions) {
  return function(_target: any, _property: string, descriptor: TypedPropertyDescriptor<Method>) {
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const result = method.apply(this, args);

      return isPromise(result)
        ? result.then((data: object) => toAssemble(type, data, options))
        : toAssemble(type, result, options);
    };

    return descriptor;
  };
}
/**
 * The transformation decorator of the data.
 *
 * @see [@Transform](https://github.com/typestack/class-transformer#basic-usage)
 *
 * @param transformer The process that carries out the transition.
 * @param args The transformer argument.
 *
 * @publicApi
 */
export function TransformValue(transformer: Method, ...args: []) {
  return Transform(({ value }) => transformer(value, ...args));
}
/**
 * The transformation decorator of the `Set` data.
 *
 * @tips
 * - It doesn't need to be used with [`@Type`](https://github.com/typestack/class-transformer#%D1%81onverting-date-strings-into-date-objects).
 * - Because the `@Type` decorator does not properly convert nested structures in `Set`.
 *
 * @see [ClassTransformOptions](https://github.com/typestack/class-transformer#advanced-usage)
 *
 * @param type The intended class for conversion.
 * @param options The class-transformer options. (`excludeExtraneousValues` is enabled by default)
 *
 * @publicApi
 */
export function TransformSet(type: Class, options?: ClassTransformOptions) {
  return Transform(({ value }) => {
    if (value) {
      const result = new Set();
      value.forEach((it: any) => result.add(toAssemble(type, it, options)));
      return result;
    }
  });
}
/**
 * The transformation decorator of the `Map` data.
 *
 * @tips
 * - It doesn't need to be used with [`@Type`](https://github.com/typestack/class-transformer#%D1%81onverting-date-strings-into-date-objects).
 * - Because the `@Type` decorator does not properly convert nested structures in `Map`.
 *
 * @see [ClassTransformOptions](https://github.com/typestack/class-transformer#advanced-usage)
 *
 * @param type The intended class for conversion.
 * @param options The class-transformer options. (`excludeExtraneousValues` is enabled by default)
 *
 * @publicApi
 */
export function TransformMap(type: Class, options?: ClassTransformOptions) {
  return Transform(({ obj, key }) => {
    const value: Map<any, Class> = obj[key];

    if (value) {
      const result: Map<any, Class> = new Map();
      value.forEach((v, k) => result.set(k, toAssemble(type, v, options)));
      return result;
    }
  });
}
