import striptags from 'striptags';

/**
 * stripTags from any stirng
 *
 * @param {string} input
 * @parm {string} output
 */
export const stripTags = (input) => {
  return striptags(input);
};
