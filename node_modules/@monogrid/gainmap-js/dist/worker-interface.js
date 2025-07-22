/**
 * @monogrid/gainmap-js v3.1.0
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */

import { c as commonjsGlobal, g as getDefaultExportFromCjs } from './_commonjsHelpers-DeBGiDfT.js';

var lib$1;
var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib$1;
	hasRequiredLib$1 = 1;
	var Mutation = commonjsGlobal.MutationObserver || commonjsGlobal.WebKitMutationObserver;

	var scheduleDrain;

	if (process.browser) {
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = commonjsGlobal.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!commonjsGlobal.setImmediate && typeof commonjsGlobal.MessageChannel !== 'undefined') {
	    var channel = new commonjsGlobal.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in commonjsGlobal && 'onreadystatechange' in commonjsGlobal.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = commonjsGlobal.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      commonjsGlobal.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	} else {
	  scheduleDrain = function () {
	    process.nextTick(nextTick);
	  };
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	lib$1 = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}
	return lib$1;
}

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	var immediate = requireLib$1();

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];
	/* istanbul ignore else */
	if (!process.browser) {
	  // in which we actually take advantage of JS scoping
	  var UNHANDLED = ['UNHANDLED'];
	}

	lib = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    this.handled = UNHANDLED;
	  }
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype.finally = function (callback) {
	  if (typeof callback !== 'function') {
	    return this;
	  }
	  var p = this.constructor;
	  return this.then(resolve, reject);

	  function resolve(value) {
	    function yes () {
	      return value;
	    }
	    return p.resolve(callback()).then(yes);
	  }
	  function reject(reason) {
	    function no () {
	      throw reason;
	    }
	    return p.resolve(callback()).then(no);
	  }
	};
	Promise.prototype.catch = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (this.handled === UNHANDLED) {
	      this.handled = null;
	    }
	  }
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (self.handled === UNHANDLED) {
	      immediate(function () {
	        if (self.handled === UNHANDLED) {
	          process.emit('unhandledRejection', error, self);
	        }
	      });
	    }
	  }
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	Promise.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	Promise.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	Promise.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	Promise.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}
	return lib;
}

/* istanbul ignore next */
var MyPromise = typeof Promise !== 'undefined' ? Promise : requireLib();

var messageIds = 0;

function onMessage(self, e) {
  var message = e.data;
  if (!Array.isArray(message) || message.length < 2) {
    // Ignore - this message is not for us.
    return;
  }
  var messageId = message[0];
  var error = message[1];
  var result = message[2];

  var callback = self._callbacks[messageId];

  if (!callback) {
    // Ignore - user might have created multiple PromiseWorkers.
    // This message is not for us.
    return;
  }

  delete self._callbacks[messageId];
  callback(error, result);
}

function PromiseWorker(worker) {
  var self = this;
  self._worker = worker;
  self._callbacks = {};

  worker.addEventListener('message', function (e) {
    onMessage(self, e);
  });
}

PromiseWorker.prototype.postMessage = function (userMessage, transferList) {
  var self = this;
  var messageId = messageIds++;

  var messageToSend = [messageId, userMessage];

  return new MyPromise(function (resolve, reject) {
    self._callbacks[messageId] = function (error, result) {
      if (error) {
        return reject(new Error(error.message));
      }
      resolve(result);
    };
    /* istanbul ignore if */
    if (typeof self._worker.controller !== 'undefined') {
      // service worker, use MessageChannels because e.source is broken in Chrome < 51:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=543198
      var channel = new MessageChannel();
      channel.port1.onmessage = function (e) {
        onMessage(self, e);
      };
      self._worker.controller.postMessage(messageToSend, [channel.port2].concat(transferList));
    } else {
      // web worker
      self._worker.postMessage(messageToSend, transferList);
    }
  });
};

PromiseWorker.prototype.terminate = function () {
    this._worker.terminate();
};

var promiseWorkerTransferable = PromiseWorker;

var PromiseWorker$1 = /*@__PURE__*/getDefaultExportFromCjs(promiseWorkerTransferable);

// @ts-expect-error untyped lib
/**
 * Wraps a Regular worker into a `PromiseWorker`
 *
 * @param worker
 * @returns
 */
const getPromiseWorker = (worker) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return new PromiseWorker$1(worker);
};
/**
 * Returns an interface where methods of the worker can be called by the host site
 *
 * @example
 * // this assumes a vite-like bundler understands the `?worker` import
 * import GainMapWorker from '@monogrid/gainmap-js/worker?worker'
 * import { getPromiseWorker, getWorkerInterface } from '@monogrid/gainmap-js/worker-interface'
 *
 * // turn our Worker into a PromiseWorker
 * const promiseWorker = getPromiseWorker(new GainMapWorker())
 * // get the interface
 * const workerInterface = getWorkerInterface(promiseWorker)
 *
 * @param worker
 * @returns
 */
const getWorkerInterface = (worker) => {
    return {
        compress: (payload) => worker.postMessage({ type: 'compress', payload })
    };
};

export { getPromiseWorker, getWorkerInterface };
