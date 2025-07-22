/**
 * Main content for the worker that handles the loading and execution of
 * modules within it.
 */
function workerBootstrap() {
  var modules = Object.create(null);

  // Handle messages for registering a module
  function registerModule(ref, callback) {
    var id = ref.id;
    var name = ref.name;
    var dependencies = ref.dependencies; if ( dependencies === void 0 ) dependencies = [];
    var init = ref.init; if ( init === void 0 ) init = function(){};
    var getTransferables = ref.getTransferables; if ( getTransferables === void 0 ) getTransferables = null;

    // Only register once
    if (modules[id]) { return }

    try {
      // If any dependencies are modules, ensure they're registered and grab their value
      dependencies = dependencies.map(function (dep) {
        if (dep && dep.isWorkerModule) {
          registerModule(dep, function (depResult) {
            if (depResult instanceof Error) { throw depResult }
          });
          dep = modules[dep.id].value;
        }
        return dep
      });

      // Rehydrate functions
      init = rehydrate(("<" + name + ">.init"), init);
      if (getTransferables) {
        getTransferables = rehydrate(("<" + name + ">.getTransferables"), getTransferables);
      }

      // Initialize the module and store its value
      var value = null;
      if (typeof init === 'function') {
        value = init.apply(void 0, dependencies);
      } else {
        console.error('worker module init function failed to rehydrate');
      }
      modules[id] = {
        id: id,
        value: value,
        getTransferables: getTransferables
      };
      callback(value);
    } catch(err) {
      if (!(err && err.noLog)) {
        console.error(err);
      }
      callback(err);
    }
  }

  // Handle messages for calling a registered module's result function
  function callModule(ref, callback) {
    var ref$1;

    var id = ref.id;
    var args = ref.args;
    if (!modules[id] || typeof modules[id].value !== 'function') {
      callback(new Error(("Worker module " + id + ": not found or its 'init' did not return a function")));
    }
    try {
      var result = (ref$1 = modules[id]).value.apply(ref$1, args);
      if (result && typeof result.then === 'function') {
        result.then(handleResult, function (rej) { return callback(rej instanceof Error ? rej : new Error('' + rej)); });
      } else {
        handleResult(result);
      }
    } catch(err) {
      callback(err);
    }
    function handleResult(result) {
      try {
        var tx = modules[id].getTransferables && modules[id].getTransferables(result);
        if (!tx || !Array.isArray(tx) || !tx.length) {
          tx = undefined; //postMessage is very picky about not passing null or empty transferables
        }
        callback(result, tx);
      } catch(err) {
        console.error(err);
        callback(err);
      }
    }
  }

  function rehydrate(name, str) {
    var result = void 0;
    self.troikaDefine = function (r) { return result = r; };
    var url = URL.createObjectURL(
      new Blob(
        [("/** " + (name.replace(/\*/g, '')) + " **/\n\ntroikaDefine(\n" + str + "\n)")],
        {type: 'application/javascript'}
      )
    );
    try {
      importScripts(url);
    } catch(err) {
      console.error(err);
    }
    URL.revokeObjectURL(url);
    delete self.troikaDefine;
    return result
  }

  // Handler for all messages within the worker
  self.addEventListener('message', function (e) {
    var ref = e.data;
    var messageId = ref.messageId;
    var action = ref.action;
    var data = ref.data;
    try {
      // Module registration
      if (action === 'registerModule') {
        registerModule(data, function (result) {
          if (result instanceof Error) {
            postMessage({
              messageId: messageId,
              success: false,
              error: result.message
            });
          } else {
            postMessage({
              messageId: messageId,
              success: true,
              result: {isCallable: typeof result === 'function'}
            });
          }
        });
      }
      // Invocation
      if (action === 'callModule') {
        callModule(data, function (result, transferables) {
          if (result instanceof Error) {
            postMessage({
              messageId: messageId,
              success: false,
              error: result.message
            });
          } else {
            postMessage({
              messageId: messageId,
              success: true,
              result: result
            }, transferables || undefined);
          }
        });
      }
    } catch(err) {
      postMessage({
        messageId: messageId,
        success: false,
        error: err.stack
      });
    }
  });
}

/**
 * Fallback for `defineWorkerModule` that behaves identically but runs in the main
 * thread, for when the execution environment doesn't support web workers or they
 * are disallowed due to e.g. CSP security restrictions.
 */
function defineMainThreadModule(options) {
  var moduleFunc = function() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return moduleFunc._getInitResult().then(function (initResult) {
      if (typeof initResult === 'function') {
        return initResult.apply(void 0, args)
      } else {
        throw new Error('Worker module function was called but `init` did not return a callable function')
      }
    })
  };
  moduleFunc._getInitResult = function() {
    // We can ignore getTransferables in main thread. TODO workerId?
    var dependencies = options.dependencies;
    var init = options.init;

    // Resolve dependencies
    dependencies = Array.isArray(dependencies) ? dependencies.map(function (dep) {
      if (dep) {
        // If it's a worker module, use its main thread impl
        dep = dep.onMainThread || dep;
        // If it's a main thread worker module, use its init return value
        if (dep._getInitResult) {
          dep = dep._getInitResult();
        }
      }
      return dep
    }) : [];

    // Invoke init with the resolved dependencies
    var initPromise = Promise.all(dependencies).then(function (deps) {
      return init.apply(null, deps)
    });

    // Cache the resolved promise for subsequent calls
    moduleFunc._getInitResult = function () { return initPromise; };

    return initPromise
  };
  return moduleFunc
}

var supportsWorkers = function () {
  var supported = false;

  // Only attempt worker initialization in browsers; elsewhere it would just be
  // noise e.g. loading into a Node environment for SSR.
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    try {
      // TODO additional checks for things like importScripts within the worker?
      //  Would need to be an async check.
      var worker = new Worker(
        URL.createObjectURL(new Blob([''], { type: 'application/javascript' }))
      );
      worker.terminate();
      supported = true;
    } catch (err) {
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') ; else {
        console.log(
          ("Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: [" + (err.message) + "]")
        );
      }
    }
  }

  // Cached result
  supportsWorkers = function () { return supported; };
  return supported
};

var _workerModuleId = 0;
var _messageId = 0;
var _allowInitAsString = false;
var workers = Object.create(null);
var registeredModules = Object.create(null); //workerId -> Set<unregisterFn>
var openRequests = Object.create(null);


/**
 * Define a module of code that will be executed with a web worker. This provides a simple
 * interface for moving chunks of logic off the main thread, and managing their dependencies
 * among one another.
 *
 * @param {object} options
 * @param {function} options.init
 * @param {array} [options.dependencies]
 * @param {function} [options.getTransferables]
 * @param {string} [options.name]
 * @param {string} [options.workerId]
 * @return {function(...[*]): {then}}
 */
function defineWorkerModule(options) {
  if ((!options || typeof options.init !== 'function') && !_allowInitAsString) {
    throw new Error('requires `options.init` function')
  }
  var dependencies = options.dependencies;
  var init = options.init;
  var getTransferables = options.getTransferables;
  var workerId = options.workerId;

  var onMainThread = defineMainThreadModule(options);

  if (workerId == null) {
    workerId = '#default';
  }
  var id = "workerModule" + (++_workerModuleId);
  var name = options.name || id;
  var registrationPromise = null;

  dependencies = dependencies && dependencies.map(function (dep) {
    // Wrap raw functions as worker modules with no dependencies
    if (typeof dep === 'function' && !dep.workerModuleData) {
      _allowInitAsString = true;
      dep = defineWorkerModule({
        workerId: workerId,
        name: ("<" + name + "> function dependency: " + (dep.name)),
        init: ("function(){return (\n" + (stringifyFunction(dep)) + "\n)}")
      });
      _allowInitAsString = false;
    }
    // Grab postable data for worker modules
    if (dep && dep.workerModuleData) {
      dep = dep.workerModuleData;
    }
    return dep
  });

  function moduleFunc() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (!supportsWorkers()) {
      return onMainThread.apply(void 0, args)
    }

    // Register this module if needed
    if (!registrationPromise) {
      registrationPromise = callWorker(workerId,'registerModule', moduleFunc.workerModuleData);
      var unregister = function () {
        registrationPromise = null;
        registeredModules[workerId].delete(unregister);
      }
      ;(registeredModules[workerId] || (registeredModules[workerId] = new Set())).add(unregister);
    }

    // Invoke the module, returning a promise
    return registrationPromise.then(function (ref) {
      var isCallable = ref.isCallable;

      if (isCallable) {
        return callWorker(workerId,'callModule', {id: id, args: args})
      } else {
        throw new Error('Worker module function was called but `init` did not return a callable function')
      }
    })
  }
  moduleFunc.workerModuleData = {
    isWorkerModule: true,
    id: id,
    name: name,
    dependencies: dependencies,
    init: stringifyFunction(init),
    getTransferables: getTransferables && stringifyFunction(getTransferables)
  };

  moduleFunc.onMainThread = onMainThread;

  return moduleFunc
}

/**
 * Terminate an active Worker by a workerId that was passed to defineWorkerModule.
 * This only terminates the Worker itself; the worker module will remain available
 * and if you call it again its Worker will be respawned.
 * @param {string} workerId
 */
function terminateWorker(workerId) {
  // Unregister all modules that were registered in that worker
  if (registeredModules[workerId]) {
    registeredModules[workerId].forEach(function (unregister) {
      unregister();
    });
  }
  // Terminate the Worker object
  if (workers[workerId]) {
    workers[workerId].terminate();
    delete workers[workerId];
  }
}

/**
 * Stringifies a function into a form that can be deserialized in the worker
 * @param fn
 */
function stringifyFunction(fn) {
  var str = fn.toString();
  // If it was defined in object method/property format, it needs to be modified
  if (!/^function/.test(str) && /^\w+\s*\(/.test(str)) {
    str = 'function ' + str;
  }
  return str
}


function getWorker(workerId) {
  var worker = workers[workerId];
  if (!worker) {
    // Bootstrap the worker's content
    var bootstrap = stringifyFunction(workerBootstrap);

    // Create the worker from the bootstrap function content
    worker = workers[workerId] = new Worker(
      URL.createObjectURL(
        new Blob(
          [("/** Worker Module Bootstrap: " + (workerId.replace(/\*/g, '')) + " **/\n\n;(" + bootstrap + ")()")],
          {type: 'application/javascript'}
        )
      )
    );

    // Single handler for response messages from the worker
    worker.onmessage = function (e) {
      var response = e.data;
      var msgId = response.messageId;
      var callback = openRequests[msgId];
      if (!callback) {
        throw new Error('WorkerModule response with empty or unknown messageId')
      }
      delete openRequests[msgId];
      callback(response);
    };
  }
  return worker
}

// Issue a call to the worker with a callback to handle the response
function callWorker(workerId, action, data) {
  return new Promise(function (resolve, reject) {
    var messageId = ++_messageId;
    openRequests[messageId] = function (response) {
      if (response.success) {
        resolve(response.result);
      } else {
        reject(new Error(("Error in worker " + action + " call: " + (response.error))));
      }
    };
    getWorker(workerId).postMessage({
      messageId: messageId,
      action: action,
      data: data
    });
  })
}

export { defineWorkerModule, stringifyFunction, terminateWorker };
