import { isPromise } from 'util/types';

import { Method } from '../common';

/**
 * A transformer is passed in after the function has completed execution to change the function's output.
 *
 * @param transformer The process that carries out the transition.
 *
 * @publicApi
 */
export function ResultTransformer(transformer: Method) {
  return function (_target: any, _property: string, descriptor: TypedPropertyDescriptor<Method>) {
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const result = method.apply(this, args);
      return isPromise(result) ? result.then(it => transformer(it)) : transformer(result);
    };

    return descriptor;
  };
}
/**
 * The function's arguments are modified using the passed transformer before the function is called.
 *
 * @param transformer The process that carries out the transition.
 *
 * @publicApi
 */
export function ArgumentTransformer(transformer: Method) {
  return function (_target: any, _property: string, descriptor: TypedPropertyDescriptor<Method>) {
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      return method.apply(this, transformer(...args));
    };

    return descriptor;
  };
}
