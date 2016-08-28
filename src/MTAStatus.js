'use strict';

const AlexaSkill = require('./AlexaSkill');
const mta = require('./MTA');

class MTAStatus extends AlexaSkill {
  constructor(ALEXA_APP_ID) {
    super(ALEXA_APP_ID);

    this.intentHandlers = {
      GetStatusIntent(intent, session, response) {
        const requestedStation = intent.slots.station.value;

        Promise
          .resolve(mta.getStatusForStation(requestedStation))
          // .then(lines => {
          //   lines.forEach(l => {
          //     console.log('');
          //     console.log('------ Line:', l.name[0], '-----');
          //     console.log('date', l.Date[0], l.Time[0]);
          //     console.log('status', l.status);
          //     console.log('info', l.text);
          //     console.log('');
          //     console.log('');
          //   });

          //   console.log('summary:');

          //   console.log('lines #', lines.length);
          // });
          .then((lines) => lines[0])
          .then((line) => {
            const heading = 'Status for ' + requestedStation + ' station'; 
            
            if (line) {
              const message = 'The status for '
                   + requestedStation 
                   + ' station is ' 
                   + line.status[0];
              const cardText = message;

              response.tellWithCard(message, heading, cardText);
            } else {
              const message = 'The station ' + requestedStation + ' was not found!';
              const cardText = message;
               
              response.tellWithCard(message, heading, cardText);
            }
          });
      },

      HelpIntent(intent, session, response) {
        var speechOutput = 'Get the status for any MTA train station. ' +
          'Which bus stop would you like?';
        response.ask(speechOutput);
      }
    }
  }

  onLaunch(launchRequest, session, response) {
    var output = 'Welcome to Train Spotter. ' +
      'Say the train station name you want to get the status for!';

    var reprompt = 'Which train stop do you want to find more about?';

    response.ask(output, reprompt);
  }
}

//console.log('s', typeofMTAStatus)

module.exports = MTAStatus;

