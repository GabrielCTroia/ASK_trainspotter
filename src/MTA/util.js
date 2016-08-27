'us strict';

const R = require('ramda');
const http = require('http');
const xml2js = require('xml2js');
const Promise = require('bluebird');
const fs = require('fs');
const htmlParser = require('html-to-text');
const trimNewLines = require('trim-newlines'); 

const getDataFromURL = url => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      var body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => resolve(body));
    })
      .on('error', reject);
  });
};

const getDataFromFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(content);
    });
  });
}

const parseXML = data => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (e, result) => {
          if (e) {
            reject(e);
            return;
          }

          resolve(result);
        });
  });
}


const htmlToText = R.pipe(
  htmlParser.fromString
  // data => data.replace(/(\r\n|\n|\r)/gm,'') // trim \n\r
);

module.exports = {
  getDataFromFile,
  getDataFromURL,
  parseXML,
  htmlToText,
}
