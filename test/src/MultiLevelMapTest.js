import assert from 'power-assert';

import MultiLevelMap from '../../src/MultiLevelMap.js';

/* eslint-disable no-undef */

/**
 * These tests confirm the API of MultiLevelMap.
 *
 * @test {MultiLevelMap}
 */
describe('MultiLevelMap Test', () =>
{
   it('map delete (invalid)', () =>
   {
      const map = new MultiLevelMap();

      assert.throws(() => { map.delete(); }, Error);
   });

   it('map get (invalid)', () =>
   {
      const map = new MultiLevelMap();

      assert.throws(() => { map.get(); }, Error);
   });

   it('map has (invalid)', () =>
   {
      const map = new MultiLevelMap();

      assert.throws(() => { map.has(); }, Error);
   });

   it('map set (invalid)', () =>
   {
      const map = new MultiLevelMap();

      assert.throws(() => { map.set(); }, Error);
      assert.throws(() => { map.set('key1'); }, Error);

      map.set('key1', 1);
      assert.throws(() => { map.set('key1', 'key2', 'key3', 3); }, Error);

      map.set('key1A', 'key2A', 1);
      assert.throws(() => { map.set('key1A', 'key2A', 'key3A', 3); }, Error);
   });

   it('map set / clear / has', () =>
   {
      const map = new MultiLevelMap();

      map.set('key1', 1);
      map.clear();
      assert(map.has('key1') === false);

      map.set('key1A', 'key2A', 2);
      map.clear();
      assert(map.has('key1A', 'key2A') === false);

      map.set('key1', 1);
      map.set('key1A', 'key2A', 2);

      map.clear('key1');
      assert(map.has('key1A', 'key2A') === true);

      map.set('key1A', 'key2A', 3);
      map.clear('key1A', 'key2A');
      assert(map.has('key1A', 'key2A') === true);

      map.clear('key1A');
      assert(map.has('key1A', 'key2A') === false);
   });

   it('map set / entries', () =>
   {
      const map = new MultiLevelMap();

      assert(map.entries().next().value === undefined);
      assert(map.entries().next().done === true);

      map.set('key1', 1);
      map.set('key1A', 'key2A', 2);

      let iter = map.entries();

      let result = iter.next();

      assert(result.value[0] === 'key1');
      assert(result.value[1] === 1);
      assert(result.done === false);

      result = iter.next();

      assert(result.value[0] === 'key1A');
      assert(result.value[1] instanceof Map);

      assert(iter.next().done === true);

      iter = map.entries('key1A');

      result = iter.next();

      assert(result.value[0] === 'key2A');
      assert(result.value[1] === 2);

      assert(iter.next().done === true);

      iter = map.entries('unknown');
      assert(iter.next().done === true);

      iter = map.entries('unknown', 'unknown');
      assert(iter.next().done === true);
   });

   it('map set / get', () =>
   {
      const map = new MultiLevelMap();

      assert(map.set('key1', 1) instanceof Map);
      assert(map.set('key1A', 'key2A', 2) instanceof Map);

      assert(map.get('key1') === 1);
      assert(map.get('key1A', 'key2A') === 2);

      assert(map.get('key1A') instanceof Map);

      map.set('key1', 10);
      map.set('key1A', 'key2A', 12);

      assert(map.get('key1') === 10);
      assert(map.get('key1A', 'key2A') === 12);

      assert(map.get('key2') === undefined);
      assert(map.get('key1A', 'key2A', 'key3A') === undefined);
   });

   it('map set / has', () =>
   {
      const map = new MultiLevelMap();

      map.set('key1', 1);
      map.set('key1A', 'key2A', 2);

      assert(map.has('key1'));
      assert(map.has('key1A', 'key2A'));

      assert(map.has('key1A'));

      assert(!map.has('key2'));
      assert(!map.has('key1A', 'key2A', 'key3A'));
   });

   it('map set / isMap', () =>
   {
      const map = new MultiLevelMap();

      assert(map.isMap());

      map.set('key1A', 'key2A', 1);

      assert(map.isMap('key1A'));

      map.set('key1B', 'key2B', 'key3B', 'key4B', 2);

      assert(map.isMap('key1B'));
      assert(map.isMap('key1B', 'key2B'));
      assert(map.isMap('key1B', 'key2B', 'key3B'));
      assert(!map.isMap('key1B', 'key2B', 'key3B', 'key4B'));

      assert(!map.isMap('unknown'));
      assert(!map.isMap('unknown', 'unknown'));
   });

   it('map set / keys', () =>
   {
      const map = new MultiLevelMap();

      assert(map.keys().next().value === undefined);
      assert(map.keys().next().done === true);

      map.set('key1', 1);
      map.set('key1A', 'key2A', 2);

      let iter = map.keys();
      assert(iter.next().value === 'key1');
      assert(iter.next().value === 'key1A');
      assert(iter.next().done === true);

      iter = map.keys('key1A');
      assert(iter.next().value === 'key2A');
      assert(iter.next().done === true);

      iter = map.keys('unknown');
      assert(iter.next().done === true);

      iter = map.keys('unknown', 'unknown');
      assert(iter.next().done === true);
   });

   it('map set / size', () =>
   {
      const map = new MultiLevelMap();

      assert(map.size() === 0);
      assert(map.size('key1') === 0);

      map.set('key1', 1);
      map.set('key2', 2);

      assert(map.size() === 2);

      map.set('key1A', 'key2A', 3);

      assert(map.size() === 3);

      assert(map.size('key1A') === 1);

      map.set('key1A', 'key2B', 4);

      assert(map.size('key1A') === 2);

      assert(map.size('unknown', 'unknown', 'unknown') === 0);
   });

   it('map set / values', () =>
   {
      const map = new MultiLevelMap();

      assert(map.values().next().value === undefined);
      assert(map.values().next().done === true);

      map.set('key1', 1);
      map.set('key1A', 'key2A', 2);

      let iter = map.values();
      assert(iter.next().value === 1);
      assert(iter.next().value instanceof Map);
      assert(iter.next().done === true);

      iter = map.values('key1A');
      assert(iter.next().value === 2);
      assert(iter.next().done === true);

      iter = map.values('unknown');
      assert(iter.next().done === true);

      iter = map.values('unknown', 'unknown');
      assert(iter.next().done === true);
   });
});