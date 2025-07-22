function SDFGenerator() {
var exports = (function (exports) {

  /**
   * Find the point on a quadratic bezier curve at t where t is in the range [0, 1]
   */
  function pointOnQuadraticBezier (x0, y0, x1, y1, x2, y2, t, pointOut) {
    var t2 = 1 - t;
    pointOut.x = t2 * t2 * x0 + 2 * t2 * t * x1 + t * t * x2;
    pointOut.y = t2 * t2 * y0 + 2 * t2 * t * y1 + t * t * y2;
  }

  /**
   * Find the point on a cubic bezier curve at t where t is in the range [0, 1]
   */
  function pointOnCubicBezier (x0, y0, x1, y1, x2, y2, x3, y3, t, pointOut) {
    var t2 = 1 - t;
    pointOut.x = t2 * t2 * t2 * x0 + 3 * t2 * t2 * t * x1 + 3 * t2 * t * t * x2 + t * t * t * x3;
    pointOut.y = t2 * t2 * t2 * y0 + 3 * t2 * t2 * t * y1 + 3 * t2 * t * t * y2 + t * t * t * y3;
  }

  /**
   * Parse a path string into its constituent line/curve commands, invoking a callback for each.
   * @param {string} pathString - An SVG-like path string to parse; should only contain commands: M/L/Q/C/Z
   * @param {function(
   *   command: 'L'|'Q'|'C',
   *   startX: number,
   *   startY: number,
   *   endX: number,
   *   endY: number,
   *   ctrl1X?: number,
   *   ctrl1Y?: number,
   *   ctrl2X?: number,
   *   ctrl2Y?: number
   * )} commandCallback - A callback function that will be called once for each parsed path command, passing the
   *                      command identifier (only L/Q/C commands) and its numeric arguments.
   */
  function forEachPathCommand(pathString, commandCallback) {
    var segmentRE = /([MLQCZ])([^MLQCZ]*)/g;
    var match, firstX, firstY, prevX, prevY;
    while ((match = segmentRE.exec(pathString))) {
      var args = match[2]
        .replace(/^\s*|\s*$/g, '')
        .split(/[,\s]+/)
        .map(function (v) { return parseFloat(v); });
      switch (match[1]) {
        case 'M':
          prevX = firstX = args[0];
          prevY = firstY = args[1];
          break
        case 'L':
          if (args[0] !== prevX || args[1] !== prevY) { // yup, some fonts have zero-length line commands
            commandCallback('L', prevX, prevY, (prevX = args[0]), (prevY = args[1]));
          }
          break
        case 'Q': {
          commandCallback('Q', prevX, prevY, (prevX = args[2]), (prevY = args[3]), args[0], args[1]);
          break
        }
        case 'C': {
          commandCallback('C', prevX, prevY, (prevX = args[4]), (prevY = args[5]), args[0], args[1], args[2], args[3]);
          break
        }
        case 'Z':
          if (prevX !== firstX || prevY !== firstY) {
            commandCallback('L', prevX, prevY, firstX, firstY);
          }
          break
      }
    }
  }

  /**
   * Convert a path string to a series of straight line segments
   * @param {string} pathString - An SVG-like path string to parse; should only contain commands: M/L/Q/C/Z
   * @param {function(x1:number, y1:number, x2:number, y2:number)} segmentCallback - A callback
   *        function that will be called once for every line segment
   * @param {number} [curvePoints] - How many straight line segments to use when approximating a
   *        bezier curve in the path. Defaults to 16.
   */
  function pathToLineSegments (pathString, segmentCallback, curvePoints) {
    if ( curvePoints === void 0 ) curvePoints = 16;

    var tempPoint = { x: 0, y: 0 };
    forEachPathCommand(pathString, function (command, startX, startY, endX, endY, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y) {
      switch (command) {
        case 'L':
          segmentCallback(startX, startY, endX, endY);
          break
        case 'Q': {
          var prevCurveX = startX;
          var prevCurveY = startY;
          for (var i = 1; i < curvePoints; i++) {
            pointOnQuadraticBezier(
              startX, startY,
              ctrl1X, ctrl1Y,
              endX, endY,
              i / (curvePoints - 1),
              tempPoint
            );
            segmentCallback(prevCurveX, prevCurveY, tempPoint.x, tempPoint.y);
            prevCurveX = tempPoint.x;
            prevCurveY = tempPoint.y;
          }
          break
        }
        case 'C': {
          var prevCurveX$1 = startX;
          var prevCurveY$1 = startY;
          for (var i$1 = 1; i$1 < curvePoints; i$1++) {
            pointOnCubicBezier(
              startX, startY,
              ctrl1X, ctrl1Y,
              ctrl2X, ctrl2Y,
              endX, endY,
              i$1 / (curvePoints - 1),
              tempPoint
            );
            segmentCallback(prevCurveX$1, prevCurveY$1, tempPoint.x, tempPoint.y);
            prevCurveX$1 = tempPoint.x;
            prevCurveY$1 = tempPoint.y;
          }
          break
        }
      }
    });
  }

  var viewportQuadVertex = "precision highp float;attribute vec2 aUV;varying vec2 vUV;void main(){vUV=aUV;gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}";

  var copyTexFragment = "precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){gl_FragColor=texture2D(tex,vUV);}";

  var cache = new WeakMap();

  var glContextParams = {
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    antialias: false,
    depth: false,
  };

  /**
   * This is a little helper library for WebGL. It assists with state management for a GL context.
   * It's pretty tightly wrapped to the needs of this package, not very general-purpose.
   *
   * @param { WebGLRenderingContext | HTMLCanvasElement | OffscreenCanvas } glOrCanvas - the GL context to wrap
   * @param { ({gl, getExtension, withProgram, withTexture, withTextureFramebuffer, handleContextLoss}) => void } callback
   */
  function withWebGLContext (glOrCanvas, callback) {
    var gl = glOrCanvas.getContext ? glOrCanvas.getContext('webgl', glContextParams) : glOrCanvas;
    var wrapper = cache.get(gl);
    if (!wrapper) {
      var isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
      var extensions = {};
      var programs = {};
      var textures = {};
      var textureUnit = -1;
      var framebufferStack = [];

      gl.canvas.addEventListener('webglcontextlost', function (e) {
        handleContextLoss();
        e.preventDefault();
      }, false);

      function getExtension (name) {
        var ext = extensions[name];
        if (!ext) {
          ext = extensions[name] = gl.getExtension(name);
          if (!ext) {
            throw new Error((name + " not supported"))
          }
        }
        return ext
      }

      function compileShader (src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        // const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        // if (!status && !gl.isContextLost()) {
        //   throw new Error(gl.getShaderInfoLog(shader).trim())
        // }
        return shader
      }

      function withProgram (name, vert, frag, func) {
        if (!programs[name]) {
          var attributes = {};
          var uniforms = {};
          var program = gl.createProgram();
          gl.attachShader(program, compileShader(vert, gl.VERTEX_SHADER));
          gl.attachShader(program, compileShader(frag, gl.FRAGMENT_SHADER));
          gl.linkProgram(program);

          programs[name] = {
            program: program,
            transaction: function transaction (func) {
              gl.useProgram(program);
              func({
                setUniform: function setUniform (type, name) {
                  var values = [], len = arguments.length - 2;
                  while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

                  var uniformLoc = uniforms[name] || (uniforms[name] = gl.getUniformLocation(program, name));
                  gl[("uniform" + type)].apply(gl, [ uniformLoc ].concat( values ));
                },

                setAttribute: function setAttribute (name, size, usage, instancingDivisor, data) {
                  var attr = attributes[name];
                  if (!attr) {
                    attr = attributes[name] = {
                      buf: gl.createBuffer(), // TODO should we destroy our buffers?
                      loc: gl.getAttribLocation(program, name),
                      data: null
                    };
                  }
                  gl.bindBuffer(gl.ARRAY_BUFFER, attr.buf);
                  gl.vertexAttribPointer(attr.loc, size, gl.FLOAT, false, 0, 0);
                  gl.enableVertexAttribArray(attr.loc);
                  if (isWebGL2) {
                    gl.vertexAttribDivisor(attr.loc, instancingDivisor);
                  } else {
                    getExtension('ANGLE_instanced_arrays').vertexAttribDivisorANGLE(attr.loc, instancingDivisor);
                  }
                  if (data !== attr.data) {
                    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
                    attr.data = data;
                  }
                }
              });
            }
          };
        }

        programs[name].transaction(func);
      }

      function withTexture (name, func) {
        textureUnit++;
        try {
          gl.activeTexture(gl.TEXTURE0 + textureUnit);
          var texture = textures[name];
          if (!texture) {
            texture = textures[name] = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          }
          gl.bindTexture(gl.TEXTURE_2D, texture);
          func(texture, textureUnit);
        } finally {
          textureUnit--;
        }
      }

      function withTextureFramebuffer (texture, textureUnit, func) {
        var framebuffer = gl.createFramebuffer();
        framebufferStack.push(framebuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        try {
          func(framebuffer);
        } finally {
          gl.deleteFramebuffer(framebuffer);
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferStack[--framebufferStack.length - 1] || null);
        }
      }

      function handleContextLoss () {
        extensions = {};
        programs = {};
        textures = {};
        textureUnit = -1;
        framebufferStack.length = 0;
      }

      cache.set(gl, wrapper = {
        gl: gl,
        isWebGL2: isWebGL2,
        getExtension: getExtension,
        withProgram: withProgram,
        withTexture: withTexture,
        withTextureFramebuffer: withTextureFramebuffer,
        handleContextLoss: handleContextLoss,
      });
    }
    callback(wrapper);
  }


  function renderImageData(glOrCanvas, imageData, x, y, width, height, channels, framebuffer) {
    if ( channels === void 0 ) channels = 15;
    if ( framebuffer === void 0 ) framebuffer = null;

    withWebGLContext(glOrCanvas, function (ref) {
      var gl = ref.gl;
      var withProgram = ref.withProgram;
      var withTexture = ref.withTexture;

      withTexture('copy', function (tex, texUnit) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        withProgram('copy', viewportQuadVertex, copyTexFragment, function (ref) {
          var setUniform = ref.setUniform;
          var setAttribute = ref.setAttribute;

          setAttribute('aUV', 2, gl.STATIC_DRAW, 0, new Float32Array([0, 0, 2, 0, 0, 2]));
          setUniform('1i', 'image', texUnit);
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer || null);
          gl.disable(gl.BLEND);
          gl.colorMask(channels & 8, channels & 4, channels & 2, channels & 1);
          gl.viewport(x, y, width, height);
          gl.scissor(x, y, width, height);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        });
      });
    });
  }

  /**
   * Resizing a canvas clears its contents; this utility copies the previous contents over.
   * @param canvas
   * @param newWidth
   * @param newHeight
   */
  function resizeWebGLCanvasWithoutClearing(canvas, newWidth, newHeight) {
    var width = canvas.width;
    var height = canvas.height;
    withWebGLContext(canvas, function (ref) {
      var gl = ref.gl;

      var data = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      canvas.width = newWidth;
      canvas.height = newHeight;
      renderImageData(gl, data, 0, 0, width, height);
    });
  }

  var webglUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    withWebGLContext: withWebGLContext,
    renderImageData: renderImageData,
    resizeWebGLCanvasWithoutClearing: resizeWebGLCanvasWithoutClearing
  });

  function generate$2 (sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent) {
    if ( sdfExponent === void 0 ) sdfExponent = 1;

    var textureData = new Uint8Array(sdfWidth * sdfHeight);

    var viewBoxWidth = viewBox[2] - viewBox[0];
    var viewBoxHeight = viewBox[3] - viewBox[1];

    // Decompose all paths into straight line segments and add them to an index
    var segments = [];
    pathToLineSegments(path, function (x1, y1, x2, y2) {
      segments.push({
        x1: x1, y1: y1, x2: x2, y2: y2,
        minX: Math.min(x1, x2),
        minY: Math.min(y1, y2),
        maxX: Math.max(x1, x2),
        maxY: Math.max(y1, y2)
      });
    });

    // Sort segments by maxX, this will let us short-circuit some loops below
    segments.sort(function (a, b) { return a.maxX - b.maxX; });

    // For each target SDF texel, find the distance from its center to its nearest line segment,
    // map that distance to an alpha value, and write that alpha to the texel
    for (var sdfX = 0; sdfX < sdfWidth; sdfX++) {
      for (var sdfY = 0; sdfY < sdfHeight; sdfY++) {
        var signedDist = findNearestSignedDistance(
          viewBox[0] + viewBoxWidth * (sdfX + 0.5) / sdfWidth,
          viewBox[1] + viewBoxHeight * (sdfY + 0.5) / sdfHeight
        );

        // Use an exponential scale to ensure the texels very near the glyph path have adequate
        // precision, while allowing the distance field to cover the entire texture, given that
        // there are only 8 bits available. Formula visualized: https://www.desmos.com/calculator/uiaq5aqiam
        var alpha = Math.pow((1 - Math.abs(signedDist) / maxDistance), sdfExponent) / 2;
        if (signedDist < 0) {
          alpha = 1 - alpha;
        }

        alpha = Math.max(0, Math.min(255, Math.round(alpha * 255))); //clamp
        textureData[sdfY * sdfWidth + sdfX] = alpha;
      }
    }

    return textureData

    /**
     * For a given x/y, search the index for the closest line segment and return
     * its signed distance. Negative = inside, positive = outside, zero = on edge
     * @param x
     * @param y
     * @returns {number}
     */
    function findNearestSignedDistance (x, y) {
      var closestDistSq = Infinity;
      var closestDist = Infinity;

      for (var i = segments.length; i--;) {
        var seg = segments[i];
        if (seg.maxX + closestDist <= x) { break } //sorting by maxX means no more can be closer, so we can short-circuit
        if (x + closestDist > seg.minX && y - closestDist < seg.maxY && y + closestDist > seg.minY) {
          var distSq = absSquareDistanceToLineSegment(x, y, seg.x1, seg.y1, seg.x2, seg.y2);
          if (distSq < closestDistSq) {
            closestDistSq = distSq;
            closestDist = Math.sqrt(closestDistSq);
          }
        }
      }

      // Flip to negative distance if inside the poly
      if (isPointInPoly(x, y)) {
        closestDist = -closestDist;
      }
      return closestDist
    }

    /**
     * Determine whether the given point lies inside or outside the glyph. Uses a simple
     * winding-number ray casting algorithm using a ray pointing east from the point.
     */
    function isPointInPoly (x, y) {
      var winding = 0;
      for (var i = segments.length; i--;) {
        var seg = segments[i];
        if (seg.maxX <= x) { break } //sorting by maxX means no more can cross, so we can short-circuit
        var intersects = ((seg.y1 > y) !== (seg.y2 > y)) && (x < (seg.x2 - seg.x1) * (y - seg.y1) / (seg.y2 - seg.y1) + seg.x1);
        if (intersects) {
          winding += seg.y1 < seg.y2 ? 1 : -1;
        }
      }
      return winding !== 0
    }
  }

  function generateIntoCanvas$2(sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, canvas, x, y, channel) {
    if ( sdfExponent === void 0 ) sdfExponent = 1;
    if ( x === void 0 ) x = 0;
    if ( y === void 0 ) y = 0;
    if ( channel === void 0 ) channel = 0;

    generateIntoFramebuffer$1(sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, canvas, null, x, y, channel);
  }

  function generateIntoFramebuffer$1 (sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, glOrCanvas, framebuffer, x, y, channel) {
    if ( sdfExponent === void 0 ) sdfExponent = 1;
    if ( x === void 0 ) x = 0;
    if ( y === void 0 ) y = 0;
    if ( channel === void 0 ) channel = 0;

    var data = generate$2(sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent);
    // Expand single-channel data to rbga
    var rgbaData = new Uint8Array(data.length * 4);
    for (var i = 0; i < data.length; i++) {
      rgbaData[i * 4 + channel] = data[i];
    }
    renderImageData(glOrCanvas, rgbaData, x, y, sdfWidth, sdfHeight, 1 << (3 - channel), framebuffer);
  }

  /**
   * Find the absolute distance from a point to a line segment at closest approach
   */
  function absSquareDistanceToLineSegment (x, y, lineX0, lineY0, lineX1, lineY1) {
    var ldx = lineX1 - lineX0;
    var ldy = lineY1 - lineY0;
    var lengthSq = ldx * ldx + ldy * ldy;
    var t = lengthSq ? Math.max(0, Math.min(1, ((x - lineX0) * ldx + (y - lineY0) * ldy) / lengthSq)) : 0;
    var dx = x - (lineX0 + t * ldx);
    var dy = y - (lineY0 + t * ldy);
    return dx * dx + dy * dy
  }

  var javascript = /*#__PURE__*/Object.freeze({
    __proto__: null,
    generate: generate$2,
    generateIntoCanvas: generateIntoCanvas$2,
    generateIntoFramebuffer: generateIntoFramebuffer$1
  });

  var mainVertex = "precision highp float;uniform vec4 uGlyphBounds;attribute vec2 aUV;attribute vec4 aLineSegment;varying vec4 vLineSegment;varying vec2 vGlyphXY;void main(){vLineSegment=aLineSegment;vGlyphXY=mix(uGlyphBounds.xy,uGlyphBounds.zw,aUV);gl_Position=vec4(mix(vec2(-1.0),vec2(1.0),aUV),0.0,1.0);}";

  var mainFragment = "precision highp float;uniform vec4 uGlyphBounds;uniform float uMaxDistance;uniform float uExponent;varying vec4 vLineSegment;varying vec2 vGlyphXY;float absDistToSegment(vec2 point,vec2 lineA,vec2 lineB){vec2 lineDir=lineB-lineA;float lenSq=dot(lineDir,lineDir);float t=lenSq==0.0 ? 0.0 : clamp(dot(point-lineA,lineDir)/lenSq,0.0,1.0);vec2 linePt=lineA+t*lineDir;return distance(point,linePt);}void main(){vec4 seg=vLineSegment;vec2 p=vGlyphXY;float dist=absDistToSegment(p,seg.xy,seg.zw);float val=pow(1.0-clamp(dist/uMaxDistance,0.0,1.0),uExponent)*0.5;bool crossing=(seg.y>p.y!=seg.w>p.y)&&(p.x<(seg.z-seg.x)*(p.y-seg.y)/(seg.w-seg.y)+seg.x);bool crossingUp=crossing&&vLineSegment.y<vLineSegment.w;gl_FragColor=vec4(crossingUp ? 1.0/255.0 : 0.0,crossing&&!crossingUp ? 1.0/255.0 : 0.0,0.0,val);}";

  var postFragment = "precision highp float;uniform sampler2D tex;varying vec2 vUV;void main(){vec4 color=texture2D(tex,vUV);bool inside=color.r!=color.g;float val=inside ? 1.0-color.a : color.a;gl_FragColor=vec4(val);}";

  // Single triangle covering viewport
  var viewportUVs = new Float32Array([0, 0, 2, 0, 0, 2]);

  var implicitContext = null;
  var isTestingSupport = false;
  var NULL_OBJECT = {};
  var supportByCanvas = new WeakMap(); // canvas -> bool

  function validateSupport (glOrCanvas) {
    if (!isTestingSupport && !isSupported(glOrCanvas)) {
      throw new Error('WebGL generation not supported')
    }
  }

  function generate$1 (sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, glOrCanvas) {
    if ( sdfExponent === void 0 ) sdfExponent = 1;
    if ( glOrCanvas === void 0 ) glOrCanvas = null;

    if (!glOrCanvas) {
      glOrCanvas = implicitContext;
      if (!glOrCanvas) {
        var canvas = typeof OffscreenCanvas === 'function'
          ? new OffscreenCanvas(1, 1)
          : typeof document !== 'undefined'
            ? document.createElement('canvas')
            : null;
        if (!canvas) {
          throw new Error('OffscreenCanvas or DOM canvas not supported')
        }
        glOrCanvas = implicitContext = canvas.getContext('webgl', { depth: false });
      }
    }

    validateSupport(glOrCanvas);

    var rgbaData = new Uint8Array(sdfWidth * sdfHeight * 4); //not Uint8ClampedArray, cuz Safari

    // Render into a background texture framebuffer
    withWebGLContext(glOrCanvas, function (ref) {
      var gl = ref.gl;
      var withTexture = ref.withTexture;
      var withTextureFramebuffer = ref.withTextureFramebuffer;

      withTexture('readable', function (texture, textureUnit) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sdfWidth, sdfHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        withTextureFramebuffer(texture, textureUnit, function (framebuffer) {
          generateIntoFramebuffer(
            sdfWidth,
            sdfHeight,
            path,
            viewBox,
            maxDistance,
            sdfExponent,
            gl,
            framebuffer,
            0,
            0,
            0 // red channel
          );
          gl.readPixels(0, 0, sdfWidth, sdfHeight, gl.RGBA, gl.UNSIGNED_BYTE, rgbaData);
        });
      });
    });

    // Throw away all but the red channel
    var data = new Uint8Array(sdfWidth * sdfHeight);
    for (var i = 0, j = 0; i < rgbaData.length; i += 4) {
      data[j++] = rgbaData[i];
    }

    return data
  }

  function generateIntoCanvas$1(sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, canvas, x, y, channel) {
    if ( sdfExponent === void 0 ) sdfExponent = 1;
    if ( x === void 0 ) x = 0;
    if ( y === void 0 ) y = 0;
    if ( channel === void 0 ) channel = 0;

    generateIntoFramebuffer(sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, canvas, null, x, y, channel);
  }

  function generateIntoFramebuffer (sdfWidth, sdfHeight, path, viewBox, maxDistance, sdfExponent, glOrCanvas, framebuffer, x, y, channel) {
    if ( sdfExponent === void 0 ) sdfExponent = 1;
    if ( x === void 0 ) x = 0;
    if ( y === void 0 ) y = 0;
    if ( channel === void 0 ) channel = 0;

    // Verify support
    validateSupport(glOrCanvas);

    // Compute path segments
    var lineSegmentCoords = [];
    pathToLineSegments(path, function (x1, y1, x2, y2) {
      lineSegmentCoords.push(x1, y1, x2, y2);
    });
    lineSegmentCoords = new Float32Array(lineSegmentCoords);

    withWebGLContext(glOrCanvas, function (ref) {
      var gl = ref.gl;
      var isWebGL2 = ref.isWebGL2;
      var getExtension = ref.getExtension;
      var withProgram = ref.withProgram;
      var withTexture = ref.withTexture;
      var withTextureFramebuffer = ref.withTextureFramebuffer;
      var handleContextLoss = ref.handleContextLoss;

      withTexture('rawDistances', function (intermediateTexture, intermediateTextureUnit) {
        if (sdfWidth !== intermediateTexture._lastWidth || sdfHeight !== intermediateTexture._lastHeight) {
          gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            intermediateTexture._lastWidth = sdfWidth,
            intermediateTexture._lastHeight = sdfHeight,
            0, gl.RGBA, gl.UNSIGNED_BYTE, null
          );
        }

        // Unsigned distance pass
        withProgram('main', mainVertex, mainFragment, function (ref) {
          var setAttribute = ref.setAttribute;
          var setUniform = ref.setUniform;

          // Init extensions
          var instancingExtension = !isWebGL2 && getExtension('ANGLE_instanced_arrays');
          var blendMinMaxExtension = !isWebGL2 && getExtension('EXT_blend_minmax');

          // Init/update attributes
          setAttribute('aUV', 2, gl.STATIC_DRAW, 0, viewportUVs);
          setAttribute('aLineSegment', 4, gl.DYNAMIC_DRAW, 1, lineSegmentCoords);

          // Init/update uniforms
          setUniform.apply(void 0, [ '4f', 'uGlyphBounds' ].concat( viewBox ));
          setUniform('1f', 'uMaxDistance', maxDistance);
          setUniform('1f', 'uExponent', sdfExponent);

          // Render initial unsigned distance / winding number info to a texture
          withTextureFramebuffer(intermediateTexture, intermediateTextureUnit, function (framebuffer) {
            gl.enable(gl.BLEND);
            gl.colorMask(true, true, true, true);
            gl.viewport(0, 0, sdfWidth, sdfHeight);
            gl.scissor(0, 0, sdfWidth, sdfHeight);
            gl.blendFunc(gl.ONE, gl.ONE);
            // Red+Green channels are incremented (FUNC_ADD) for segment-ray crossings to give a "winding number".
            // Alpha holds the closest (MAX) unsigned distance.
            gl.blendEquationSeparate(gl.FUNC_ADD, isWebGL2 ? gl.MAX : blendMinMaxExtension.MAX_EXT);
            gl.clear(gl.COLOR_BUFFER_BIT);
            if (isWebGL2) {
              gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, lineSegmentCoords.length / 4);
            } else {
              instancingExtension.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 3, lineSegmentCoords.length / 4);
            }
            // Debug
            // const debug = new Uint8Array(sdfWidth * sdfHeight * 4)
            // gl.readPixels(0, 0, sdfWidth, sdfHeight, gl.RGBA, gl.UNSIGNED_BYTE, debug)
            // console.log('intermediate texture data: ', debug)
          });
        });

        // Use the data stored in the texture to apply inside/outside and write to the output framebuffer rect+channel.
        withProgram('post', viewportQuadVertex, postFragment, function (program) {
          program.setAttribute('aUV', 2, gl.STATIC_DRAW, 0, viewportUVs);
          program.setUniform('1i', 'tex', intermediateTextureUnit);
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
          gl.disable(gl.BLEND);
          gl.colorMask(channel === 0, channel === 1, channel === 2, channel === 3);
          gl.viewport(x, y, sdfWidth, sdfHeight);
          gl.scissor(x, y, sdfWidth, sdfHeight);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        });
      });

      // Handle context loss occurring during any of the above calls
      if (gl.isContextLost()) {
        handleContextLoss();
        throw new Error('webgl context lost')
      }
    });
  }

  function isSupported (glOrCanvas) {
    var key = (!glOrCanvas || glOrCanvas === implicitContext) ? NULL_OBJECT : (glOrCanvas.canvas || glOrCanvas);
    var supported = supportByCanvas.get(key);
    if (supported === undefined) {
      isTestingSupport = true;
      var failReason = null;
      try {
        // Since we can't detect all failure modes up front, let's just do a trial run of a
        // simple path and compare what we get back to the correct expected result. This will
        // also serve to prime the shader compilation.
        var expectedResult = [
          97, 106, 97, 61,
          99, 137, 118, 80,
          80, 118, 137, 99,
          61, 97, 106, 97
        ];
        var testResult = generate$1(
          4,
          4,
          'M8,8L16,8L24,24L16,24Z',
          [0, 0, 32, 32],
          24,
          1,
          glOrCanvas
        );
        supported = testResult && expectedResult.length === testResult.length &&
          testResult.every(function (val, i) { return val === expectedResult[i]; });
        if (!supported) {
          failReason = 'bad trial run results';
          console.info(expectedResult, testResult);
        }
      } catch (err) {
        // TODO if it threw due to webgl context loss, should we maybe leave isSupported as null and try again later?
        supported = false;
        failReason = err.message;
      }
      if (failReason) {
        console.warn('WebGL SDF generation not supported:', failReason);
      }
      isTestingSupport = false;
      supportByCanvas.set(key, supported);
    }
    return supported
  }

  var webgl = /*#__PURE__*/Object.freeze({
    __proto__: null,
    generate: generate$1,
    generateIntoCanvas: generateIntoCanvas$1,
    generateIntoFramebuffer: generateIntoFramebuffer,
    isSupported: isSupported
  });

  /**
   * Generate an SDF texture image for a 2D path.
   *
   * @param {number} sdfWidth - width of the SDF output image in pixels.
   * @param {number} sdfHeight - height of the SDF output image in pixels.
   * @param {string} path - an SVG-like path string describing the glyph; should only contain commands: M/L/Q/C/Z.
   * @param {number[]} viewBox - [minX, minY, maxX, maxY] in font units aligning with the texture's edges.
   * @param {number} maxDistance - the maximum distance from the glyph path in font units that will be encoded; defaults
   *        to half the maximum viewBox dimension.
   * @param {number} [sdfExponent] - specifies an exponent for encoding the SDF's distance values; higher exponents
   *        will give greater precision nearer the glyph's path.
   * @return {Uint8Array}
   */
  function generate(
    sdfWidth,
    sdfHeight,
    path,
    viewBox,
    maxDistance,
    sdfExponent
  ) {
    if ( maxDistance === void 0 ) maxDistance = Math.max(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1]) / 2;
    if ( sdfExponent === void 0 ) sdfExponent = 1;

    try {
      return generate$1.apply(webgl, arguments)
    } catch(e) {
      console.info('WebGL SDF generation failed, falling back to JS', e);
      return generate$2.apply(javascript, arguments)
    }
  }

  /**
   * Generate an SDF texture image for a 2D path, inserting the result into a WebGL `canvas` at a given x/y position
   * and color channel. This is generally much faster than calling `generate` because it does not require reading pixels
   * back from the GPU->CPU -- the `canvas` can be used directly as a WebGL texture image, so it all stays on the GPU.
   *
   * @param {number} sdfWidth - width of the SDF output image in pixels.
   * @param {number} sdfHeight - height of the SDF output image in pixels.
   * @param {string} path - an SVG-like path string describing the glyph; should only contain commands: M/L/Q/C/Z.
   * @param {number[]} viewBox - [minX, minY, maxX, maxY] in font units aligning with the texture's edges.
   * @param {number} maxDistance - the maximum distance from the glyph path in font units that will be encoded; defaults
   *        to half the maximum viewBox dimension.
   * @param {number} [sdfExponent] - specifies an exponent for encoding the SDF's distance values; higher exponents
   *        will give greater precision nearer the glyph's path.
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas - a WebGL-enabled canvas into which the SDF will be rendered.
   *        Only the relevant rect/channel will be modified, the rest will be preserved. To avoid unpredictable results
   *        due to shared GL context state, this canvas should be dedicated to use by this library alone.
   * @param {number} x - the x position at which to render the SDF.
   * @param {number} y - the y position at which to render the SDF.
   * @param {number} channel - the color channel index (0-4) into which the SDF will be rendered.
   * @return {Uint8Array}
   */
  function generateIntoCanvas(
    sdfWidth,
    sdfHeight,
    path,
    viewBox,
    maxDistance,
    sdfExponent,
    canvas,
    x,
    y,
    channel
  ) {
    if ( maxDistance === void 0 ) maxDistance = Math.max(viewBox[2] - viewBox[0], viewBox[3] - viewBox[1]) / 2;
    if ( sdfExponent === void 0 ) sdfExponent = 1;
    if ( x === void 0 ) x = 0;
    if ( y === void 0 ) y = 0;
    if ( channel === void 0 ) channel = 0;

    try {
      return generateIntoCanvas$1.apply(webgl, arguments)
    } catch(e) {
      console.info('WebGL SDF generation failed, falling back to JS', e);
      return generateIntoCanvas$2.apply(javascript, arguments)
    }
  }

  exports.forEachPathCommand = forEachPathCommand;
  exports.generate = generate;
  exports.generateIntoCanvas = generateIntoCanvas;
  exports.javascript = javascript;
  exports.pathToLineSegments = pathToLineSegments;
  exports.webgl = webgl;
  exports.webglUtils = webglUtils;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
return exports
}

export { SDFGenerator as default };
