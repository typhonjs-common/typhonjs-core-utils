/**
 * Provides static common utility methods.
 */
export default class Utils
{
   /**
    * Method for checking whether a variable is undefined or null.
    *
    * @param {*}  unknown - Variable to test.
    * @returns {boolean}
    */
   static isNullOrUndef(unknown)
   {
      return unknown === null || typeof unknown === 'undefined';
   }

   /**
    * Method for checking if a given child is a type of the parent.
    *
    * @param {*}  childType - Child type to test.
    * @param {*}  parentType - Parent type to match against child prototype.
    * @returns {boolean}
    */
   static isTypeOf(childType, parentType)
   {
      return childType === parentType ? true : s_WALK_PROTO(childType, parentType);
   }
}

// Private utility methods ------------------------------------------------------------------------------------------

const s_GET_PROTO = Object.getPrototypeOf.bind(Object);

/**
 * Walks to prototype chain of given child and parent types. If the child type eventually matches the parent type
 * the child is a type of the parent.
 *
 * @param {*}  childType - Child type to test.
 * @param {*}  parentType - Parent type to match against child prototype.
 * @returns {boolean}
 */
const s_WALK_PROTO = (childType, parentType) =>
{
   let proto = s_GET_PROTO(childType);

   for (; proto !== null; proto = s_GET_PROTO(proto))
   {
      if (proto === parentType) { return true; }
   }

   return false;
};