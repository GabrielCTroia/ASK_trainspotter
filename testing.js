"use strict"

const mta = require('./src/MTA');

mta.getStatusForTrain('9')
  .then((info) => {
    console.log('info', info);
  })
  .catch((e) => {
    console.error('error', e);
  })