/**
 * @monogrid/gainmap-js v3.1.0
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */

import { g as getDefaultExportFromCjs } from './_commonjsHelpers-DeBGiDfT.js';
import { c as compress } from './compress-B6OswAu8.js';

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
