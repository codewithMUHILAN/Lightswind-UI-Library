'use strict';

var objectSpread2 = require('./objectSpread2-2ccd0bad.cjs.prod.js');
var classCallCheck = require('./classCallCheck-839aeb3a.cjs.prod.js');
var misc_dist_maathMisc = require('./misc-023d073b.cjs.prod.js');

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

var Grad = function Grad(x, y, z) {
  var _this = this;

  classCallCheck._classCallCheck(this, Grad);

  objectSpread2._defineProperty(this, "dot2", function (x, y) {
    return _this.x * x + _this.y * y;
  });

  objectSpread2._defineProperty(this, "dot3", function (x, y, z) {
    return _this.x * x + _this.y * y + _this.z * z;
  });

  this.x = x;
  this.y = y;
  this.z = z;
};

var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180]; // To remove the need for index wrapping, double the permutation table length

var perm = new Array(512);
var gradP = new Array(512); // This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.

var seed = function seed(_seed) {
  if (_seed > 0 && _seed < 1) {
    // Scale the seed out
    _seed *= 65536;
  }

  _seed = Math.floor(_seed);

  if (_seed < 256) {
    _seed |= _seed << 8;
  }

  for (var i = 0; i < 256; i++) {
    var v;

    if (i & 1) {
      v = p[i] ^ _seed & 255;
    } else {
      v = p[i] ^ _seed >> 8 & 255;
    }

    perm[i] = perm[i + 256] = v;
    gradP[i] = gradP[i + 256] = grad3[v % 12];
  }
};
seed(0);
/*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/
// Skewing and unskewing factors for 2, 3, and 4 dimensions

var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;
var F3 = 1 / 3;
var G3 = 1 / 6; // 2D simplex noise

var simplex2 = function simplex2(xin, yin) {
  var n0, n1, n2; // Noise contributions from the three corners
  // Skew the input space to determine which simplex cell we're in

  var s = (xin + yin) * F2; // Hairy factor for 2D

  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var t = (i + j) * G2;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.

  var y0 = yin - j + t; // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.

  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords

  if (x0 > y0) {
    // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1 = 1;
    j1 = 0;
  } else {
    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1 = 0;
    j1 = 1;
  } // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6


  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords

  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords

  var y2 = y0 - 1 + 2 * G2; // Work out the hashed gradient indices of the three simplex corners

  i &= 255;
  j &= 255;
  var gi0 = gradP[i + perm[j]];
  var gi1 = gradP[i + i1 + perm[j + j1]];
  var gi2 = gradP[i + 1 + perm[j + 1]]; // Calculate the contribution from the three corners

  var t0 = 0.5 - x0 * x0 - y0 * y0;

  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
  }

  var t1 = 0.5 - x1 * x1 - y1 * y1;

  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot2(x1, y1);
  }

  var t2 = 0.5 - x2 * x2 - y2 * y2;

  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot2(x2, y2);
  } // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].


  return 70 * (n0 + n1 + n2);
}; // 3D simplex noise

var simplex3 = function simplex3(xin, yin, zin) {
  var n0, n1, n2, n3; // Noise contributions from the four corners
  // Skew the input space to determine which simplex cell we're in

  var s = (xin + yin + zin) * F3; // Hairy factor for 2D

  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var k = Math.floor(zin + s);
  var t = (i + j + k) * G3;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.

  var y0 = yin - j + t;
  var z0 = zin - k + t; // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  // Determine which simplex we are in.

  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords

  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords

  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }
  } // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
  // c = 1/6.


  var x1 = x0 - i1 + G3; // Offsets for second corner

  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;
  var x2 = x0 - i2 + 2 * G3; // Offsets for third corner

  var y2 = y0 - j2 + 2 * G3;
  var z2 = z0 - k2 + 2 * G3;
  var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner

  var y3 = y0 - 1 + 3 * G3;
  var z3 = z0 - 1 + 3 * G3; // Work out the hashed gradient indices of the four simplex corners

  i &= 255;
  j &= 255;
  k &= 255;
  var gi0 = gradP[i + perm[j + perm[k]]];
  var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
  var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
  var gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]]; // Calculate the contribution from the four corners

  var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;

  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
  }

  var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;

  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
  }

  var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;

  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
  }

  var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;

  if (t3 < 0) {
    n3 = 0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
  } // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].


  return 32 * (n0 + n1 + n2 + n3);
}; // ##### Perlin noise stuff
// 2D Perlin Noise

var perlin2 = function perlin2(x, y) {
  // Find unit grid cell containing point
  var X = Math.floor(x),
      Y = Math.floor(y); // Get relative xy coordinates of point within that cell

  x = x - X;
  y = y - Y; // Wrap the integer cells at 255 (smaller integer period can be introduced here)

  X = X & 255;
  Y = Y & 255; // Calculate noise contributions from each of the four corners

  var n00 = gradP[X + perm[Y]].dot2(x, y);
  var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
  var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
  var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1); // Compute the fade curve value for x

  var u = misc_dist_maathMisc.fade(x); // Interpolate the four results

  return misc_dist_maathMisc.lerp(misc_dist_maathMisc.lerp(n00, n10, u), misc_dist_maathMisc.lerp(n01, n11, u), misc_dist_maathMisc.fade(y));
}; // 3D Perlin Noise

var perlin3 = function perlin3(x, y, z) {
  // Find unit grid cell containing point
  var X = Math.floor(x),
      Y = Math.floor(y),
      Z = Math.floor(z); // Get relative xyz coordinates of point within that cell

  x = x - X;
  y = y - Y;
  z = z - Z; // Wrap the integer cells at 255 (smaller integer period can be introduced here)

  X = X & 255;
  Y = Y & 255;
  Z = Z & 255; // Calculate noise contributions from each of the eight corners

  var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
  var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
  var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
  var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
  var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
  var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
  var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
  var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1); // Compute the fade curve value for x, y, z

  var u = misc_dist_maathMisc.fade(x);
  var v = misc_dist_maathMisc.fade(y);
  var w = misc_dist_maathMisc.fade(z); // Interpolate

  return misc_dist_maathMisc.lerp(misc_dist_maathMisc.lerp(misc_dist_maathMisc.lerp(n000, n100, u), misc_dist_maathMisc.lerp(n001, n101, u), w), misc_dist_maathMisc.lerp(misc_dist_maathMisc.lerp(n010, n110, u), misc_dist_maathMisc.lerp(n011, n111, u), w), v);
};

var noise = /*#__PURE__*/Object.freeze({
  __proto__: null,
  seed: seed,
  simplex2: simplex2,
  simplex3: simplex3,
  perlin2: perlin2,
  perlin3: perlin3
});

var TAU = Math.PI * 2;
var FlashGen = /*#__PURE__*/function () {
  function FlashGen(props) {
    classCallCheck._classCallCheck(this, FlashGen);

    objectSpread2._defineProperty(this, "nextBurstTime", 0);

    objectSpread2._defineProperty(this, "nextFlashEndTime", 0);

    objectSpread2._defineProperty(this, "flashesDone", 0);

    objectSpread2._defineProperty(this, "isFlashing", false);

    objectSpread2._defineProperty(this, "currentCount", 0);

    objectSpread2._defineProperty(this, "flashIntensity", 0);

    objectSpread2._defineProperty(this, "isDecaying", false);

    objectSpread2._defineProperty(this, "autoBurst", true);

    objectSpread2._defineProperty(this, "decaySpeed", 40);

    objectSpread2._defineProperty(this, "minInterval", 5000);

    objectSpread2._defineProperty(this, "maxInterval", 10000);

    objectSpread2._defineProperty(this, "minDuration", 50);

    objectSpread2._defineProperty(this, "maxDuration", 300);

    objectSpread2._defineProperty(this, "count", 5);

    Object.assign(this, props);
  }

  _createClass(FlashGen, [{
    key: "scheduleNextBurst",
    value: function scheduleNextBurst(currentTime) {
      var burstInterval = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
      this.nextBurstTime = currentTime + burstInterval / 1000;
      this.flashesDone = 0;
      this.isFlashing = false;
    }
  }, {
    key: "burst",
    value: function burst() {
      this.nextBurstTime = 0;
      this.flashesDone = 0;
      this.isFlashing = false;
    }
  }, {
    key: "update",
    value: function update(currentTime, delta) {
      if (currentTime > this.nextBurstTime && this.currentCount === 0) {
        this.currentCount = Math.floor(Math.random() * this.count) + 1;
      }

      if (this.flashesDone < this.currentCount && currentTime > this.nextBurstTime) {
        if (!this.isFlashing) {
          this.isFlashing = true;
          this.flashIntensity = 1;
          var flashDuration = Math.random() * (this.maxDuration - this.minDuration) + this.minDuration;
          this.nextFlashEndTime = currentTime + flashDuration / 1000;
        } else if (this.isFlashing && currentTime > this.nextFlashEndTime) {
          this.isFlashing = false;
          this.isDecaying = true;
          this.flashesDone++;

          if (this.flashesDone >= this.currentCount) {
            this.currentCount = 0;
            if (this.autoBurst) this.scheduleNextBurst(currentTime);
          }
        }
      }

      if (this.isDecaying) {
        this.flashIntensity -= delta * this.decaySpeed;
        this.flashIntensity = Math.max(0, Math.min(1, this.flashIntensity));

        if (this.flashIntensity <= 0) {
          this.isDecaying = false;
          this.flashIntensity = 0;
        }
      }

      return this.flashIntensity;
    }
  }]);

  return FlashGen;
}(); // Credits @kchapelier https://github.com/kchapelier/wavefunctioncollapse/blob/master/example/lcg.js#L22-L30

function normalizeSeed(seed) {
  if (typeof seed === "number") {
    seed = Math.abs(seed);
  } else if (typeof seed === "string") {
    var string = seed;
    seed = 0;

    for (var i = 0; i < string.length; i++) {
      seed = (seed + (i + 1) * (string.charCodeAt(i) % 96)) % 2147483647;
    }
  }

  if (seed === 0) {
    seed = 311;
  }

  return seed;
}

function lcgRandom(seed) {
  var state = normalizeSeed(seed);
  return function () {
    var result = state * 48271 % 2147483647;
    state = result;
    return result / 2147483647;
  };
}

var Generator = function Generator(_seed) {
  var _this = this;

  classCallCheck._classCallCheck(this, Generator);

  objectSpread2._defineProperty(this, "seed", 0);

  objectSpread2._defineProperty(this, "init", function (seed) {
    _this.seed = seed;
    _this.value = lcgRandom(seed);
  });

  objectSpread2._defineProperty(this, "value", lcgRandom(this.seed));

  this.init(_seed);
};
var defaultGen = new Generator(Math.random());
/***
 * [3D] Sphere
 */

var defaultSphere = {
  radius: 1,
  center: [0, 0, 0]
}; // random on surface of sphere
// - https://twitter.com/fermatslibrary/status/1430932503578226688
// - https://mathworld.wolfram.com/SpherePointPicking.html

function onSphere(buffer, sphere) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultSphere$sphere = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultSphere), sphere),
      radius = _defaultSphere$sphere.radius,
      center = _defaultSphere$sphere.center;

  for (var i = 0; i < buffer.length; i += 3) {
    var u = rng.value();
    var v = rng.value();
    var theta = Math.acos(2 * v - 1);
    var phi = TAU * u;
    buffer[i] = Math.sin(theta) * Math.cos(phi) * radius + center[0];
    buffer[i + 1] = Math.sin(theta) * Math.sin(phi) * radius + center[1];
    buffer[i + 2] = Math.cos(theta) * radius + center[2];
  }

  return buffer;
} // from "Another Method" https://datagenetics.com/blog/january32020/index.html

function inSphere(buffer, sphere) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultSphere$sphere2 = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultSphere), sphere),
      radius = _defaultSphere$sphere2.radius,
      center = _defaultSphere$sphere2.center;

  for (var i = 0; i < buffer.length; i += 3) {
    var u = Math.pow(rng.value(), 1 / 3);
    var x = rng.value() * 2 - 1;
    var y = rng.value() * 2 - 1;
    var z = rng.value() * 2 - 1;
    var mag = Math.sqrt(x * x + y * y + z * z);
    x = u * x / mag;
    y = u * y / mag;
    z = u * z / mag;
    buffer[i] = x * radius + center[0];
    buffer[i + 1] = y * radius + center[1];
    buffer[i + 2] = z * radius + center[2];
  }

  return buffer;
}
/***
 * [2D] Circle
 */

var defaultCircle = {
  radius: 1,
  center: [0, 0]
}; // random circle https://stackoverflow.com/a/50746409

function inCircle(buffer, circle) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultCircle$circle = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultCircle), circle),
      radius = _defaultCircle$circle.radius,
      center = _defaultCircle$circle.center;

  for (var i = 0; i < buffer.length; i += 2) {
    var r = radius * Math.sqrt(rng.value());
    var theta = rng.value() * TAU;
    buffer[i] = Math.sin(theta) * r + center[0];
    buffer[i + 1] = Math.cos(theta) * r + center[1];
  }

  return buffer;
}
function onCircle(buffer, circle) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultCircle$circle2 = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultCircle), circle),
      radius = _defaultCircle$circle2.radius,
      center = _defaultCircle$circle2.center;

  for (var i = 0; i < buffer.length; i += 2) {
    var theta = rng.value() * TAU;
    buffer[i] = Math.sin(theta) * radius + center[0];
    buffer[i + 1] = Math.cos(theta) * radius + center[1];
  }

  return buffer;
}
/**
 * [2D] Plane
 */

var defaultRect = {
  sides: 1,
  center: [0, 0]
};
function inRect(buffer, rect) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultRect$rect = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultRect), rect),
      sides = _defaultRect$rect.sides,
      center = _defaultRect$rect.center;

  var sideX = typeof sides === "number" ? sides : sides[0];
  var sideY = typeof sides === "number" ? sides : sides[1];

  for (var i = 0; i < buffer.length; i += 2) {
    buffer[i] = (rng.value() - 0.5) * sideX + center[0];
    buffer[i + 1] = (rng.value() - 0.5) * sideY + center[1];
  }

  return buffer;
}
function onRect(buffer, rect) {
  return buffer;
}
/***
 * [3D] Box
 */

function inBox(buffer, box) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultBox$box = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultBox), box),
      sides = _defaultBox$box.sides,
      center = _defaultBox$box.center;

  var sideX = typeof sides === "number" ? sides : sides[0];
  var sideY = typeof sides === "number" ? sides : sides[1];
  var sideZ = typeof sides === "number" ? sides : sides[2];

  for (var i = 0; i < buffer.length; i += 3) {
    buffer[i] = (rng.value() - 0.5) * sideX + center[0];
    buffer[i + 1] = (rng.value() - 0.5) * sideY + center[1];
    buffer[i + 2] = (rng.value() - 0.5) * sideZ + center[2];
  }

  return buffer;
}
var defaultBox = {
  sides: 1,
  center: [0, 0, 0]
};
function onBox(buffer, box) {
  var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;

  var _defaultBox$box2 = objectSpread2._objectSpread2(objectSpread2._objectSpread2({}, defaultBox), box),
      sides = _defaultBox$box2.sides,
      center = _defaultBox$box2.center;

  var sideX = typeof sides === "number" ? sides : sides[0];
  var sideY = typeof sides === "number" ? sides : sides[1];
  var sideZ = typeof sides === "number" ? sides : sides[2];

  for (var i = 0; i < buffer.length; i += 3) {
    buffer[i] = (rng.value() - 0.5) * sideX + center[0];
    buffer[i + 1] = (rng.value() - 0.5) * sideY + center[1];
    buffer[i + 2] = (rng.value() - 0.5) * sideZ + center[2];
  }

  return buffer;
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FlashGen: FlashGen,
  Generator: Generator,
  onSphere: onSphere,
  inSphere: inSphere,
  inCircle: inCircle,
  onCircle: onCircle,
  inRect: inRect,
  onRect: onRect,
  inBox: inBox,
  onBox: onBox,
  noise: noise
});

exports.FlashGen = FlashGen;
exports.Generator = Generator;
exports.inBox = inBox;
exports.inCircle = inCircle;
exports.inRect = inRect;
exports.inSphere = inSphere;
exports.index = index;
exports.noise = noise;
exports.onBox = onBox;
exports.onCircle = onCircle;
exports.onRect = onRect;
exports.onSphere = onSphere;
