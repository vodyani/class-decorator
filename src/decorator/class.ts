import { boundMethod } from 'autobind-decorator';

/**
 * This decorator is used to make the methods of a class forcibly bind to the `this` property.
 *
 * @see [autobind-decorator](https://www.npmjs.com/package/autobind-decorator)
 *
 * @publicApi
 */
export const This = boundMethod;
