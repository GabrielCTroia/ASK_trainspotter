'us strict';

const R = require('ramda');
const util = require('./util');
const dataUtil = require('./dataUtil');

const getData = () => {
  // return util.getDataFromFile('./data/output_sample.xml');

  return util.getDataFromURL('http://web.mta.info/status/serviceStatus.txt');
}

const getAllLines = () => Promise
  .resolve(getData())
  .then(util.parseXML)
  .then(r => r.service)
  .then(dataUtil.getAllSubwayLines)
  .then(R.reject(l => l.name[0] === 'SIR')) // reject Staten Island for now!


const getStatusForStation = station => Promise
  .resolve(getAllLines())
  .then(dataUtil.lines.findByStation(station));

const getStatusForTrain = train => Promise
  .resolve(getAllLines())
  .then((lines) => {
    console.log('all lines', lines);
    return lines;
  })
  .then(dataUtil.lines.findByTrain(train));

module.exports = {
  getStatusForStation,
  getStatusForTrain,
  isValidStation: dataUtil.isValidStation,
  isValidTrain: dataUtil.isValidTrain,
}
