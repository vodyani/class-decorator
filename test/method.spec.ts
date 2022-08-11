/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PickType } from '@nestjs/swagger';
import { describe, it, expect } from '@jest/globals';

import { Expose, Type, IsNumber, IsString } from '../src/common';
import { ValidateNested, TransformSet, TransformMap, IsNotEmpty, toValidateClass } from '../src';

describe('test', () => {
  it('toValidateClass', async () => {
    // @ts-ignore
    class DICT { @IsNotEmpty({ message: 'test' }) public name: string; }

    // @ts-ignore
    class BASE { @ValidateNested() @Type(() => DICT) public dict: DICT[]; }

    const Base = new BASE();
    Base.dict = [{ name: null as any }];
    const message = await toValidateClass(BASE, Base);
    expect(message).toBe(null);
  });

  it('toValidateClass', async () => {
    class DEMO {
      // @ts-ignore
      @Expose() @IsNotEmpty() @IsNumber({ allowNaN: false }) test: number;
    }

    class Test {
      // @ts-ignore
      @IsNotEmpty() @IsNumber({ allowNaN: false }) @Expose() age: number;
      // @ts-ignore
      @IsNotEmpty() @IsString() @Expose() name: string;
    }

    class PartOfDemo extends PickType(Test, ['name']) {}

    class Dict {
      // @ts-ignore
      @ValidateNested() @Expose() @Type(() => PartOfDemo) public item: PartOfDemo;
      // @ts-ignore
      @ValidateNested({ each: true }) @Expose() @Type(() => PartOfDemo) public array: PartOfDemo[];
      // @ts-ignore
      @ValidateNested({ each: true }) @Expose() @TransformSet(PartOfDemo) public set: Set<PartOfDemo>;
      // @ts-ignore
      @ValidateNested({ each: true }) @Expose() @TransformMap(PartOfDemo) public map: Map<string, PartOfDemo>;
    }

    expect(await toValidateClass(DEMO, { test: 1 })).toBe(null);
    expect(
      await toValidateClass(
        DEMO,
        { demo: 1 },
        {
          validate: { forbidUnknownValues: true },
        },
      ),
    ).toBe('test must be a number conforming to the specified constraints');

    expect(await toValidateClass(DEMO, { test: Number('test') })).toBe('test must be a number conforming to the specified constraints');
    expect(await toValidateClass(DEMO, { test: 'test' })).toBe('test must be a number conforming to the specified constraints');
    expect(await toValidateClass(PartOfDemo, { name: 'test' })).toBe(null);
    expect(await toValidateClass(PartOfDemo, { name: 1 })).toBe('name must be a string');
    expect(await toValidateClass(Dict, { item: { name: 1 }})).toBe('name must be a string');
  });
});
