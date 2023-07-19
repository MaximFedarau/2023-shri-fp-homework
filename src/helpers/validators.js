import { prop, equals, compose, allPass, values, props, gte, flip, curry, countBy, identity, length, keys, map, dissoc, complement, apply } from "ramda"
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// figures
const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');
const getSquareAndTriangle = props(['square', 'triangle']);

// colors
const isWhite = equals("white");
const isRed = equals("red");
const getRed = prop("red");
const isBlue = equals("blue");
const getRedAndBlue = props(["red", "blue"]);
const isGreen = equals("green");
const getGreen = prop("green");
const isOrange = equals("orange");

// colors + figures
const isWhiteStar = compose(isWhite, getStar);
const isNotWhiteStar = complement(isWhiteStar);
const isRedStar = compose(isRed, getStar);
const isNotRedStar = complement(isRedStar);
const isGreenStar = compose(isGreen, getStar);
const isOrangeStar = compose(isOrange, getStar);

const isWhiteSquare = compose(isWhite, getSquare);
const isNotWhiteSquare = complement(isWhiteSquare);
const isGreenSquare = compose(isGreen, getSquare);
const isOrangeSquare = compose(isOrange, getSquare);

const isWhiteTriangle = compose(isWhite, getTriangle);
const isNotWhiteTriangle = complement(isWhiteTriangle);
const isGreenTriangle = compose(isGreen, getTriangle);
const isOrangeTriangle = compose(isOrange, getTriangle);

const isWhiteCircle = compose(isWhite, getCircle);
const isGreenCircle = compose(isGreen, getCircle);
const isBlueCircle = compose(isBlue, getCircle);
const isOrangeCircle = compose(isOrange, getCircle);

// comparison methods
const flippedGte = flip(gte);
const greaterOrEqualsTwo = curry(flippedGte)(2);
const greaterOrEqualsThree = curry(flippedGte)(3);

// array methods
const convertUndefinedToZero = (el) => el ?? 0;
const convertArrayUndefinedElementsToZero = map(convertUndefinedToZero);
const areAllArrayItemsIdentical = compose(equals(1), length, keys, countBy(identity));
const areSquareAndTriangleColorsIdentical = compose(areAllArrayItemsIdentical, getSquareAndTriangle);
const getArrayMaxElement = apply(Math.max);

// complex color methods
const getColorsQuantities = compose(countBy(identity), values);
const getGreenColorQuantity = compose(getGreen, getColorsQuantities);
const getNonWhiteColorsQuantities = compose(convertArrayUndefinedElementsToZero, values, dissoc('white'), getColorsQuantities);

// complex figure methods
const areTwoGreenFigures = compose(equals(2), getGreenColorQuantity);
const isOneRedFigure = compose(equals(1), getRed, getColorsQuantities);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteCircle, isWhiteTriangle]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(greaterOrEqualsTwo, getGreenColorQuantity);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(areAllArrayItemsIdentical, getRedAndBlue, getColorsQuantities);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(greaterOrEqualsThree, getArrayMaxElement, getNonWhiteColorsQuantities);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([isOneRedFigure, areTwoGreenFigures, isGreenTriangle])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([isOrangeCircle, isOrangeSquare, isOrangeStar, isOrangeTriangle]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([isGreenCircle, isGreenSquare, isGreenStar, isGreenTriangle])

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isNotWhiteSquare, isNotWhiteTriangle, areSquareAndTriangleColorsIdentical])