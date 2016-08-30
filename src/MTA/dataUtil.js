'use strict';

const R = require('ramda');
const util = require('./util');
const stations = require('./stations').stations;
const trains = require('./trains').trains;

// Since stations can have multiple names
// a hash is not really the best choice here.
// For ex: steinway is not the same as steinway street, although it should best
// I think a better choice would be an AVR tree ot trie tree (the one perfect for words)
const stationsHash = R.reduce((r, s) => {
  r[String(s).toLowerCase()] = true;
  return r;
}, {}, stations);

const trainsHash = R.reduce((r, s) => {
  r[String(s).toLowerCase()] = true;
  return r;
}, {}, trains);

const prepareLine = line => {
  const nextText = util.htmlToText(line.text);

  return R.merge(line, { text: nextText });
}

const getAllSubwayLines = (service) => {
  return R.reduce((r, subway) => {
    const nextLines = R.map(prepareLine, subway.line);

    return r.concat(nextLines);
  }, [], service.subway)
}

const isValidStation = s => !!stationsHash[String(s).toLowerCase()];

const isValidTrain = t => !!trainsHash[String(t).toLowerCase()];

// These methods wotk on Line models

const onTime = line => line.status.indexOf('GOOD SERVICE') > -1;
const delayed = R.complement(onTime);

const isUsedByTrain = (train, line) => {
  const trainName = String(train).toUpperCase();

  return line.name[0].indexOf(trainName) > -1;
}

const hasTrain =
  (train, line) => String(line.name[0]).toLowerCase().indexOf(train) > -1;

const findByTrain = R.curry(
  (train, lines) => R.filter(l => hasTrain(train, l), lines)
);

const hasInformationOfStation = (station, line) => {
  const stationName = String(station).toLowerCase();
  const source = String(line.text).toLowerCase();

  return source.indexOf(stationName) > -1;
}

const findByStation = R.curry(
  (station, lines) => R.filter(l => hasInformationOfStation(station, l), lines)
)

module.exports = {
  getAllSubwayLines,
  isValidStation,
  isValidTrain,
  lines: {
    delayed,
    onTime,
    findByTrain,
    findByStation
  }
} 