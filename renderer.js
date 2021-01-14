// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { dialog } = require('electron').remote;
const { PythonShell } = require('python-shell');
const Store = require('electron-store');
const store = new Store();
const path = require('path');
const fs = require('fs');

window.pythonRun = function(options) {
  PythonShell.run('MLGame.py', options, function (err, results) {
    if (err) {
      window.alert(err);
      var found = results.findIndex(element => element.indexOf('Error') >= 0);
      window.alert(results.slice(found).join('\n'));
      throw err;
    }
    // results is an array consisting of messages collected during execution
    console.log('results: ', results);
  });
};

window.wirteFile = function(file, data) {
  fs.writeFileSync(file, data, (err) => {
    if (err) throw err;
    console.log('The file has been saved at ' + file);
  });
};

window.readFile = function(file) {
  return fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  });
};

window.selectPath = function(options) {
  return dialog.showOpenDialogSync(options);
};