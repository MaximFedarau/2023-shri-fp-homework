/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { tap, compose, gt, lt, flip, curry, length, allPass, ifElse, partial, andThen, prop, otherwise, modulo, concat } from "ramda";
import { toNumber, toString } from "lodash";

import Api from '../tools/api';

const api = new Api();

// comparison methods
const flippedGt = flip(gt);
const flippedLt = flip(lt);
const greaterThanTwo = curry(flippedGt)(2);
const isPositive = curry(flippedGt)(0);
const lessThanTen = curry(flippedLt)(10); 

// validation
const isLengthGreaterThanTwo = compose(greaterThanTwo, length);
const isLengthLessThanTen = compose(lessThanTen, length);
const isRequiredNumber = compose(isPositive, toNumber);
const validate = allPass([isLengthLessThanTen, isLengthGreaterThanTwo, isRequiredNumber]);

// process
// api methods
const flippedAPI = flip(api.get);
const emptyParamsAPI = flippedAPI({});
const numberAPI = api.get("https://api.tech/numbers/base");
const getResult = prop("result");
const thenableGetResult = andThen(getResult);

// convert decimal to binary
const createDecimalToBinaryAPIParams = (number) => ({from: 10, to: 2, number});
const convertDecimalToBinary = compose(numberAPI, createDecimalToBinaryAPIParams);
const convertDecimalToBinaryResult = compose(thenableGetResult, convertDecimalToBinary)

// math operations
const convertToNumberAndRound = compose(Math.round, toNumber);

const getLength = compose(length, toString);
const thenableGetLength = andThen(getLength);

const exponentiate = (exponent, base) => Math.pow(base, exponent);
const square = curry(exponentiate)(2);
const thenableSquare = andThen(square);

const flippedModulo = flip(modulo);
const getRemainder = curry(flippedModulo);
const getRemainderOfDivisionByThree = getRemainder(3);
const getStringRemainderOfDivisionByThree = compose(toString, getRemainderOfDivisionByThree)
const thenableGetStringRemainderOfDivisionByThree = andThen(getStringRemainderOfDivisionByThree);

// get animal
const getAnimal = compose(emptyParamsAPI, concat("https://animals.tech/"));
const getAnimalResult = compose(thenableGetResult, getAnimal);
const thenableGetAnimalResult = andThen(getAnimalResult)

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog);
    const logAPI = andThen(log);

    const throwValidationError = partial(handleError, ['ValidationError']);
    const onAPIError = otherwise(handleError);
    
    const onAPISuccess = andThen(handleSuccess);

    const logMethod = (method, thenable = false) => compose(thenable ? logAPI : log, method);

    const logConvertToNumberAndRound = logMethod(convertToNumberAndRound);
    const logConvertDecimalToBinaryResult = logMethod(convertDecimalToBinaryResult, true);
    const logGetLength = logMethod(thenableGetLength, true);
    const logSquare = logMethod(thenableSquare, true);
    const logGetStringRemainderOfDivisionByThree = logMethod(thenableGetStringRemainderOfDivisionByThree, true);

    const process = compose(onAPIError, onAPISuccess, thenableGetAnimalResult, logGetStringRemainderOfDivisionByThree, logSquare, logGetLength, logConvertDecimalToBinaryResult, logConvertToNumberAndRound);
    const condition = ifElse(validate, process, throwValidationError);
    const main = compose(condition, log);

    main(value);
}

export default processSequence;
