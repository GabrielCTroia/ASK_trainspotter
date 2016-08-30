'use strict';

const AlexaSkill = require('./AlexaSkill');
const mta = require('./MTA');

var count = 0; 

class MTAStatus extends AlexaSkill {

  constructor(ALEXA_APP_ID) {
    super(ALEXA_APP_ID);

    console.log('constructing', ++count);

    const askYesNoQuestion = (response, session, currentIntent, question, reprompt) => {
      session.attributes.nextPrompt = currentIntent;
      response.ask(question, reprompt);
    }

    this.intentHandlers = {
      GetYesNoIntent(intent, session, response) {
        console.log('session: get yes no intent', session);

        if (session.new === true || !session.attributes.nextPrompt) {
          response.tell('Oops! Something didn\'t go as planned!');
          return;
        }

        const answer = String(intent.slots.yesNoQuestion.value).toLowerCase();

        if (answer === 'yes') {
          response.tellWithCard(
            session.attributes.nextPrompt.message,
            session.attributes.nextPrompt.heading
          )
        } else {
          response.tell('Ok! Have the most wonderful day!');
        }
        // nextScheduledPrompt = null;
      },

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
                const nextPrompt = {
                  heading,
                  cardText,
                  message: line.text,
                }

                askYesNoQuestion(
                  response,
                  session,
                  nextPrompt, 
                  message + '. Would you like to hear why?', 
                  'Would you like to hear why the status for ' + requestedStation + ' station is ' + line.status[0]
                  );
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
        console.log('session: get train status', session);

        const requestedTrain = intent.slots.train.value;
        const trainLetter = intent.slots.train.value + '.';

        const heading = 'Status for '
          + trainLetter
          + ' train';

        if (!mta.isValidTrain(requestedTrain)) {
          const message = 'I\'m sorry. The '
            + trainLetter
            + '. train is not a valid train!';
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
                + trainLetter
                + ' train is '
                + line.status[0];
              const cardText = message;

              if (line.status[0] !== 'GOOD SERVICE') {
                const nextPrompt = {
                  heading,
                  cardText,
                  message: line.text,
                }

                askYesNoQuestion(
                  response, 
                  session,
                  nextPrompt, 
                  message + '. Would you like to hear why?', 
                  'Would you like to hear why the train status for ' + trainLetter + ' is ' + line.status[0]
                  );
              } else {
                response.tellWithCard(message, heading, cardText);
              }
            } else {
              const message = 'There are no notifications for '
                + trainLetter
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
