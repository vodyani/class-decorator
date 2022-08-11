/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/member-ordering */
import { describe, it, expect } from '@jest/globals';

import { This } from '../src';

describe('class', () => {
  it('This', async () => {
    class User {
      private readonly name = 'demo';
      private readonly age = 1;

      public getName() {
        return this.name;
      }

      @This
      // @ts-ignore
      public getAge() {
        return this.age;
      }
    }

    const user = new User();
    const fn = (cb: Function) => cb();

    try {
      fn(user.getName);
    } catch (error) {
      expect(error.message).toBe('Cannot read properties of undefined (reading \'name\')');
    }

    expect(fn(user.getAge)).toBe(1);
  });
});
