/**
 * Clones any object. Faster alternative to `JSON.parse(JSON.stringify)`
 *
 * @function deepClone
 * @param {*} data
 * @returns {*} cloned data
 */
const deepClone = <T>(data: T): T => {
    let clonedData;

    if (typeof data !== 'object') {
        return data;
    }

    if (!data) {
        return data;
    }

    if (isArray(data)) {
        clonedData = [];

        for (let i = 0; i < data.length; i++) {
            clonedData[i] = deepClone(data[i]);
        }

        return clonedData;
    }

    clonedData = {};

    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            clonedData[i] = deepClone(data[i]);
        }
    }

    return clonedData;
};

function isArray(data): data is Array<any> {
    return Object.prototype.toString.apply(data) === '[object Array]'
}

export default deepClone;
