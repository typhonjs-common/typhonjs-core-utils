/* eslint-disable no-undef */

import assert from 'power-assert';

import Utils from '../../src/Utils.js';

class TestBase {}
class Child1 extends TestBase {}
class Child2 extends Child1 {}

/**
 * This test confirms the utility functions defined in `Utils`.
 *
 * @test {isNullOrUndef}
 * @test {isTypeOf}
 */
describe('Utils Test', () =>
{
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