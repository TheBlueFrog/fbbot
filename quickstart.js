'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
// const Wit = require('node-wit').Wit;
const Wit = require('../node-wit').Wit;

const DB = require('./test1.js')

const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/weather.js <wit-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say: (sessionId, msg, cb) => {
    console.log(msg);
    cb();
  },
  merge: (context, entities, cb) => {
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc;
    }
    const what = firstEntityValue(entities, 'what');
    if (what) {
      context.what = what;
    }

    cb(context);
  },
  error: (sessionId, msg) => {
    console.log('Oops, I don\'t know what to do.');
  },

  'fetch-weather': (context, cb) => {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    if(context.loc === 'Portland') {
       context.forecast = 'rainy';
    }
    else {
       context.forecast = 'sunny';
    }
    cb(context);
  },

  'find-consumer': (context, cb) => {
      DB.findConsumers (context.what, function(consumers) {
        context.consumer = consumers;
        if (consumers.length < 1 ) {
            consumers = "(none)"
        }
        console.log("find-consumer returns " + consumers);
        cb(context);
      });
  },

  'find-supplier': (context, cb) => {
      DB.findSuppliers (context.what, function(suppliers) {
        if (suppliers.length < 1 ) {
            suppliers = "(none)"
        }
        context.supplier = suppliers;
        console.log("find-supplier returns " + suppliers);
        cb(context);
      });
  },
};

const client = new Wit(token, actions);
client.interactive();
