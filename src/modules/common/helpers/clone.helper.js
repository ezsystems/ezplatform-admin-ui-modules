/**
 * Performes deep clone of an object
 *
 * @function deepClone
 * @param {Object} object
 * @returns {Object}
 */
export const deepClone = (object) => JSON.parse(JSON.stringify(object));
