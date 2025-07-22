/**
 * @monogrid/gainmap-js v3.1.0
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */

(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var isPromise$2 = {exports: {}};

	isPromise$2.exports = isPromise$1;
	isPromise$2.exports.default = isPromise$1;

	function isPromise$1(obj) {
	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}

	var isPromiseExports = isPromise$2.exports;

	var isPromise = isPromiseExports;

	function registerPromiseWorker(callback) {

	  function postOutgoingMessage(e, messageId, error, result) {
	    function postMessage(msg, transferList) {
	      /* istanbul ignore if */
	      if (typeof self.postMessage !== 'function') { // service worker
	        e.ports[0].postMessage(msg, transferList);
	      } else { // web worker
	        self.postMessage(msg, transferList);
	      }
	    }
	    if (error) {
	      /* istanbul ignore else */
	      if (typeof console !== 'undefined' && 'error' in console) {
	        // This is to make errors easier to debug. I think it's important
	        // enough to just leave here without giving the user an option
	        // to silence it.
	        console.error('Worker caught an error:', error);
	      }
	      postMessage([messageId, {
	        message: error.message
	      }]);
	    } else {
	      if (result instanceof MessageWithTransferList) {
	        postMessage([messageId, null, result.message], result.transferList);
	      } else {
	        postMessage([messageId, null, result]);
	      }
	    }
	  }

	  function tryCatchFunc(callback, message) {
	    try {
	      return {res: callback(message, withTransferList)};
	    } catch (e) {
	      return {err: e};
	    }
	  }

	  function withTransferList(resMessage, transferList) {
	    return new MessageWithTransferList(resMessage, transferList);
	  } 

	  function handleIncomingMessage(e, callback, messageId, message) {

	    var result = tryCatchFunc(callback, message);

	    if (result.err) {
	      postOutgoingMessage(e, messageId, result.err);
	    } else if (!isPromise(result.res)) {
	        postOutgoingMessage(e, messageId, null, result.res);
	    } else {
	      result.res.then(function (finalResult) {
	        postOutgoingMessage(e, messageId, null, finalResult);
	      }, function (finalError) {
	        postOutgoingMessage(e, messageId, finalError);
	      });
	    }
	  }

	  function onIncomingMessage(e) {
	    var payload = e.data;
	    if (!Array.isArray(payload) || payload.length !== 2) {
	      // message doens't match communication format; ignore
	      return;
	    }
	    var messageId = payload[0];
	    var message = payload[1];

	    if (typeof callback !== 'function') {
	      postOutgoingMessage(e, messageId, new Error(
	        'Please pass a function into register().'));
	    } else {
	      handleIncomingMessage(e, callback, messageId, message);
	    }
	  }

	  function MessageWithTransferList(message, transferList) {
	    this.message = message;
	    this.transferList = transferList;
	  }

	  self.addEventListener('message', onIncomingMessage);
	}

	var register = registerPromiseWorker;

	var registerPromiseWorker$1 = /*@__PURE__*/getDefaultExportFromCjs(register);

	/**
	 * Used internally
	 *
	 * @internal
	 * @param canvas
	 * @param mimeType
	 * @param quality
	 * @returns
	 */
	const canvasToBlob = async (canvas, mimeType, quality) => {
	    if (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
	        return canvas.convertToBlob({ type: mimeType, quality: quality || 0.9 });
	    }
	    else if (canvas instanceof HTMLCanvasElement) {
	        return new Promise((resolve, reject) => {
	            canvas.toBlob((res) => {
	                if (res)
	                    resolve(res);
	                else
	                    reject(new Error('Failed to convert canvas to blob'));
	            }, mimeType, quality || 0.9);
	        });
	    }
	    /* istanbul ignore next
	      as long as this function is not exported this is only here
	      to satisfy TS strict mode internally
	    */
	    throw new Error('Unsupported canvas element');
	};
	/**
	 * Converts a RAW RGBA image buffer into the provided `mimeType` using the provided `quality`
	 *
	 * @category Compression
	 * @group Compression
	 * @param params
	 * @throws {Error} if the browser does not support [createImageBitmap](https://caniuse.com/createimagebitmap)
	 * @throws {Error} if the provided source image cannot be decoded
	 * @throws {Error} if the function fails to create a canvas context
	 */
	const compress = async (params) => {
	    if (typeof createImageBitmap === 'undefined')
	        throw new Error('createImageBitmap() not supported.');
	    const { source, mimeType, quality, flipY } = params;
	    // eslint-disable-next-line no-undef
	    let imageBitmapSource;
	    if ((source instanceof Uint8Array || source instanceof Uint8ClampedArray) && 'sourceMimeType' in params) {
	        imageBitmapSource = new Blob([source], { type: params.sourceMimeType });
	    }
	    else if (source instanceof ImageData) {
	        imageBitmapSource = source;
	    }
	    else {
	        throw new Error('Invalid source image');
	    }
	    const img = await createImageBitmap(imageBitmapSource);
	    const width = img.width;
	    const height = img.height;
	    let canvas;
	    if (typeof OffscreenCanvas !== 'undefined') {
	        canvas = new OffscreenCanvas(width, height);
	    }
	    else {
	        canvas = document.createElement('canvas');
	        canvas.width = width;
	        canvas.height = height;
	    }
	    const ctx = canvas.getContext('2d');
	    if (!ctx)
	        throw new Error('Failed to create canvas Context');
	    // flip Y
	    if (flipY === true) {
	        ctx.translate(0, height);
	        ctx.scale(1, -1);
	    }
	    ctx.drawImage(img, 0, 0, width, height);
	    const blob = await canvasToBlob(canvas, mimeType, quality || 0.9);
	    const data = new Uint8Array(await blob.arrayBuffer());
	    return {
	        data,
	        mimeType,
	        width,
	        height
	    };
	};

	// @ts-expect-error untyped lib
	const _compress = async (message, withTransferList) => {
	    const result = await compress(message.payload);
	    return withTransferList({
	        ...result,
	        source: message.payload.source instanceof ImageData ? message.payload.source.data : new Uint8ClampedArray(message.payload.source)
	    }, [result.data.buffer, message.payload.source instanceof ImageData ? message.payload.source.data.buffer : message.payload.source.buffer]);
	};
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	registerPromiseWorker$1(async (message, withTransferList) => {
	    switch (message.type) {
	        // case 'encode-gainmap-buffers':
	        //   return encodeGainmapBuffers(message, withTransferList)
	        case 'compress':
	            return _compress(message, withTransferList);
	    }
	});

}));
