/**
 * Aftermarket implementation of the btoa function, since IE9 does not support it.
 *
 * Code partly taken from:
 * https://github.com/meteor/meteor/blob/devel/packages/base64/base64.js
 * Copyright (C) 2011--2014 Meteor Development Group
 *
 * @param {Array|string}   array -
 * @returns {string}
 */
const polyBtoa = (array) =>
{
   if (typeof array === 'string')
   {
      const str = array;
      array = s_BTOA_NEW_BINARY(str.length);
      for (let j = 0; j < str.length; j++)
      {
         const ch = str.charCodeAt(j);
         if (ch > 0xFF)
         {
            throw new Error('Not ascii. Base64.encode can only take ascii strings');
         }
         array[j] = ch;
      }
   }

   const answer = [];
   let a = null;
   let b = null;
   let c = null;
   let d = null;

   for (let i = 0; i < array.length; i++)
   {
      switch (i % 3)
      {
         case 0:
            a = (array[i] >> 2) & 0x3F;
            b = (array[i] & 0x03) << 4;
            break;

         case 1:
            b |= (array[i] >> 4) & 0xF;
            c = (array[i] & 0xF) << 2;
            break;

         case 2:
            c |= (array[i] >> 6) & 0x03;
            d = array[i] & 0x3F;
            answer.push(s_BTOA_GET_CHAR(a));
            answer.push(s_BTOA_GET_CHAR(b));
            answer.push(s_BTOA_GET_CHAR(c));
            answer.push(s_BTOA_GET_CHAR(d));
            a = null;
            b = null;
            c = null;
            d = null;
            break;
      }
   }

   if (a !== null)
   {
      answer.push(s_BTOA_GET_CHAR(a));
      answer.push(s_BTOA_GET_CHAR(b));

      if (c === null)
      {
         answer.push('=');
      }
      else
      {
         answer.push(s_BTOA_GET_CHAR(c));
      }

      if (d === null)
      {
         answer.push('=');
      }
   }

   return answer.join('');
};

/**
 * Either loads the Window.btoa function or defaults to the polyfill.
 *
 * @type {function}
 */
const btoa = (typeof self === 'object' && self.self === self && self.btoa) ? self.btoa : polyBtoa;

export default btoa;

// Private internal methods -----------------------------------------------------------------------------------------

const s_BTOA_BASE_64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const s_BTOA_GET_CHAR = (val) =>
{
   return s_BTOA_BASE_64_CHARS.charAt(val);
};

const s_BTOA_NEW_BINARY = (len) =>
{
   const ret = [];
   for (let i = 0; i < len; i++)
   {
      ret.push(0);
   }
   return ret;
};