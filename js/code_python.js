/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Get the name of the game.
 */
Code.GAME = (new URLSearchParams(window.location.search)).get('game');

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'en': 'English',
  'zh-hant': '正體中文'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if parameter not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to Chinese.
    lang = 'zh-hant';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function(lang) {
  // Store the blocks for the duration of the reload.
  // MSIE 11 does not support sessionStorage on file:// URLs.

  var newLang = lang
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
// Code.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'xml'];
Code.TABS_ = ['python'];

/**
 * List of tab names with casing, for display in the UI.
 * @private
 */
Code.TABS_DISPLAY_ = [
  'Python'
];

Code.selected = 'python';

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  // Load dialog body for selecting game arguments.
  var html_path = path.join(__dirname, 'html', Code.GAME.toLowerCase() + '.html');
  var html_text = window.readFile(html_path);
  $('#game-args').append(html_text);
  $(".modal-header").on("mousedown", function(mousedownEvt) {
    var $draggable = $(this);
    var x = mousedownEvt.pageX - $draggable.offset().left,
        y = mousedownEvt.pageY - $draggable.offset().top;
    $("body").on("mousemove.draggable", function(mousemoveEvt) {
        $draggable.closest(".modal-dialog").offset({
            "left": mousemoveEvt.pageX - x,
            "top": mousemoveEvt.pageY - y
        });
    });
    $("body").one("mouseup", function() {
        $("body").off("mousemove.draggable");
    });
    $draggable.closest(".modal").one("bs.modal.hide", function() {
        $("body").off("mousemove.draggable");
    });
  });

  Code.initLanguage();

  Code.editor = CodeMirror.fromTextArea(document.getElementById('content_python'), {
    mode: "python",
    lineNumbers: true,
    smartIndent: true,
    indentUnit: 4,
    indentWithTabs: false,
    lineWrapping: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"], 
    foldGutter: true,
    autofocus: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true
  });

  Code.editor.setOption("extraKeys", {
    Tab: function(cm) {
      var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
      cm.replaceSelection(spaces);
    }
  });

  Code.loadExample('1. start');

  var example_dir = path.join(__dirname, 'python', 'examples', Code.GAME.toLowerCase());
  fs.readdirSync(example_dir).forEach(file => {
    if (file.endsWith('.py')) {
      var name = file.slice(0, -3);
      var element = document.createElement('a');
      element.setAttribute('class', 'dropdown-item');
      element.setAttribute('href', '#');
      element.setAttribute('id', name);
      element.textContent = file
      $('#examples').append(element);
      Code.bindClick(name,
          function() {Code.loadExample(name); Code.renderContent();});
    };
  });

  Code.bindClick('show_readme',
      function() {Code.showReadme();});
  Code.bindClick('run_mlgame',
      function() {Code.run('#run-mlgame-dialog');});
  Code.bindClick('run_python',
      function() {Code.execute();});
  Code.bindClick('download_python',
      function() {Code.downloadPython();});
  Code.bindClick('open_path',
      function() {Code.openPath();});
  Code.bindClick('open_python',
      function() {Code.selectFiles();});
  Code.bindClick('en',
      function() {Code.changeLanguage('en');});
  Code.bindClick('zh-hant',
      function() {Code.changeLanguage('zh-hant');});
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // Inject language strings.
  document.title += ' - ' + MSG['title'];
  document.getElementById('game_name').textContent = Code.GAME;
  document.getElementById('tab_lang').textContent = MSG['lang'];
  document.getElementById('tab_option').textContent = MSG['options'];
  document.getElementById('run_mlgame').textContent = MSG['runMLGame'];
  document.getElementById('run_python').textContent = MSG['runPython'];
  document.getElementById('download_python').textContent = MSG['download'];
  document.getElementById('open_python').textContent = MSG['openPython'];
  document.getElementById('en').textContent = MSG['en'];
  document.getElementById('zh-hant').textContent = MSG['zh_hant'];
};

Code.loadExample = function(name) {
  try {
    var python_path = path.join(__dirname, 'python', 'examples', Code.GAME.toLowerCase(), name + '.py');
    var python_text = window.readFile(python_path);
    Code.editor.setValue(python_text);
  } catch (e) {
    console.log(e);
    return;
  }
};

Code.selectFiles = function() {
  var element = document.createElement('input');
  element.setAttribute('type', 'file');
  element.setAttribute('accept', '.py');
  element.style.display = 'none';
  element.addEventListener('change', Code.openPython, false);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

Code.openPython = function(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    Code.editor.setValue(e.target.result);
  }
  reader.readAsText(file);
};

Code.downloadPython = function() {
  var text = Code.editor.getValue();
  var url = document.getElementById('file_name').textContent + '.py';
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', url);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

Code.run = function(target) {
  var element = document.createElement('a');
  element.setAttribute('data-toggle', 'modal');
  element.setAttribute('data-target', target);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

Code.play = function() {
  var python_text = Code.editor.getValue();
  var file_name = 'ml_play_' + new Date().getTime() + '.py';
  var ml_path = path.join(__dirname, 'MLGame', 'games', Code.GAME, 'ml');
  var file_path = path.join(ml_path, file_name);
  window.writeFile(file_path, python_text);
  var fps = document.getElementById('game_fps').value;
  var args_elements = document.getElementById('game-args').getElementsByClassName('game-arg');
  var user_num = 1;
  var args = [];
  for (var i = 0; i < args_elements.length; i++) {
    var e = args_elements[i];
    if (e.id == "user_num") {
      user_num = parseInt(e.value, 10);
    }
    if (e.tagName == "SELECT") {
      args.push(e.options[e.selectedIndex].getAttribute("value"));
    } else {
      args.push(e.value);
    }
  }
  var total_args = [];
  for (var i = 0; i < user_num; i++) {
    total_args = total_args.concat(['-i', file_name])
  }
  total_args = total_args.concat(['-f', fps, Code.GAME]).concat(args);
  var options = {
    mode: 'text',
    pythonPath: path.join(__dirname, 'python', 'dist', 'interpreter', 'interpreter'),
    scriptPath: path.join(__dirname, 'MLGame'),
    args: total_args
  };
  $('#run-mlgame-dialog').modal('hide');
  document.getElementById('content_console').textContent = '> Python program running\n';
  $('#console-dialog').modal('show');
  window.pythonRun(options, "MLGame.py", file_path, ml_path);
};

Code.execute = function() {
  var python_text = Code.editor.getValue();
  var file_name = 'ml_play_' + new Date().getTime() + '.py';
  var ml_path = path.join(__dirname, 'MLGame', 'games', Code.GAME, 'ml');
  var file_path = path.join(ml_path, file_name);
  window.writeFile(file_path, python_text);
  var options = {
    mode: 'text',
    pythonPath: path.join(__dirname, 'python', 'dist', 'interpreter', 'interpreter'),
    scriptPath: ml_path,
    args: []
  };
  $('#run-python-dialog').modal('hide');
  document.getElementById('content_console').textContent = '> Python program running\n';
  $('#console-dialog').modal('show');
  window.pythonRun(options, file_name, file_path, ml_path);
};

Code.showReadme = function() {
  var readme_path = path.join(__dirname, 'MLGame', 'games', Code.GAME, 'README.md');
  var readme_text = window.readFile(readme_path);
  var showdown  = require('showdown'),
      converter = new showdown.Converter(),
      readme    = converter.makeHtml(readme_text);
  $('#readme-body').html(readme);
  $('#readme-dialog').modal('show');
};

Code.openPath = function() {
  window.openPath(path.join(__dirname, 'MLGame', 'games', Code.GAME, 'ml'))
};

// Load the Code demo's language strings.
document.write('<script src="js/ui_msg/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);
