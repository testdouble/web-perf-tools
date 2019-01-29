const Promise = require('bluebird');
const urls = require('./urls.js');
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.report)
    });
  });
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
  onlyCategories: ['performance'],
  output: 'html',
  emulatedFormFactor: 'none',
  throttlingMethod: 'provided'
};

const folderName = new Date().toLocaleDateString('en-us').replace(/\//g, '-');

console.log(`Creating folder for report ${folderName} ...`);
fs.mkdirSync(`reports/${folderName}`);

Promise.resolve(urls).mapSeries(url => {
  return launchChromeAndRunLighthouse(`${url.protocol || 'http'}://${url.url}`, opts).then(results => {
    console.log(`Generating report for ${url.title}`);
    fs.writeFileSync(`${process.cwd()}/reports/${folderName}/${url.title}.html`, results);
  });
})
