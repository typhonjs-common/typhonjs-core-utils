/**
 * Provides a multi-level Map implementation that mirrors the Map API except for exclusion of `forEach`.
 *
 * Each method takes a variable list of parameters. By not including any parameters when invoking methods of
 * `MultiLevelMap` the base Map is the target. A list of comma separated parameters will index into the backing
 * multi-level map structure.
 *
 * Errors will be thrown for methods that require a minimum number of keys including:
 * `delete(1), get(1), has(1), set(2)`. In particular set requires the actual value being set in addition to any
 * number of keys. Another caveat of set is that if at any level of indexed keys if a value is already set for the
 * given key index an Error will be thrown due to the pre-existing value not being a Map.
 *
 * @example
 * const map = new MultiLevelMap();
 *
 * map.set('key1', 'key2', 1);  // creates a 2nd level Map indexed by 'key1' with value '1' indexed by 'key2'.
 * map.get('key1'); // returns the 2nd level Map.
 * map.get('key1', 'key2'); // returns '1'; 'key1' indexes into the 2nd level map with 'key2'.
 * map.has('key1', 'key2'); // is true.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export default class MultiLevelMap
{
   /**
    * Initializes the MultiLevelMap
    */
   constructor()
   {
      this._internalMap = new Map();
      Object.freeze(this);
   }

   /**
    * The `clear()` method removes all elements from a Map object. If no keys are provided then the base map is cleared.
    * Subsequent keys will attempt to index into additional levels of the MultiLevelMap.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
    */
   clear(...keys)
   {
      // Clear the entire internal map if no keys are provided.
      if (keys.length === 0)
      {
         this._internalMap.clear();
      }
      else
      {
         const map = s_FIND_CHILD_MAP(keys, this._internalMap);

         if (map !== null)
         {
            map.clear();
         }
      }
   }

   /**
    * The `delete()` method removes the specified element from a Map object. If one key is provided then the base map
    * is the target. Subsequent keys will attempt to index into additional levels of the MultiLevelMap.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {boolean}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
    */
   delete(...keys)
   {
      let returnValue = false;
      const keysLength = keys.length;

      if (keysLength === 0)
      {
         throw new Error('delete - no keys specified.');
      }
      else if (keysLength === 1)
      {
         returnValue = this._internalMap.delete(keys[0]);
      }
      else if (keysLength > 1)
      {
         const mapKeys = keys.slice(0, keysLength - 1);
         const map = s_FIND_CHILD_MAP(mapKeys, this._internalMap);

         if (map !== null)
         {
            const indexKey = keys[keysLength - 1];
            returnValue = map.delete(indexKey);
         }
      }

      return returnValue;
   }

   /**
    * The `entries()` method returns a new Iterator object that contains the [key, value] pairs for each element in the
    * Map object in insertion order. If one key is provided then the base map is the target. Subsequent keys will
    * attempt to index into additional levels of the MultiLevelMap. If no Map is found then an empty iterator is
    * returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {Iterator}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
    */
   entries(...keys)
   {
      let returnValue = s_EMPTY_ITERATOR;

      if (keys.length === 0)
      {
         returnValue = this._internalMap.entries();
      }
      else
      {
         const map = s_FIND_CHILD_MAP(keys, this._internalMap);

         if (map !== null)
         {
            returnValue = map.entries();
         }
      }

      return returnValue;
   }

   /**
    * The `get()` method returns a specified element from a Map object. If one key is provided then the base map is the
    * target. Subsequent keys will attempt to index into additional levels of the MultiLevelMap. If no indexed Map is
    * found then `undefined` is returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {*}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
    */
   get(...keys)
   {
      let returnValue = undefined;

      const keysLength = keys.length;

      if (keysLength === 0)
      {
         throw new Error('get - no keys specified.');
      }
      else if (keysLength === 1)
      {
         returnValue = this._internalMap.get(keys[0]);
      }
      else if (keysLength > 1)
      {
         const mapKeys = keys.slice(0, keysLength - 1);
         const map = s_FIND_CHILD_MAP(mapKeys, this._internalMap);

         if (map !== null)
         {
            const indexKey = keys[keysLength - 1];
            returnValue = map.get(indexKey);
         }
      }

      return returnValue;
   }

   /**
    * The `has()` method returns a boolean indicating whether an element with the specified key exists or not. If one
    * key is provided then the base map is the target. Subsequent keys will attempt to index into additional levels of
    * the MultiLevelMap. If no indexed Map is found then `false` is returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {boolean}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
    */
   has(...keys)
   {
      let returnValue = false;
      const keysLength = keys.length;

      if (keysLength === 0)
      {
         throw new Error('has - no keys specified.');
      }
      else if (keysLength === 1)
      {
         returnValue = this._internalMap.has(keys[0]);
      }
      else if (keysLength > 1)
      {
         const mapKeys = keys.slice(0, keysLength - 1);
         const map = s_FIND_CHILD_MAP(mapKeys, this._internalMap);

         if (map !== null)
         {
            const indexKey = keys[keysLength - 1];

            returnValue = map.has(indexKey);
         }
      }

      return returnValue;
   }

   /**
    * The `isMap()` method returns a boolean indicating whether specified sequence of keys resolves to an existing Map.
    * If one key is provided then the base map is the target. Subsequent keys will attempt to index into additional
    * levels of the MultiLevelMap. If no indexed Map is found then `false` is returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {boolean}
    */
   isMap(...keys)
   {
      let returnValue = false;
      const keysLength = keys.length;

      if (keysLength === 0)
      {
         returnValue = true;
      }
      else if (keysLength > 0)
      {
         const map = s_FIND_CHILD_MAP(keys, this._internalMap);
         returnValue = map !== null && map instanceof Map;
      }

      return returnValue;
   }

   /**
    * The `keys()` method returns a new Iterator object that contains the keys for each element in the Map object in
    * insertion order. If one key is provided then the base map is the target. Subsequent keys will attempt to index
    * into additional levels of the MultiLevelMap. If no Map is found then an empty iterator is returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {Iterator}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
    */
   keys(...keys)
   {
      let returnValue = s_EMPTY_ITERATOR;

      if (keys.length === 0)
      {
         returnValue = this._internalMap.keys();
      }
      else
      {
         const map = s_FIND_CHILD_MAP(keys, this._internalMap);

         if (map !== null)
         {
            returnValue = map.keys();
         }
      }

      return returnValue;
   }

   /**
    * The `set()` method adds a new element with a specified key and value to a Map object. If one key is provided then
    * the base map is the target. Subsequent keys will attempt to index into additional levels of the MultiLevelMap.
    * New Maps are automatically created at each level for the given key parameters. The target Map that the value
    * is added to is returned.
    *
    * @param {*}  params - A variable list of keys to index subsequent levels of the MultiLevelMap with the last entry
    *                      being the value to be set / added.
    *
    * @returns {Map|undefined}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
    */
   set(...params)
   {
      let returnValue = undefined;
      const keysLength = params.length;

      if (keysLength === 0)
      {
         throw new Error('set - no params specified; needs 2 minimum.');
      }
      else if (keysLength === 1)
      {
         throw new Error('set - only 1 param specified; needs 2 minimum.');
      }
      else if (keysLength === 2)
      {
         returnValue = this._internalMap.set(params[0], params[1]);
      }
      else if (keysLength > 2)
      {
         const mapKeys = params.slice(0, keysLength - 2);
         const map = s_FIND_CHILD_MAP(mapKeys, this._internalMap, true);

         if (map !== null)
         {
            const indexKey = params[keysLength - 2];
            const value = params[keysLength - 1];

            returnValue = map.set(indexKey, value);
         }
      }

      return returnValue;
   }

   /**
    * The `size()` method returns an integer representing how many entries the Map object has. If no key is provided
    * then the base map is the target. Subsequent keys will attempt to index into additional levels of the
    * MultiLevelMap. If no indexed Map is found then `0` is returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {number}
    */
   size(...keys)
   {
      let returnValue = 0;
      const keysLength = keys.length;

      if (keysLength === 0)
      {
         returnValue = this._internalMap.size;
      }
      else if (keysLength > 0)
      {
         const map = s_FIND_CHILD_MAP(keys, this._internalMap);

         if (map !== null)
         {
            returnValue = map.size;
         }
      }

      return returnValue;
   }

   /**
    * The `values()` method returns a new Iterator object that contains the values for each element in the Map object in
    * insertion order. If one key is provided then the base map is the target. Subsequent keys will attempt to index
    * into additional levels of the MultiLevelMap. If no Map is found then an empty iterator is returned.
    *
    * @param {*}  keys - A variable list of keys to index subsequent levels of the MultiLevelMap.
    * @returns {Iterator}
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
    */
   values(...keys)
   {
      let returnValue = s_EMPTY_ITERATOR;

      if (keys.length === 0)
      {
         returnValue = this._internalMap.values();
      }
      else
      {
         const map = s_FIND_CHILD_MAP(keys, this._internalMap);

         if (map !== null)
         {
            returnValue = map.values();
         }
      }

      return returnValue;
   }
}

// Private utility methods ------------------------------------------------------------------------------------------

const s_EMPTY_ITERATOR = { next: () => { return { done: true }; } };
Object.freeze(s_EMPTY_ITERATOR);

/**
 * Walks the given map to find the nested child map given the keys array.
 *
 * @param {Array}    keys - The keys to resolve in the given map.
 * @param {Map}      map - The map to search.
 * @param {boolean}  create - Create intermediate maps
 * @returns {Map|null}
 */
const s_FIND_CHILD_MAP = (keys, map, create = false) =>
{
   let childMap = map;

   for (let cntr = 0, length = keys.length; cntr < length; cntr++)
   {
      const key = keys[cntr];
      const nextMap = childMap.get(key);

      if (nextMap instanceof Map)
      {
         childMap = nextMap;
      }
      else if (create)
      {
         // Child map already has a value for this key.
         if (childMap.has(key))
         {
            throw new Error(
             `Could not create child Map as a value already exists for '${key}' in keys: ${JSON.stringify(keys)}.`);
         }

         const newMap = new Map();
         childMap.set(key, newMap);
         childMap = newMap;
      }
      else
      {
         return null;
      }
   }

   return childMap;
};