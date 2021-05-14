// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { dialog, shell } = require('electron').remote;
const { PythonShell } = require('python-shell');
const buffer = require('buffer');
const Store = require('electron-store');
const store = new Store();
const path = require('path');
const fs = require('fs');

window.pythonRun = function(options, script, tmp_file, cwd) {
  var old_cwd = process.cwd();
  process.chdir(cwd);
  let python = new PythonShell(script, options);
  python.on('message', function (message) {
    document.getElementById('content_console').textContent += message + '\n';
    var e = document.getElementById('console-body');
    e.scrollTo(0, e.scrollHeight);
  });
  python.on('stderr', function (stderr) {
    document.getElementById('content_console').textContent += stderr + '\n';
    var e = document.getElementById('console-body');
    e.scrollTo(0, e.scrollHeight);
  });
  python.on('close', function () {
    document.getElementById('content_console').textContent += '> Python program finished\n';
    var e = document.getElementById('console-body');
    e.scrollTo(0, e.scrollHeight);
    fs.unlinkSync(tmp_file);
    process.chdir(old_cwd);
  });
  python.on('error', function () {
    window.alert('Error: process exited with code ' + python.exitCode);
  });
};

window.writeFile = function(file, data) {
  fs.writeFileSync(file, data, (err) => {
    if (err) window.alert(err);
    console.log('The file has been saved at ' + file);
  });
};

window.readFile = function(file) {
  return fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) window.alert(err);
    return data;
  });
};

window.selectPath = function(options) {
  return dialog.showOpenDialogSync(options);
};

window.openPath = function(pathname) {
  shell.openPath(pathname);
};
