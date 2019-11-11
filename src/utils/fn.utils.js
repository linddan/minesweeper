export const compose = (...fnArray) => initialVal =>
    fnArray.reduceRight((retVal, fn) => fn(retVal), initialVal);

export const pipe = (...fnArray) => initialVal =>
    fnArray.reduce((retVal, fn) => fn(retVal), initialVal);