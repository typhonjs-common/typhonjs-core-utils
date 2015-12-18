/* eslint-disable no-undef */

import assert from 'power-assert';

import btoa from '../../src/btoa.js';

/**
 * This test confirms the btoa function defined in `btoa.js`.
 *
 * @test {btoa}
 */
describe('BtoA Test', () =>
{
   it('encode', () =>
   {
      const encoded = btoa('This is a test!');

      assert(encoded === 'VGhpcyBpcyBhIHRlc3Qh');
   });
});