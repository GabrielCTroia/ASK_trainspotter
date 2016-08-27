'use strict';

const R = require('ramda');
const util = require('./util');

const prepareLine = line => {
  const nextText = util.htmlToText(line.text); 

  return R.merge(line, {text: nextText});
}

const getAllSubwayLines = (service) => {
  return R.reduce((r, subway) => {
    const nextLines = R.map(prepareLine, subway.line);

    return r.concat(nextLines);
  }, [], service.subway)
}

// These methods wotk on Line models

const onTime = line => line.status.indexOf('GOOD SERVICE') > -1;
const delayed = R.complement(onTime);

const isUsedByTrain = (train, line) => {
  const trainName = String(train).toUpperCase();

  return line.name[0].indexOf(trainName) > -1;
}

const findByTrain = R.curry(
  (train, lines) => R.filter(line => isLineFor(train, line), lines)
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
  lines: {
    delayed,
    onTime,
    findByTrain,
    findByStation
  }
} 