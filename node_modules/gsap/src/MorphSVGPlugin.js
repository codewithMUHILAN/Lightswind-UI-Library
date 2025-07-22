/*!
 * MorphSVGPlugin 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

import { getRawPath, reverseSegment, stringToRawPath, rawPathToString, convertToPath } from "./utils/paths.js";

let gsap, _toArray, _lastLinkedAnchor, _doc, _coreInitted, PluginClass,
	_getGSAP = () => gsap || (typeof(window) !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap),
	_isFunction = value => typeof(value) === "function",
	_atan2 = Math.atan2,
	_cos = Math.cos,
	_sin = Math.sin,
	_sqrt = Math.sqrt,
	_PI = Math.PI,
	_2PI = _PI * 2,
	_angleMin = _PI * 0.3,
	_angleMax = _PI * 0.7,
	_bigNum = 1e20,
	_numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi, //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
	_selectorExp = /(^[#\.][a-z]|[a-y][a-z])/i,
	_commands = /[achlmqstvz]/i,
	_log = message => console && console.warn(message),
	_bonusValidated = 1, //<name>MorphSVGPlugin</name>
	_getAverageXY = segment => {
		let l = segment.length,
			x = 0,
			y = 0,
			i;
		for (i = 0; i < l; i++) {
			x += segment[i++];
			y += segment[i];
		}
		return [x / (l / 2), y / (l / 2)];
	},
	_getSize = segment => { //rough estimate of the bounding box (based solely on the anchors) of a single segment. sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
		let l = segment.length,
			xMax = segment[0],
			xMin = xMax,
			yMax = segment[1],
			yMin = yMax,
			x, y, i;
		for (i = 6; i < l; i+=6) {
			x = segment[i];
			y = segment[i+1];
			if (x > xMax) {
				xMax = x;
			} else if (x < xMin) {
				xMin = x;
			}
			if (y > yMax) {
				yMax = y;
			} else if (y < yMin) {
				yMin = y;
			}
		}
		segment.centerX = (xMax + xMin) / 2;
		segment.centerY = (yMax + yMin) / 2;
		return (segment.size = (xMax - xMin) * (yMax - yMin));
	},
	_getTotalSize = (rawPath, samplesPerBezier = 3) => { //rough estimate of the bounding box of the entire list of Bezier segments (based solely on the anchors). sets "size", "centerX", and "centerY" properties on the bezier array itself, and returns the size (width * height)
		let j = rawPath.length,
			xMax = rawPath[0][0],
			xMin = xMax,
			yMax = rawPath[0][1],
			yMin = yMax,
			inc = 1 / samplesPerBezier,
			l, x, y, i, segment, k, t, inv, x1, y1, x2, x3, x4, y2, y3, y4;
		while (--j > -1) {
			segment = rawPath[j];
			l = segment.length;
			for (i = 6; i < l; i+=6) {
				x1 = segment[i];
				y1 = segment[i+1];
				x2 = segment[i+2] - x1;
				y2 = segment[i+3] - y1;
				x3 = segment[i+4] - x1;
				y3 = segment[i+5] - y1;
				x4 = segment[i+6] - x1;
				y4 = segment[i+7] - y1;
				k = samplesPerBezier;
				while (--k > -1) {
					t = inc * k;
					inv = 1 - t;
					x = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t + x1;
					y = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t + y1;
					if (x > xMax) {
						xMax = x;
					} else if (x < xMin) {
						xMin = x;
					}
					if (y > yMax) {
						yMax = y;
					} else if (y < yMin) {
						yMin = y;
					}
				}
			}
		}
		rawPath.centerX = (xMax + xMin) / 2;
		rawPath.centerY = (yMax + yMin) / 2;
		rawPath.left = xMin;
		rawPath.width = (xMax - xMin);
		rawPath.top = yMin;
		rawPath.height = (yMax - yMin);
		return (rawPath.size = (xMax - xMin) * (yMax - yMin));
	},
	_sortByComplexity = (a, b) => b.length - a.length,
	_sortBySize = (a, b) => {
		let sizeA = a.size || _getSize(a),
			sizeB = b.size || _getSize(b);
		return (Math.abs(sizeB - sizeA) < (sizeA + sizeB) / 20) ? (b.centerX - a.centerX) || (b.centerY - a.centerY) : sizeB - sizeA; //if the size is within 10% of each other, prioritize position from left to right, then top to bottom.
	},
	_offsetSegment = (segment, shapeIndex) => {
		let a = segment.slice(0),
			l = segment.length,
			wrap = l - 2,
			i, index;
		shapeIndex = shapeIndex | 0;
		for (i = 0; i < l; i++) {
			index = (i + shapeIndex) % wrap;
			segment[i++] = a[index];
			segment[i] = a[index+1];
		}
	},
	_getTotalMovement = (sb, eb, shapeIndex, offsetX, offsetY) => {
		let l = sb.length,
			d = 0,
			wrap = l - 2,
			index, i, x, y;
		shapeIndex *= 6;
		for (i = 0; i < l; i += 6) {
			index = (i + shapeIndex) % wrap;
			y = sb[index] - (eb[i] - offsetX);
			x = sb[index+1] - (eb[i+1] - offsetY);
			d += _sqrt(x * x + y * y);
		}
		return d;
	},
	_getClosestShapeIndex = (sb, eb, checkReverse) => { //finds the index in a closed cubic bezier array that's closest to the angle provided (angle measured from the center or average x/y).
		let l = sb.length,
			sCenter = _getAverageXY(sb), //when comparing distances, adjust the coordinates as if the shapes are centered with each other.
			eCenter = _getAverageXY(eb),
			offsetX = eCenter[0] - sCenter[0],
			offsetY = eCenter[1] - sCenter[1],
			min = _getTotalMovement(sb, eb, 0, offsetX, offsetY),
			minIndex = 0,
			copy, d, i;
		for (i = 6; i < l; i += 6) {
			d = _getTotalMovement(sb, eb, i / 6, offsetX, offsetY);
			if (d < min) {
				min = d;
				minIndex = i;
			}
		}
		if (checkReverse) {
			copy = sb.slice(0);
			reverseSegment(copy);
			for (i = 6; i < l; i += 6) {
				d = _getTotalMovement(copy, eb, i / 6, offsetX, offsetY);
				if (d < min) {
					min = d;
					minIndex = -i;
				}
			}
		}
		return minIndex / 6;
	},
	_getClosestAnchor = (rawPath, x, y) => { //finds the x/y of the anchor that's closest to the provided x/y coordinate (returns an array, like [x, y]). The bezier should be the top-level type that contains an array for each segment.
		let j = rawPath.length,
			closestDistance = _bigNum,
			closestX = 0,
			closestY = 0,
			segment, dx, dy, d, i, l;
		while (--j > -1) {
			segment = rawPath[j];
			l = segment.length;
			for (i = 0; i < l; i += 6) {
				dx = segment[i] - x;
				dy = segment[i+1] - y;
				d = _sqrt(dx * dx + dy * dy);
				if (d < closestDistance) {
					closestDistance = d;
					closestX = segment[i];
					closestY = segment[i+1];
				}
			}
		}
		return [closestX, closestY];
	},
	_getClosestSegment = (bezier, pool, startIndex, sortRatio, offsetX, offsetY) => { //matches the bezier to the closest one in a pool (array) of beziers, assuming they are in order of size and we shouldn't drop more than 20% of the size, otherwise prioritizing location (total distance to the center). Extracts the segment out of the pool array and returns it.
		let l = pool.length,
			index = 0,
			minSize = Math.min(bezier.size || _getSize(bezier), pool[startIndex].size || _getSize(pool[startIndex])) * sortRatio, //limit things based on a percentage of the size of either the bezier or the next element in the array, whichever is smaller.
			min = _bigNum,
			cx = bezier.centerX + offsetX,
			cy = bezier.centerY + offsetY,
			size, i, dx, dy, d;
		for (i = startIndex; i < l; i++) {
			size = pool[i].size || _getSize(pool[i]);
			if (size < minSize) {
				break;
			}
			dx = pool[i].centerX - cx;
			dy = pool[i].centerY - cy;
			d = _sqrt(dx * dx + dy * dy);
			if (d < min) {
				index = i;
				min = d;
			}
		}
		d = pool[index];
		pool.splice(index, 1);
		return d;
	},
	_subdivideSegmentQty = (segment, quantity) => {
		let tally = 0,
			max = 0.999999,
			l = segment.length,
			newPointsPerSegment = quantity / ((l - 2) / 6),
			ax, ay, cp1x, cp1y, cp2x, cp2y, bx, by,
			x1, y1, x2, y2, i, t;
		for (i = 2; i < l; i += 6) {
			tally += newPointsPerSegment;
			while (tally > max) { //compare with 0.99999 instead of 1 in order to prevent rounding errors
				ax = segment[i-2];
				ay = segment[i-1];
				cp1x = segment[i];
				cp1y = segment[i+1];
				cp2x = segment[i+2];
				cp2y = segment[i+3];
				bx = segment[i+4];
				by = segment[i+5];
				t = 1 / ((Math.floor(tally) || 1) + 1); //progress along the bezier (value between 0 and 1)
				x1 = ax + (cp1x - ax) * t;
				x2 = cp1x + (cp2x - cp1x) * t;
				x1 += (x2 - x1) * t;
				x2 += ((cp2x + (bx - cp2x) * t) - x2) * t;
				y1 = ay + (cp1y - ay) * t;
				y2 = cp1y + (cp2y - cp1y) * t;
				y1 += (y2 - y1) * t;
				y2 += ((cp2y + (by - cp2y) * t) - y2) * t;
				segment.splice(i, 4,
					ax + (cp1x - ax) * t,   //first control point
					ay + (cp1y - ay) * t,
					x1,                     //second control point
					y1,
					x1 + (x2 - x1) * t,     //new fabricated anchor on line
					y1 + (y2 - y1) * t,
					x2,                     //third control point
					y2,
					cp2x + (bx - cp2x) * t, //fourth control point
					cp2y + (by - cp2y) * t
				);
				i += 6;
				l += 6;
				tally--;
			}
		}
		return segment;
	},
	_equalizeSegmentQuantity = (start, end, shapeIndex, map, fillSafe) => { //returns an array of shape indexes, 1 for each segment.
		let dif = end.length - start.length,
			longer = dif > 0 ? end : start,
			shorter = dif > 0 ? start : end,
			added = 0,
			sortMethod = (map === "complexity") ? _sortByComplexity : _sortBySize,
			sortRatio = (map === "position") ? 0 : (typeof(map) === "number") ? map : 0.8,
			i = shorter.length,
			shapeIndices = (typeof(shapeIndex) === "object" && shapeIndex.push) ? shapeIndex.slice(0) : [shapeIndex],
			reverse = (shapeIndices[0] === "reverse" || shapeIndices[0] < 0),
			log = (shapeIndex === "log"),
			eb, sb, b, x, y, offsetX, offsetY;
		if (!shorter[0]) {
			return;
		}
		if (longer.length > 1) {
			start.sort(sortMethod);
			end.sort(sortMethod);
			offsetX = longer.size || _getTotalSize(longer); //ensures centerX and centerY are defined (used below).
			offsetX = shorter.size || _getTotalSize(shorter);
			offsetX = longer.centerX - shorter.centerX;
			offsetY = longer.centerY - shorter.centerY;
			if (sortMethod === _sortBySize) {
				for (i = 0; i < shorter.length; i++) {
					longer.splice(i, 0, _getClosestSegment(shorter[i], longer, i, sortRatio, offsetX, offsetY));
				}
			}
		}
		if (dif) {
			if (dif < 0) {
				dif = -dif;
			}
			if (longer[0].length > shorter[0].length) { //since we use shorter[0] as the one to map the origination point of any brand new fabricated segments, do any subdividing first so that there are more points to choose from (if necessary)
				_subdivideSegmentQty(shorter[0], ((longer[0].length - shorter[0].length)/6) | 0);
			}
			i = shorter.length;
			while (added < dif) {
				x = longer[i].size || _getSize(longer[i]); //just to ensure centerX and centerY are calculated which we use on the next line.
				b = _getClosestAnchor(shorter, longer[i].centerX, longer[i].centerY);
				x = b[0];
				y = b[1];
				shorter[i++] = [x, y, x, y, x, y, x, y];
				shorter.totalPoints += 8;
				added++;
			}
		}
		for (i = 0; i < start.length; i++) {
			eb = end[i];
			sb = start[i];
			dif = eb.length - sb.length;
			if (dif < 0) {
				_subdivideSegmentQty(eb, (-dif/6) | 0);
			} else if (dif > 0) {
				_subdivideSegmentQty(sb, (dif/6) | 0);
			}
			if (reverse && fillSafe !== false && !sb.reversed) {
				reverseSegment(sb);
			}
			shapeIndex = (shapeIndices[i] || shapeIndices[i] === 0) ? shapeIndices[i] : "auto";
			if (shapeIndex) {
				//if start shape is closed, find the closest point to the start/end, and re-organize the bezier points accordingly so that the shape morphs in a more intuitive way.
				if (sb.closed || (Math.abs(sb[0] - sb[sb.length - 2]) < 0.5 && Math.abs(sb[1] - sb[sb.length - 1]) < 0.5)) {
					if (shapeIndex === "auto" || shapeIndex === "log") {
						shapeIndices[i] = shapeIndex = _getClosestShapeIndex(sb, eb, (!i || fillSafe === false));
						if (shapeIndex < 0) {
							reverse = true;
							reverseSegment(sb);
							shapeIndex = -shapeIndex;
						}
						_offsetSegment(sb, shapeIndex * 6);

					} else if (shapeIndex !== "reverse") {
						if (i && shapeIndex < 0) { //only happens if an array is passed as shapeIndex and a negative value is defined for an index beyond 0. Very rare, but helpful sometimes.
							reverseSegment(sb);
						}
						_offsetSegment(sb, (shapeIndex < 0 ? -shapeIndex : shapeIndex) * 6);
					}
					//otherwise, if it's not a closed shape, consider reversing it if that would make the overall travel less
				} else if (!reverse && (shapeIndex === "auto" && (Math.abs(eb[0] - sb[0]) + Math.abs(eb[1] - sb[1]) + Math.abs(eb[eb.length - 2] - sb[sb.length - 2]) + Math.abs(eb[eb.length - 1] - sb[sb.length - 1]) > Math.abs(eb[0] - sb[sb.length - 2]) + Math.abs(eb[1] - sb[sb.length - 1]) + Math.abs(eb[eb.length - 2] - sb[0]) + Math.abs(eb[eb.length - 1] - sb[1])) || (shapeIndex % 2))) {
					reverseSegment(sb);
					shapeIndices[i] = -1;
					reverse = true;
				} else if (shapeIndex === "auto") {
					shapeIndices[i] = 0;
				} else if (shapeIndex === "reverse") {
					shapeIndices[i] = -1;
				}
				if (sb.closed !== eb.closed) { //if one is closed and one isn't, don't close either one otherwise the tweening will look weird (but remember, the beginning and final states will honor the actual values, so this only affects the inbetween state)
					sb.closed = eb.closed = false;
				}
			}
		}
		log && _log("shapeIndex:[" + shapeIndices.join(",") + "]");
		start.shapeIndex = shapeIndices;
		return shapeIndices;
	},
	_pathFilter = (a, shapeIndex, map, precompile, fillSafe) => {
		let start = stringToRawPath(a[0]),
			end = stringToRawPath(a[1]);
		if (!_equalizeSegmentQuantity(start, end, (shapeIndex || shapeIndex === 0) ? shapeIndex : "auto", map, fillSafe)) {
			return; //malformed path data or null target
		}
		a[0] = rawPathToString(start);
		a[1] = rawPathToString(end);
		if (precompile === "log" || precompile === true) {
			_log('precompile:["' + a[0] + '","' + a[1] + '"]');
		}
	},
	_offsetPoints = (text, offset) => {
		if (!offset) {
			return text;
		}
		let a = text.match(_numExp) || [],
			l = a.length,
			s = "",
			inc, i, j;
		if (offset === "reverse") {
			i = l-1;
			inc = -2;
		} else {
			i = (((parseInt(offset, 10) || 0) * 2 + 1) + l * 100) % l;
			inc = 2;
		}
		for (j = 0; j < l; j += 2) {
			s += a[i-1] + "," + a[i] + " ";
			i = (i + inc) % l;
		}
		return s;
	},
	//adds a certain number of points while maintaining the polygon/polyline shape (so that the start/end values can have a matching quantity of points to animate). Returns the revised string.
	_equalizePointQuantity = (a, quantity) => {
		let tally = 0,
			x = parseFloat(a[0]),
			y = parseFloat(a[1]),
			s = x + "," + y + " ",
			max = 0.999999,
			newPointsPerSegment, i, l, j, factor, nextX, nextY;
		l = a.length;
		newPointsPerSegment = quantity * 0.5 / (l * 0.5 - 1);
		for (i = 0; i < l-2; i += 2) {
			tally += newPointsPerSegment;
			nextX = parseFloat(a[i+2]);
			nextY = parseFloat(a[i+3]);
			if (tally > max) { //compare with 0.99999 instead of 1 in order to prevent rounding errors
				factor = 1 / (Math.floor(tally) + 1);
				j = 1;
				while (tally > max) {
					s += (x + (nextX - x) * factor * j).toFixed(2) + "," + (y + (nextY - y) * factor * j).toFixed(2) + " ";
					tally--;
					j++;
				}
			}
			s += nextX + "," + nextY + " ";
			x = nextX;
			y = nextY;
		}
		return s;
	},
	_pointsFilter = a => {
		let startNums = a[0].match(_numExp) || [],
			endNums = a[1].match(_numExp) || [],
			dif = endNums.length - startNums.length;
		if (dif > 0) {
			a[0] = _equalizePointQuantity(startNums, dif);
		} else {
			a[1] = _equalizePointQuantity(endNums, -dif);
		}
	},
	_buildPointsFilter = shapeIndex => !isNaN(shapeIndex) ? a => {
			_pointsFilter(a);
			a[1] = _offsetPoints(a[1], parseInt(shapeIndex, 10));
		} : _pointsFilter,
	_parseShape = (shape, forcePath, target) => {
		let isString = typeof(shape) === "string",
			e, type;
		if (!isString || _selectorExp.test(shape) || (shape.match(_numExp) || []).length < 3) {
			e = _toArray(shape)[0];
			if (e) {
				type = (e.nodeName + "").toUpperCase();
				if (forcePath && type !== "PATH") { //if we were passed an element (or selector text for an element) that isn't a path, convert it.
					e = convertToPath(e, false);
					type = "PATH";
				}
				shape = e.getAttribute(type === "PATH" ? "d" : "points") || "";
				if (e === target) { //if the shape matches the target element, the user wants to revert to the original which should have been stored in the data-original attribute
					shape = e.getAttributeNS(null, "data-original") || shape;
				}
			} else {
				_log("WARNING: invalid morph to: " + shape);
				shape = false;
			}
		}
		return shape;
	},
	//adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
	_populateSmoothData = (rawPath, tolerance) => {
		let j = rawPath.length,
			limit = 0.2 * (tolerance || 1),
			smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
		while (--j > -1) {
			segment = rawPath[j];
			isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
			smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
			isSmooth.length = 4;
			l = segment.length - 2;
			for (i = 6; i < l; i += 6) {
				x = segment[i] - segment[i - 2];
				y = segment[i + 1] - segment[i - 1];
				x2 = segment[i + 2] - segment[i];
				y2 = segment[i + 3] - segment[i + 1];
				a = _atan2(y, x);
				a2 = _atan2(y2, x2);
				smooth = (Math.abs(a - a2) < limit);
				if (smooth) {
					smoothData[i - 2] = a;
					smoothData[i + 2] = a2;
					smoothData[i - 1] = _sqrt(x * x + y * y);
					smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
				}
				isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
			}
			//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
			if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
				x = segment[0] - segment[l-2];
				y = segment[1] - segment[l-1];
				x2 = segment[2] - segment[0];
				y2 = segment[3] - segment[1];
				a = _atan2(y, x);
				a2 = _atan2(y2, x2);
				if (Math.abs(a - a2) < limit) {
					smoothData[l-2] = a;
					smoothData[2] = a2;
					smoothData[l-1] = _sqrt(x * x + y * y);
					smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
					isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
				}
			}
		}
		return rawPath;
	},
	_parseOriginFactors = v => {
		let a = v.trim().split(" "),
			x = ~v.indexOf("left") ? 0 : ~v.indexOf("right") ? 100 : isNaN(parseFloat(a[0])) ? 50 : parseFloat(a[0]),
			y = ~v.indexOf("top") ? 0 : ~v.indexOf("bottom") ? 100 : isNaN(parseFloat(a[1])) ? 50 : parseFloat(a[1]);
		return {x:x / 100, y:y / 100};
	},
	_shortAngle = dif => (dif !== dif % _PI) ? dif + ((dif < 0) ? _2PI : -_2PI) : dif,
	_morphMessage = "Use MorphSVGPlugin.convertToPath() to convert to a path before morphing.",
	_tweenRotation = function(start, end, i, linkedPT) {
		let so = this._origin,              //starting origin
			eo = this._eOrigin,             //ending origin
			dx = start[i] - so.x,
			dy = start[i+1] - so.y,
			d = _sqrt(dx * dx + dy * dy),   //length from starting origin to starting point
			sa = _atan2(dy, dx),
			angleDif, short;
		dx = end[i] - eo.x;
		dy = end[i+1] - eo.y;
		angleDif = _atan2(dy, dx) - sa;
		short = _shortAngle(angleDif);
		//in the case of control points, we ALWAYS link them to their anchor so that they don't get torn apart and rotate the opposite direction. If it's not a control point, we look at the most recently linked point as long as they're within a certain rotational range of each other.
		if (!linkedPT && _lastLinkedAnchor && Math.abs(short + _lastLinkedAnchor.ca) < _angleMin) {
			linkedPT = _lastLinkedAnchor;
		}
		return (this._anchorPT = _lastLinkedAnchor = {
			_next:this._anchorPT,
			t:start,
			sa:sa,                              //starting angle
			ca:(linkedPT && short * linkedPT.ca < 0 && Math.abs(short) > _angleMax) ? angleDif : short,  //change in angle
			sl:d,                               //starting length
			cl:_sqrt(dx * dx + dy * dy) - d,    //change in length
			i:i
		});
	},
	_initCore = required => {
		gsap = _getGSAP();
		PluginClass = PluginClass || (gsap && gsap.plugins.morphSVG);
		if (gsap && PluginClass) {
			_toArray = gsap.utils.toArray;
			_doc = document;
			PluginClass.prototype._tweenRotation = _tweenRotation;
			_coreInitted = 1;
		} else if (required) {
			_log("Please gsap.registerPlugin(MorphSVGPlugin)");
		}
	};


export const MorphSVGPlugin = {
	version: "3.13.0",
	name: "morphSVG",
	rawVars: 1, // otherwise "render" would be interpreted as a function-based value.
	register(core, Plugin) {
		gsap = core;
		PluginClass = Plugin;
		_initCore();
	},
	init(target, value, tween, index, targets) {
		_coreInitted || _initCore(1);
		if (!value) {
			_log("invalid shape");
			return false;
		}
		_isFunction(value) && (value = value.call(tween, index, target, targets));
		let type, p, pt, shape, isPoly, shapeIndex, map, startSmooth, endSmooth, start, end, i, j, l, startSeg, endSeg, precompiled, sData, eData, originFactors, useRotation, offset;
		if (typeof(value) === "string" || value.getBBox || value[0]) {
			value = {shape:value};
		} else if (typeof(value) === "object") { // if there are any function-based values, parse them here (and make a copy of the object so we're not modifying the original)
			type = {};
			for (p in value) {
				type[p] = _isFunction(value[p]) && p !== "render" ? value[p].call(tween, index, target, targets) : value[p];
			}
			value = type;
		}
		let cs = target.nodeType ? window.getComputedStyle(target) : {},
			fill = cs.fill + "",
			fillSafe = !(fill === "none" || (fill.match(_numExp) || [])[3] === "0" || cs.fillRule === "evenodd"),
			origins = (value.origin || "50 50").split(",");
		type = (target.nodeName + "").toUpperCase();
		isPoly = (type === "POLYLINE" || type === "POLYGON");
		if (type !== "PATH" && !isPoly && !value.prop) {
			_log("Cannot morph a <" + type + "> element. " + _morphMessage);
			return false;
		}
		p = (type === "PATH") ? "d" : "points";
		if (!value.prop && !_isFunction(target.setAttribute)) {
			return false;
		}
		shape = _parseShape(value.shape || value.d || value.points || "", (p === "d"), target);
		if (isPoly && _commands.test(shape)) {
			_log("A <" + type + "> cannot accept path data. " + _morphMessage);
			return false;
		}
		shapeIndex = (value.shapeIndex || value.shapeIndex === 0) ? value.shapeIndex : "auto";
		map = value.map || MorphSVGPlugin.defaultMap;
		this._prop = value.prop;
		this._render = value.render || MorphSVGPlugin.defaultRender;
		this._apply = ("updateTarget" in value) ? value.updateTarget : MorphSVGPlugin.defaultUpdateTarget;
		this._rnd = Math.pow(10, isNaN(value.precision) ? 2 : +value.precision);
		this._tween = tween;
		if (shape) {
			this._target = target;
			precompiled = (typeof(value.precompile) === "object");
			start = this._prop ? target[this._prop] : target.getAttribute(p);
			if (!this._prop && !target.getAttributeNS(null, "data-original")) {
				target.setAttributeNS(null, "data-original", start); //record the original state in a data-original attribute so that we can revert to it later.
			}
			if (p === "d" || this._prop) {
				start = stringToRawPath(precompiled ? value.precompile[0] : start);
				end = stringToRawPath(precompiled ? value.precompile[1] : shape);
				if (!precompiled && !_equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe)) {
					return false; //malformed path data or null target
				}
				if (value.precompile === "log" || value.precompile === true) {
					_log('precompile:["' + rawPathToString(start) + '","' + rawPathToString(end) + '"]');
				}
				useRotation = (value.type || MorphSVGPlugin.defaultType) !== "linear";
				if (useRotation) {
					start = _populateSmoothData(start, value.smoothTolerance);
					end = _populateSmoothData(end, value.smoothTolerance);
					if (!start.size) {
						_getTotalSize(start); //adds top/left/width/height values
					}
					if (!end.size) {
						_getTotalSize(end);
					}
					originFactors = _parseOriginFactors(origins[0]);
					this._origin = start.origin = {x:start.left + originFactors.x * start.width, y:start.top + originFactors.y * start.height};
					if (origins[1]) {
						originFactors = _parseOriginFactors(origins[1]);
					}
					this._eOrigin = {x:end.left + originFactors.x * end.width, y:end.top + originFactors.y * end.height};
				}

				this._rawPath = target._gsRawPath =  start;

				j = start.length;
				while (--j > -1) {
					startSeg = start[j];
					endSeg = end[j];
					startSmooth = startSeg.isSmooth || [];
					endSmooth = endSeg.isSmooth || [];
					l = startSeg.length;
					_lastLinkedAnchor = 0; //reset; we use _lastLinkedAnchor in the _tweenRotation() method to help make sure that close points don't get ripped apart and rotate opposite directions. Typically we want to go the shortest direction, but if the previous anchor is going a different direction, we override this logic (within certain thresholds)
					for (i = 0; i < l; i+=2) {
						if (endSeg[i] !== startSeg[i] || endSeg[i+1] !== startSeg[i+1]) {
							if (useRotation) {
								if (startSmooth[i] && endSmooth[i]) { //if BOTH starting and ending values are smooth (meaning control points have basically the same slope), interpolate the rotation and length instead of the coordinates (this is what makes things smooth).
									sData = startSeg.smoothData;
									eData = endSeg.smoothData;
									offset = i + ((i === l - 4) ? 7 - l : 5); //helps us accommodate wrapping (like if the end and start anchors are identical and the control points are smooth).
									this._controlPT = {_next:this._controlPT, i:i, j:j, l1s:sData[i+1], l1c:eData[i+1] - sData[i+1], l2s:sData[offset], l2c:eData[offset] - sData[offset]};
									pt = this._tweenRotation(startSeg, endSeg, i+2);
									this._tweenRotation(startSeg, endSeg, i, pt);
									this._tweenRotation(startSeg, endSeg, offset-1, pt);
									i+=4;
								} else {
									this._tweenRotation(startSeg, endSeg, i);
								}
							} else {
								pt = this.add(startSeg, i, startSeg[i], endSeg[i], 0, 0, 0, 0, 0, 1);
								pt = this.add(startSeg, i+1, startSeg[i+1], endSeg[i+1], 0, 0, 0, 0, 0, 1) || pt;
							}
						}
					}
				}
			} else {
				pt = this.add(target, "setAttribute", target.getAttribute(p) + "", shape + "", index, targets, 0, _buildPointsFilter(shapeIndex), p);
			}

			if (useRotation) {
				this.add(this._origin, "x", this._origin.x, this._eOrigin.x, 0, 0, 0, 0, 0, 1);
				pt = this.add(this._origin, "y", this._origin.y, this._eOrigin.y, 0, 0, 0, 0, 0, 1);
			}

			if (pt) {
				this._props.push("morphSVG");
				pt.end = shape;
				pt.endProp = p;
			}
		}
		return _bonusValidated;
	},

	render(ratio, data) {
		let rawPath = data._rawPath,
			controlPT = data._controlPT,
			anchorPT = data._anchorPT,
			rnd = data._rnd,
			target = data._target,
			pt = data._pt,
			s, space, easeInOut, segment, l, angle, i, j, x, y, sin, cos, offset;
		while (pt) {
			pt.r(ratio, pt.d);
			pt = pt._next;
		}
		if (ratio === 1 && data._apply) {
			pt = data._pt;
			while (pt) {
				if (pt.end) {
					if (data._prop) {
						target[data._prop] = pt.end;
					} else {
						target.setAttribute(pt.endProp, pt.end); //make sure the end value is exactly as specified (in case we had to add fabricated points during the tween)
					}
				}
				pt = pt._next;
			}
		} else if (rawPath) {

			//rotationally position the anchors
			while (anchorPT) {
				angle = anchorPT.sa + ratio * anchorPT.ca;
				l = anchorPT.sl + ratio * anchorPT.cl;    //length
				anchorPT.t[anchorPT.i] = data._origin.x + _cos(angle) * l;
				anchorPT.t[anchorPT.i + 1] = data._origin.y + _sin(angle) * l;
				anchorPT = anchorPT._next;
			}

			//smooth out the control points
			easeInOut = ratio < 0.5 ? 2 * ratio * ratio : (4 - 2 * ratio) * ratio - 1;
			while (controlPT) {
				i = controlPT.i;
				segment = rawPath[controlPT.j];
				offset = i + ((i === segment.length - 4) ? 7 - segment.length : 5); //accommodates wrapping around of smooth points, like if the start and end anchors are on top of each other and their handles are smooth.
				angle = _atan2(segment[offset] - segment[i+1], segment[offset-1] - segment[i]); //average the angles
				sin = _sin(angle);
				cos = _cos(angle);
				x = segment[i+2];
				y = segment[i+3];
				l = controlPT.l1s + easeInOut * controlPT.l1c;    //length
				segment[i] = x - cos * l;
				segment[i+1] = y - sin * l;
				l = controlPT.l2s + easeInOut * controlPT.l2c;
				segment[offset-1] = x + cos * l;
				segment[offset] = y + sin * l;
				controlPT = controlPT._next;
			}

			target._gsRawPath = rawPath;

			if (data._apply) {
				s = "";
				space = " ";
				for (j = 0; j < rawPath.length; j++) {
					segment = rawPath[j];
					l = segment.length;
					s += "M" + (((segment[0] * rnd) | 0) / rnd) + space + (((segment[1] * rnd) | 0) / rnd) + " C";
					for (i = 2; i < l; i++) { //this is actually faster than just doing a join() on the array, possibly because the numbers have so many decimal places
						s += (((segment[i] * rnd) | 0) / rnd) + space;
					}
				}
				if (data._prop) {
					target[data._prop] = s;
				} else {
					target.setAttribute("d", s);
				}
			}
		}
		data._render && rawPath && data._render.call(data._tween, rawPath, target);
	},
	kill(property) {
		this._pt = this._rawPath = 0;
	},
	getRawPath: getRawPath,
	stringToRawPath: stringToRawPath,
	rawPathToString: rawPathToString,
	normalizeStrings(shape1, shape2, {shapeIndex, map}) {
		let result = [shape1, shape2];
		_pathFilter(result, shapeIndex, map);
		return result;
	},
	pathFilter: _pathFilter,
	pointsFilter: _pointsFilter,
	getTotalSize: _getTotalSize,
	equalizeSegmentQuantity: _equalizeSegmentQuantity,
	convertToPath: (targets, swap) => _toArray(targets).map(target => convertToPath(target, swap !== false)),
	defaultType: "linear",
	defaultUpdateTarget: true,
	defaultMap: "size"
};

_getGSAP() && gsap.registerPlugin(MorphSVGPlugin);

export { MorphSVGPlugin as default };