"use strict";

require('dotenv').load();

const MTAStatus = require('./src/MTAStatus');

exports.handler = (event, context) => {
    const skill = new MTAStatus(process.env.ALEXA_APP_ID);
    // TODO implement
    skill.execute(event, context);
};