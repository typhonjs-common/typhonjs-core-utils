import { assert } from 'chai';

import Utils      from '../../src/Utils.js';

/* eslint-disable no-undef */

class TestBase {}
class Child1 extends TestBase {}
class Child2 extends Child1 {}

/**
 * This test confirms the utility functions defined in `Utils`.
 *
 * @test {invokeOrValue}
 * @test {isNullOrUndef}
 * @test {isTypeOf}
 */
describe('Utils Test', () =>
{
   it('invokeOrValue', () =>
   {
      const object =
      {
         testFunc: () => { return 'testFunc'; },
         testValue: 'testValue'
      };

      assert(Utils.invokeOrValue(object, 'testFunc') === 'testFunc');
      assert(Utils.invokeOrValue(object, 'testValue') === 'testValue');
   });

   it('isNullOrUndef', () =>
   {
      const valueNull = null;
      const valueUndefined = undefined;
      const valueDefined = 1;

      assert(Utils.isNullOrUndef(valueNull));
      assert(Utils.isNullOrUndef(valueUndefined));
      assert(!Utils.isNullOrUndef(valueDefined));
   });

   it('isTypeOf', () =>
   {
      assert(!Utils.isTypeOf(Error, TestBase));
      assert(!Utils.isTypeOf(Child2, Error));

      assert(Utils.isTypeOf(TestBase, TestBase));
      assert(Utils.isTypeOf(Child1, TestBase));
      assert(Utils.isTypeOf(Child2, TestBase));
      assert(Utils.isTypeOf(Child2, Child1));
   });
});