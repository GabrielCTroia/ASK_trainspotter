'us strict';

require('dotenv').load();

const AlexaSkill = require('./AlexaSkill');
const mta = require('./MTA');

const ALEXA_APP_ID = process.ALEXA_APP_ID;

Promise
  .resolve(mta.getStatusForStation('grands'))
  .then(lines => {
    lines.forEach(l => {
      console.log('');
      console.log('------ Line:', l.name[0], '-----');
      console.log('date', l.Date[0], l.Time[0]);
      console.log('status', l.status);
      console.log('info', l.text);
      console.log('');
      console.log('');
    });

    console.log('summary:');

    console.log('lines #', lines.length);
  });

