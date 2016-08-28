'us strict';

const util = require('./util');
const dataUtil = require('./dataUtil');

const getData = () => {
  // return util.getDataFromFile('./data/output_sample.xml');

  return util.getDataFromURL('http://web.mta.info/status/serviceStatus.txt');
}

const getAllLines = () => getData()
    .then(util.parseXML)
    .then(r => r.service)
    .then(dataUtil.getAllSubwayLines);


const getStatusForStation = station => Promise
    .resolve(getAllLines())
    .then(dataUtil.lines.findByStation(station));

const getStatusForTrain = train => Promise
  .resolve(getAllLines())
  .then(dataUtil.lines.findByTrain(train));

module.exports = {
  getStatusForStation,
  getStatusForTrain,
  isValidStation: dataUtil.isValidStation,
}
