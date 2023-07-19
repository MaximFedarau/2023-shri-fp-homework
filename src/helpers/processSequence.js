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
import { tap, compose, gt, lt, flip, curry, length, allPass, ifElse, partial, andThen, prop, otherwise, modulo, concat, test } from "ramda";
import { toNumber, toString, round } from "lodash";

import Api from "../tools/api";

const api = new Api();

const ANIMAL_API_URL = "https://animals.tech/";
const NUMBER_API_URL = "https://api.tech/numbers/base";

// comparison methods
const flippedGt = flip(gt);
const flippedLt = flip(lt);

const greaterThan = curry(flippedGt);
const greaterThanTwo = greaterThan(2);
const isPositive = greaterThan(0);

const lessThan = curry(flippedLt);
const lessThanTen = lessThan(10); 

// validation
const isLengthGreaterThanTwo = compose(greaterThanTwo, length);
const isLengthLessThanTen = compose(lessThanTen, length);

const isNumber = test(/^\d+\.?\d+$/);
const isPositiveNumber = compose(isPositive, toNumber);
const isRequiredNumber = allPass([isPositiveNumber, isNumber]);

const validate = allPass([isLengthLessThanTen, isLengthGreaterThanTwo, isRequiredNumber]);

// api methods
const flippedAPI = flip(api.get);

const callEmptyParamsAPI = flippedAPI({});
const callNumberAPI = api.get(NUMBER_API_URL);

const getResult = prop("result");
const thenableGetResult = andThen(getResult);

// convert decimal to binary
const createDecimalToBinaryAPIParams = (number) => ({ from: 10, to: 2, number });
const convertDecimalToBinary = compose(callNumberAPI, createDecimalToBinaryAPIParams);
const convertDecimalToBinaryResult = compose(thenableGetResult, convertDecimalToBinary);

// math operations
const convertToRoundedNumber = compose(round, toNumber);

const getLength = compose(length, toString);
const thenableGetLength = andThen(getLength);

const exponentiate = (exponent, base) => Math.pow(base, exponent);
const square = partial(exponentiate, [2]);
const thenableSquare = andThen(square);

const flippedModulo = flip(modulo);
const getRemainder = curry(flippedModulo);
const getRemainderOfDivisionByThree = getRemainder(3);
const getStringRemainderOfDivisionByThree = compose(toString, getRemainderOfDivisionByThree);
const thenableGetStringRemainderOfDivisionByThree = andThen(getStringRemainderOfDivisionByThree);

// get animal
const getAnimalURL = concat(ANIMAL_API_URL);
const getAnimal = compose(callEmptyParamsAPI, getAnimalURL);
const getAnimalResult = compose(thenableGetResult, getAnimal);
const thenableGetAnimalResult = andThen(getAnimalResult);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const log = tap(writeLog);
    const thenableLog = andThen(log);

    const throwValidationError = partial(handleError, ["ValidationError"]);

    const onAPIError = otherwise(handleError);
    const onAPISuccess = andThen(handleSuccess);

    const logMethod = (method, thenable = false) => compose(thenable ? thenableLog : log, method);

    const logConvertToRoundedNumber = logMethod(convertToRoundedNumber);
    const logConvertDecimalToBinaryResult = logMethod(convertDecimalToBinaryResult, true);
    const logGetLength = logMethod(thenableGetLength, true);
    const logSquare = logMethod(thenableSquare, true);
    const logGetStringRemainderOfDivisionByThree = logMethod(thenableGetStringRemainderOfDivisionByThree, true);

    const runProcess = compose(onAPIError, onAPISuccess, thenableGetAnimalResult, logGetStringRemainderOfDivisionByThree, logSquare, logGetLength, logConvertDecimalToBinaryResult, logConvertToRoundedNumber);
    const condition = ifElse(validate, runProcess, throwValidationError);
    const main = compose(condition, log);

    main(value);
}

export default processSequence;
