/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/member-ordering */
import 'reflect-metadata';
import { isMap, isSet } from 'util/types';

import { PickType } from '@nestjs/swagger';
import { toNumber, toString } from '@vodyani/utils';
import { describe, it, expect } from '@jest/globals';
import { Expose, Exclude, Type } from 'class-transformer';

import { toAssemble, Assemble, TransformValue, TransformMap, TransformSet } from '../src';

class User {
  // @ts-ignore
  @Expose() public name: string;
  // @ts-ignore
  @Expose() @TransformValue(toNumber) public age: number;
}

class PartOfUser extends PickType(User, ['age']) {}

class ExcludeDemo {
  // @ts-ignore
  title: string;
  // @ts-ignore
  @Exclude() password: string;
  // @ts-ignore
  @Expose() @TransformValue(toString) name: string;
}

class Demo {
  // @ts-ignore
  @Expose() @Type(() => User) public user: User;
  // @ts-ignore
  @Expose() @Type(() => User) public userArray: User[];
  // @ts-ignore
  @Expose() @TransformSet(User) public userSet: Set<User>;
  // @ts-ignore
  @Expose() @TransformMap(User) public userMap: Map<string, User>;
}

class Service {
  @Assemble(Demo)
  // @ts-ignore
  public async getDemo(): Promise<Demo> {
    const user = { name: 'vodyani', age: 'USER' };
    const userArray = [{ age: '20' }];
    const userSet = new Set([{ name: 'vodyani', age: '20' }]);
    const userMap = new Map([['vodyani', { age: '20' }]]);
    return Object({ user, userArray, userSet, userMap });
  }

  @Assemble(ExcludeDemo)
  // @ts-ignore
  public getExcludeDemo(): ExcludeDemo {
    return Object({ password: '123' });
  }
}

describe('test class', () => {
  it('expose', async () => {
    const result = await new Service().getDemo();
    expect(result.user.age).toBe(0);
    expect(result.userArray[0].age).toBe(20);
    expect(result.userArray[0].name).toBe(undefined);
    expect(isSet(result.userSet)).toBe(true);
    expect(isMap(result.userMap)).toBe(true);
    expect(result.userMap.get('vodyani')).toEqual({ name: undefined, age: 20 });
  });

  it('exclude', async () => {
    const result = new Service().getExcludeDemo();
    expect(result.password).toBe(undefined);
    expect(result.name).toBe('');
    expect(result).toEqual({ name: '' });
  });

  it('toAssemble', async () => {
    const result = toAssemble(
      ExcludeDemo,
      { password: '123', other: 2 },
      { excludeExtraneousValues: false },
    );

    expect(result).toEqual({ other: 2, name: '' });

    const result2 = toAssemble(
      PartOfUser,
      {},
    );

    expect(result2).toEqual({ age: 0 });

    class User2 {
      // @ts-ignore
      @Expose() @TransformValue((name: string) => toString(name, 'demo')) public name: string;
      // @ts-ignore
      @Expose() @TransformValue(toNumber) public age: number;
      // @ts-ignore
      @Expose() public setData: Set<string>;
      // @ts-ignore
      @Expose() public arrayData: Array<string>;
    }

    expect(toAssemble(User2)).toEqual({ name: 'demo', age: 0 });
  });
});
