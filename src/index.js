'us strict';

const R = require('ramda');

const util = require('./util');
const dataUtil = require('./dataUtil');
const AlexaSkill = require('./AlexaSkill');

const ALEXA_APP_ID = 'amzn1.ask.skill.5dd35a53-9e0b-4186-ba24-32daf27b857f';
const MTA_KEY = 'a4a2ec544d16a58b4e277bee25f23562';

const getData = () => {
  // return util.getDataFromFile('../output.xml');

  return util.getDataFromURL('http://web.mta.info/status/serviceStatus.txt');
}



getData()
  .then(util.parseXML)
  .then(r => r.service)
  .then(dataUtil.getAllSubwayLines)
  // .then(dataUtil.lines.findByStation('metropolitan'))
  // .then(R.filter(dataUtil.lines.onTime))
  .then(lines => {
    // console.log('lines', lines)

    lines.forEach(l => {
      console.log('');
      console.log('------ Line:', l.name[0], '-----');
      console.log('date', l.date);
      console.log('status', l.status);
      console.log('info', l.text);
      console.log('');
      console.log('');
    });

    console.log('summary:');

    console.log('lines #', lines.length)
  });