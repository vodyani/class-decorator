/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { isValidBuffer, toNumber, isValid } from '@vodyani/utils';

import {
  ValidateNested, IsNotEmpty, IsNumber, IsArray, IsObject,
  Type, Expose, TransformSet, TransformMap, TransformValue, Assemble,
  IsString, ArgumentValidator, AssembleValidator, ValidateIf, Validated, Required, EachValidated, CustomValidated,
} from '../src';

// base test

class DemoData {
  // @ts-ignore
  @Expose() @IsNumber({ allowNaN: false }, { message: 'number is not valid' }) @IsNotEmpty({ message: 'id is required' }) public id: number;
  // @ts-ignore
  @Expose() @ValidateIf((item: DemoData) => isValid(item.name)) @IsString({ message: 'name is not valid' }) public name?: string;
}

class Demo {
  // @ts-ignore
  @AssembleValidator() async getData(@Validated data: DemoData) { return data }
  // @ts-ignore
  @AssembleValidator({ validate: { forbidUnknownValues: true }}) async getData2(@Validated data: DemoData) { return data }

  // @ts-ignore
  @ArgumentValidator(UnauthorizedException)
  // @ts-ignore
  @AssembleValidator({ error: UnauthorizedException })
  // @ts-ignore
  async getData3(@Validated data: DemoData, @Required('test') name?: string) { return { name, data } }

  // @ts-ignore
  @AssembleValidator() async getData4(@EachValidated(DemoData) list: DemoData[]) { return list }
  // @ts-ignore
  @ArgumentValidator(UnauthorizedException) async getData5(@Required() list: DemoData[]) { return list }
  // @ts-ignore
  @AssembleValidator({ error: UnauthorizedException }) async getData6(@EachValidated(DemoData) list: DemoData[]) { return list }
  // @ts-ignore
  @AssembleValidator({ error: UnauthorizedException }) async getData7(@EachValidated(DemoData) list: DemoData[]) { throw new Error(JSON.stringify(list)) }
  // @ts-ignore
  @AssembleValidator() async getData8(@EachValidated(DemoData) map: Map<DemoData>) { return map }
  // @ts-ignore
  @AssembleValidator() async getData9(@EachValidated(DemoData) set: Set<DemoData>) { return set }
  // @ts-ignore
  @ArgumentValidator() async getData10(@CustomValidated(isValidBuffer, 'not buffer') buffer: Buffer) { return buffer }
}

describe('base test', () => {
  it('ArgumentValidator', async () => {
    const demo = new Demo();

    const data = await demo.getData({ id: 1, name: 'test' });
    expect(data.id).toEqual(1);

    const data2 = await demo.getData({ id: 2 });
    expect(data2.id).toEqual(2);

    try {
      await demo.getData({ id: null as any });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData({ id: Number('test') });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData({ id: 1, name: 2 as any });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData2({ id: 1, name: 2 as any });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData3({ id: 2 });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }

    try {
      await demo.getData4([{ id: '1' as any }]);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData5(null as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData6(null as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData7([{ id: 1, name: 'test' }]);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      const data = Object({ id: 1, name: 'test' });
      const map = new Map([['key', data]]);
      const result = await demo.getData8(map);

      expect(result).toEqual(map);

      const map2 = new Map([['key', Object()]]);
      await demo.getData8(map2);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      const map2 = new Set([Object()]);
      await demo.getData9(map2);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData10(null as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    const buffer = Buffer.from([]);
    const result = await demo.getData10(buffer);

    expect(result).toEqual(buffer);
  });
});

// advanced test
class User {
  // @ts-ignore
  @IsString() @Expose() public name: string;
  // @ts-ignore
  @IsNumber() @Expose() @TransformValue(toNumber) public age: number;
}

class Demo2 {
  // @ts-ignore
  @IsObject() @ValidateNested() @Expose() @Type(() => User) public user: User;
  // @ts-ignore
  @IsArray() @ValidateNested({ each: true }) @Expose() @Type(() => User) public userArray: User[];
  // @ts-ignore
  @IsNotEmpty() @ValidateNested({ each: true }) @Expose() @TransformSet(User) public userSet: Set<User>;
  // @ts-ignore
  @IsNotEmpty() @ValidateNested({ each: true }) @Expose() @TransformMap(User) public userMap: Map<string, User>;
}

class Service {
  @Assemble(Demo2)
  // @ts-ignore
  public async getDemo2(): Promise<Demo2> {
    const user = { name: 'vodyani', age: 'USER' };
    const userArray = [{ name: 'vodyani', age: '20' }];
    const userSet = new Set([{ name: 'vodyani', age: '20' }]);
    const userMap = new Map([['vodyani', { name: 'vodyani', age: '20' }]]);
    return { user, userArray, userSet, userMap } as any;
  }

  @AssembleValidator()
  // @ts-ignore
  public async test(@Validated demo2: Demo2) {
    return demo2;
  }
}

describe('advanced test', () => {
  it('test pass validation', async () => {
    const service = new Service();
    const demo2 = await service.getDemo2();
    const result = await service.test(demo2);
    expect(result).toEqual(demo2);
  });

  it('failed', async () => {
    const service = new Service();
    try {
      await service.test({
        user: { name: 'vodyani', age: 'USER' },
        userArray: [{ name: 'vodyani', age: '20' }],
        userSet: new Set([{ name: 'vodyani', age: '20' }]),
        userMap: new Map([['vodyani', { age: '20' }]]),
      } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
