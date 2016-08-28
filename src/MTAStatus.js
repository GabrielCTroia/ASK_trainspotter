'use strict';

const AlexaSkill = require('./AlexaSkill');
const mta = require('./MTA');

class MTAStatus extends AlexaSkill {
  constructor(ALEXA_APP_ID) {
    super(ALEXA_APP_ID);

    this.intentHandlers = {
      GetStatusIntent(intent, session, response) {
        const requestedStation = intent.slots.station.value;

        const heading = 'Status for ' + requestedStation + ' station';

        if (!mta.isValidStation(requestedStation)) {
          const msg = 'The station ' + requestedStation + ' is not a valid station!';
          const cardText = msg;
          
          response.tellWithCard(message, heading, cardText);
          return;
        }

        Promise
          .resolve(mta.getStatusForStation(requestedStation))
          .then((lines) => lines[0])
          .then((line) => {
            if (line) {
              const message = 'The status for '
                   + requestedStation 
                   + ' station is ' 
                   + line.status[0];
              const cardText = message;

              if (line.status[0] !== 'GOOD SERVICE') {
                const connector = 'And here\s why: ' + line.text; 
                response.ask(message + '. ' + connector, heading, cardText);
              } else {
                response.tellWithCard(message, heading, cardText);
              }
            } else {
              const message = 'There are no notifications for ' 
                + requestedStation 
                + '. Teh status should be good service!';
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

