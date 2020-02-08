/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random integer between the `min` and `max` values, inclusive.
 *
 * @function RandomInt
 *
 * @param {integer} min - The minimum value.
 * @param {integer} max - The maximum value.
 *
 * @return {integer} The random integer.
 */
export default function RandomInt (min: number, max: number): number
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};
