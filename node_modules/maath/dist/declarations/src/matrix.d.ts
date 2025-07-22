import { Matrix3, Matrix4 } from "three";
/**
 *
 * @param terms
 *
 * | a b |
 * | c d |
 *
 * @returns {number} determinant
 */
export declare function determinant2(...terms: number[]): number;
/**
 *
 * @param terms
 *
 * | a b c |
 * | d e f |
 * | g h i |
 *
 * @returns {number} determinant
 */
export declare function determinant3(...terms: number[]): number;
/**
 *
 * @param terms
 *
 * | a b c g |
 * | h i j k |
 * | l m n o |
 *
 * @returns {number} determinant
 */
export declare function determinant4(...terms: number[]): void;
/**
 *
 * Get the determinant of matrix m without row r and col c
 *
 * @param {matrix} m Starter matrix
 * @param r row to remove
 * @param c col to remove
 *
 *     | a b c |
 * m = | d e f |
 *     | g h i |
 *
 * getMinor(m, 1, 1) would result in this determinant
 *
 * | a c |
 * | g i |
 *
 * @returns {number} determinant
 */
export declare function getMinor(matrix: Matrix4, r: number, c: number): number;
/**
 *
 */
export declare function matrixSum3(m1: Matrix3, m2: Matrix3): Matrix3;
