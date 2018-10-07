module.exports = (...str) => Promise.reject(new Error(str.join(' ')))
