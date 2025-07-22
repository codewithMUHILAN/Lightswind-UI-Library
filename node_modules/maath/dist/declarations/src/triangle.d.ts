import { Vector2 } from "three";
import type { Triangle } from "./ctypes";
/**
 *
 * @param point
 *
 * @param triangle
 *
 * @returns {boolean} true if the point is in the triangle
 *
 * TODO: Find explainer
 */
export declare function isPointInTriangle(point: number[], triangle: Triangle): boolean;
export declare function triangleDeterminant(triangle: Triangle): number;
/**
 * Uses triangle area determinant to check if 3 points are collinear.
 * If they are, they can't make a triangle, so the determinant will be 0!
 *
 *      0     1     2
 * ─────■─────■─────■
 *
 *
 * Fun fact, you can use this same determinant to check the order of the points in the triangle
 *
 * NOTE: Should this use a buffer instead? NOTE: Should this use a buffer instead? [x0, y0, x1, y1, x2, y2]?
 *
 */
export declare function arePointsCollinear(points: Triangle): boolean;
export declare function isTriangleClockwise(triangle: Triangle): boolean;
/**
 
The circumcircle is a circle touching all the vertices of a triangle or polygon.

             ┌───┐
             │ B │
             └───┘
           .───●───.
        ,─'   ╱ ╲   '─.
      ,'     ╱   ╲     `.
     ╱      ╱     ╲      ╲
    ;      ╱       ╲      :
    │     ╱         ╲     │
    │    ╱           ╲    │
    :   ╱             ╲   ;
     ╲ ╱               ╲ ╱
┌───┐ ●─────────────────● ┌───┐
│ A │  `.             ,'  │ C │
└───┘    '─.       ,─'    └───┘
            `─────'
 */
/**
 *
 * @param triangle
 *
 * @returns {number} circumcircle
 */
export declare function getCircumcircle(triangle: Triangle): {
    x: number;
    y: number;
    r: number;
} | null;
export declare function isPointInCircumcircle(point: number[], triangle: Triangle): boolean;
/**
 
     ╱      ╲
    ╱        ╲
   ▕          ▏
                  
 right      left

 * NOTE: Should this use a buffer instead? [x0, y0, x1, y1]?
 */
export declare function doThreePointsMakeARight(points: Triangle | Vector2[]): boolean;
