/* eslint-disable @typescript-eslint/ban-ts-comment */
import { toNumber, toString } from '@vodyani/utils';
import { describe, it, expect } from '@jest/globals';

import { ResultTransformer, ArgumentTransformer } from '../src';

describe('convert', () => {
  it('ResultTransformer', async () => {
    class Demo {
      @ResultTransformer(toString)
      public getName() {
        return null as any;
      }

      @ResultTransformer(toNumber)
      public async asyncGetName() {
        return null as any;
      }
    }

    const demo = new Demo();

    expect(demo.getName()).toBe('');
    expect(await demo.asyncGetName()).toBe(0);
  });

  it('ArgumentTransformer', async () => {
    function fn(...args: any[]) {
      return args.map(toNumber);
    }

    class Demo {
      @ArgumentTransformer(fn)
      public returnAge(age: number) {
        return age;
      }
    }

    expect(new Demo().returnAge('1' as any)).toBe(1);
  });
});
