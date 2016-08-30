'use strict';

const AlexaSkill = require('./AlexaSkill');
const mta = require('./MTA');

class MTAStatus extends AlexaSkill {
  constructor(ALEXA_APP_ID) {
    super(ALEXA_APP_ID);

    this.intentHandlers = {
      GetStationStatusIntent(intent, session, response) {
        const requestedStation = intent.slots.station.value;

        const heading = 'Status for ' + requestedStation + ' station';

        if (!mta.isValidStation(requestedStation)) {
          const message = 'The station ' + requestedStation + ' is not a valid station!';
          const cardText = message;

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
                + '. The status should be good service!';
              const cardText = message;

              response.tellWithCard(message, heading, cardText);
            }
          });
      },

      GetTrainStatusIntent(intent, session, response) {
        const requestedTrain = intent.slots.train.value;

        const heading = 'Status for ' + requestedTrain + ' train';

        if (!mta.isValidTrain(requestedTrain)) {
          const message = 'I\'m sorry. The ' + requestedTrain + ' train is not a valid train!';
          const cardText = message;

          response.tellWithCard(message, heading, cardText);
          return;
        }

        Promise
          .resolve(mta.getStatusForTrain(requestedTrain))
          .then((lines) => lines[0])
          .then((line) => {
            if (line) {
              const message = 'The status for '
                + requestedTrain
                + ' train is '
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
                + requestedTrain
                + '. The status should be good service!';
              const cardText = message;

              response.tellWithCard(message, heading, cardText);
            }
          });
      },

      HelpIntent(intent, session, response) {
        var speechOutput = 'Get the status for any MTA train station. ' +
          'Which train stop would you like?';
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

module.exports = MTAStatus;
