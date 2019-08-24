/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import db from "../support/database";

/**
 * @interface {Object} Tie
 * @property {string} guid
 * @property {string} source_guid
 * @property {string} switch_guid
 * @property {number} input_channel
 * @property {number} video_output_channel
 * @property {number} audio_output_channel
 *
 * @returns {Knex.QueryBuilder<Tie, {}>}
 */
const Tie = () => db("ties");

export default Tie;
