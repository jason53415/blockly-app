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
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function(lang) {
  // Store the blocks for the duration of the reload.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

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
 * Changes the output language by clicking the tab matching
 * the selected language in the codeMenu.
 */
Code.changeCodingLanguage = function() {
  var codeMenu = document.getElementById('code_menu');
  Code.tabClick(codeMenu.options[codeMenu.selectedIndex].value);
}

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
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function() {
  var script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
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
Code.TABS_ = ['blocks', 'python', 'xml'];

/**
 * List of tab names with casing, for display in the UI.
 * @private
 */
Code.TABS_DISPLAY_ = [
  'Blocks', 'Python', 'xml'
];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function(clickedName) {
  // If the XML tab was open, save and render the content.
  if (document.getElementById('tab_xml').classList.contains('tabon')) {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(MSG['badXml'].replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }

  if (document.getElementById('tab_blocks').classList.contains('tabon')) {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    var tab = document.getElementById('tab_' + name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  var selectedTab = document.getElementById('tab_' + clickedName);
  selectedTab.classList.remove('taboff');
  selectedTab.classList.add('tabon');
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
      'visible';
  Code.renderContent();
  // The code menu tab is on if the blocks tab is off.
  var codeMenuTab = document.getElementById('tab_code');
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
    codeMenuTab.className = 'taboff';
  } else {
    codeMenuTab.className = 'tabon';
  }
  // Sync the menu's value with the clicked tab value if needed.
  var codeMenu = document.getElementById('code_menu');
  for (var i = 0; i < codeMenu.options.length; i++) {
    if (codeMenu.options[i].value == clickedName) {
      codeMenu.selectedIndex = i;
      break;
    }
  }
  Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_javascript') {
    Code.attemptCodeGeneration(Blockly.JavaScript);
  } else if (content.id == 'content_python') {
    Code.attemptCodeGeneration(Blockly.Python);
  } else if (content.id == 'content_php') {
    Code.attemptCodeGeneration(Blockly.PHP);
  } else if (content.id == 'content_dart') {
    Code.attemptCodeGeneration(Blockly.Dart);
  } else if (content.id == 'content_lua') {
    Code.attemptCodeGeneration(Blockly.Lua);
  }
  if (typeof PR == 'object') {
    PR.prettyPrint();
  }
};

/**
 * Attempt to generate the code and display it in the UI, pretty printed.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.attemptCodeGeneration = function(generator) {
  var content = document.getElementById('content_' + Code.selected);
  content.textContent = '';
  if (Code.checkAllGeneratorFunctionsDefined(generator)) {
    var code = generator.workspaceToCode(Code.workspace);
    content.textContent = code;
    // Remove the 'prettyprinted' class, so that Prettify will recalculate.
    content.className = content.className.replace('prettyprinted', '');
  }
};

/**
 * Check whether all blocks in use have generator functions.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.checkAllGeneratorFunctionsDefined = function(generator) {
  var blocks = Code.workspace.getAllBlocks(false);
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) == -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var msg = 'The generator code for the following blocks not specified for ' +
        generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
    Blockly.alert(msg);  // Assuming synchronous. No callback.
  }
  return valid;
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  // Load dialog body for selecting game arguments.
  Code.initGameArgs();

  // Make modal draggable.
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

  var rtl = Code.isRtl();
  var container = document.getElementById('tab_content');
  var onresize = function(e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
  };
  window.addEventListener('resize', onresize, false);

  // The toolbox XML specifies each category name using Blockly's messaging
  // format (eg. `<category name="%{BKY_CATLOGIC}">`).
  // These message keys need to be defined in `Blockly.Msg` in order to
  // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
  // been defined for each language to import each category name message
  // into `Blockly.Msg`.
  // TODO: Clean up the message files so this is done explicitly instead of
  // through this for-loop.
  for (var messageKey in MSG) {
    if (messageKey.indexOf('cat') == 0) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }

  // Construct the toolbox XML, replacing translated variable names.
  var xml_path = path.join(__dirname, 'xml', 'blocks', Code.GAME.toLowerCase() + '.xml');
  var xml_text = window.readFile(xml_path);
  $('#MLGame_blocks').append(xml_text);
  var toolboxText = document.getElementById('toolbox').outerHTML;
  toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
      function(m, p1, p2) {return p1 + MSG[p2];});
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);
  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25,
           length: 3,
           colour: '#FFF',
           snap: true},
       media: 'media/',
       rtl: rtl,
       toolbox: toolboxXml,
       zoom:
          {controls: true,
           wheel: true},
       move:
          {wheel: true}
      });
  
  // Overide prompt function because prompt is not implemented in Electron.
  Blockly.prompt = function(message, defaultValue, callback) {
    vex.dialog.prompt({
      message: message,
      placeholder: defaultValue,
      callback: callback
    });
  };

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  // Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');
  Code.loadExample('1. start');
  
  var example_dir = path.join(__dirname, 'xml', 'examples', Code.GAME.toLowerCase());
  fs.readdirSync(example_dir).forEach(file => {
    if (file.endsWith('.xml')) {
      var name = file.slice(0, -4);
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

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  if (Code.GAME == 'easy_game') {
    $('#show_readme').html('教學');
    $('#readme-title').html('Tutorials');
    $('#readme-dialog .modal-content').append('<div class="modal-footer"><button type="button" onclick="Code.prevTutorials();" class="btn btn-outline-secondary mr-auto">&lt; 前一頁</button><button type="button" onclick="Code.nextTutorials();" class="btn btn-outline-secondary">下一頁 &gt;</button></div>')
    Code.tutorialsTotalPage = 0;
    var dir = path.join(__dirname, 'tutorials');
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.md')) {
        Code.tutorialsTotalPage++;
      };
    });
    Code.tutorialsCurPage = 1;
    var readme_path = path.join(__dirname, 'tutorials', String(Code.tutorialsCurPage) + '.md');
    var readme_text = window.readFile(readme_path);
    var showdown  = require('showdown'),
        converter = new showdown.Converter(),
        readme    = converter.makeHtml(readme_text);
    $('#readme-body').html(readme);
    Code.bindClick('show_readme',
      function() {Code.showTutorials(); Code.renderContent();});
  } else {
    Code.bindClick('show_readme',
      function() {Code.showReadme(); Code.renderContent();});
  }
  Code.bindClick('run_mlgame',
      function() {Code.run('#run-mlgame-dialog'); Code.renderContent();});
  Code.bindClick('run_python',
      function() {Code.execute(); Code.renderContent();});
  Code.bindClick('discard',
      function() {Code.discard(); Code.renderContent();});
  Code.bindClick('download_python',
      function() {Code.downloadPython(); Code.renderContent();});
  Code.bindClick('download_xml',
      function() {Code.downloadXml(); Code.renderContent();});
  Code.bindClick('open_path',
      function() {Code.openPath(); Code.renderContent();});
  Code.bindClick('open_xml',
      function() {Code.selectFiles(); Code.renderContent();});
  Code.bindClick('en',
      function() {Code.changeLanguage('en'); Code.renderContent();});
  Code.bindClick('zh-hant',
      function() {Code.changeLanguage('zh-hant'); Code.renderContent();});

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
        function(name_) {return function() {Code.tabClick(name_);};}(name));
  }
  Code.bindClick('tab_code', function(e) {
    if (e.target !== document.getElementById('tab_code')) {
      // Prevent clicks on child codeMenu from triggering a tab click.
      return;
    }
    Code.changeCodingLanguage();
  });

  onresize();
  Blockly.svgResize(Code.workspace);
  onresize();
  Blockly.svgResize(Code.workspace);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Populate the coding language selection menu.
  var codeMenu = document.getElementById('code_menu');
  codeMenu.options.length = 0;
  for (var i = 1; i < Code.TABS_.length; i++) {
    codeMenu.options.add(new Option(Code.TABS_DISPLAY_[i], Code.TABS_[i]));
  }
  codeMenu.addEventListener('change', Code.changeCodingLanguage);

  // Inject language strings.
  document.title += ' - ' + MSG['title'];
  document.getElementById('game_name').textContent = Code.GAME;
  document.getElementById('tab_blocks').textContent = MSG['blocks'];
  document.getElementById('tab_example').textContent = MSG['examples'];
  document.getElementById('tab_lang').textContent = MSG['lang'];
  document.getElementById('tab_option').textContent = MSG['options'];
  document.getElementById('run_mlgame').textContent = MSG['runMLGame'];
  document.getElementById('run_python').textContent = MSG['runPython'];
  document.getElementById('download_python').textContent = MSG['download'];
  document.getElementById('open_xml').textContent = MSG['openXml'];
  document.getElementById('download_xml').textContent = MSG['downloadXml'];
  document.getElementById('discard').textContent = MSG['discard'];
  document.getElementById('en').textContent = MSG['en'];
  document.getElementById('zh-hant').textContent = MSG['zh_hant'];
};

/**
 * Initialize dialog body for selecting game arguments.
 */
Code.initGameArgs = function() {
  var config = JSON.parse(window.readFile(path.join(__dirname, 'MLGame', 'games', Code.GAME, 'game_config.json')));
  var $body = $('<div class="modal-body my-2"></div>')
  $body.append('<div class="form-group"><label for="">每秒顯示張數 (FPS)</label><input type="number" class="form-control", id="game_fps", min="1", max="300", step="1", value="30", data-bind="value:replyNumber"></div>');
  $('#game-args').append($body);
  for (var params of config['game_params']) {
    var $param = $('<div class="form-group"></div>');
    $param.append('<label for="">' + params["verbose"] + '</label>');
    if (params["type"] == "int") {
      if ("choices" in params) {
        $choices = $('<select class="form-control game-arg", id="' + params["name"] + '"></select>');
        for (var value of params['choices']) {
          if (params["default"] == value) {
            $choices.append('<option selected value="' + value + '">' + value + '</option>');
          } else {
            $choices.append('<option value="' + value + '">' + value + '</option>');
          }
        };
        $param.append($choices);
      } else {
        var step = 1;
        if ("step" in params) {
          step = params["step"];
        }
        $param.append('<input type="number" class="form-control game-arg", id="' + params["name"] + '", min="' + params["min"] + '", max="' + params["max"] + '", step="' + step + '", value="' + params["default"] + '", data-bind="value:replyNumber">');
      }
    } else if (params["type"] == "str") {
      var $choices = $('<select class="form-control game-arg", id="' + params["name"] + '"></select>');
      for (var choice of params['choices']) {
        if (typeof(choice) === "object") {
          if (params["default"] == choice["value"]) {
            $choices.append('<option selected value="' + choice["value"] + '">' + choice["verbose"] + '</option>');
          } else {
            $choices.append('<option value="' + choice["value"] + '">' + choice["verbose"] + '</option>');
          }
        } else {
          if (params["default"] == choice) {
            $choices.append('<option selected value="' + choice + '">' + choice + '</option>');
          } else {
            $choices.append('<option value="' + choice + '">' + choice + '</option>');
          }
        }
      }
      $param.append($choices);
    }
    $body.append($param);
  };
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks(false).length;
  if (count < 2 ||
      window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

Code.loadExample = function(name) {
  var count = Code.workspace.getAllBlocks(false).length;
  if (count == 0 || window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
    var xml_path = path.join(__dirname, 'xml', 'examples', Code.GAME.toLowerCase(), name + '.xml');
    try {
      var xml_text = window.readFile(xml_path);
    } catch (e) {
      var xml_text = '';
    }
    Code.loadBlocks(xml_text);
  }
};

Code.selectFiles = function() {
  var element = document.createElement('input');
  element.setAttribute('type', 'file');
  element.setAttribute('accept', '.xml');
  element.style.display = 'none';
  element.addEventListener('change', Code.openXml, false);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

Code.openXml = function(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var count = Code.workspace.getAllBlocks(false).length;
  if (count == 0 || window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var xml = e.target.result;
    Code.loadBlocks(xml);
  }
  reader.readAsText(file);
};

Code.downloadPython = function() {
  var text = Blockly.Python.workspaceToCode(Code.workspace);
  var url = document.getElementById('file_name').textContent + '.py';
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', url);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

Code.downloadXml = function() {
  var xml = Blockly.Xml.workspaceToDom(Code.workspace);
  var text = Blockly.Xml.domToPrettyText(xml);
  var url = document.getElementById('file_name').textContent + '.xml';
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
  var python_text = Blockly.Python.workspaceToCode(Code.workspace);
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
  var python_text = Blockly.Python.workspaceToCode(Code.workspace);
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

Code.showTutorials = function() {
  $('#readme-dialog').modal('show');
};

Code.nextTutorials = function() {
  if (Code.tutorialsCurPage != Code.tutorialsTotalPage) {
    Code.tutorialsCurPage += 1;
  }
  var readme_path = path.join(__dirname, 'tutorials', String(Code.tutorialsCurPage) + '.md');
  var readme_text = window.readFile(readme_path);
  var showdown  = require('showdown'),
      converter = new showdown.Converter(),
      readme    = converter.makeHtml(readme_text);
  $('#readme-body').html(readme);
};

Code.prevTutorials = function() {
  if (Code.tutorialsCurPage != 1) {
    Code.tutorialsCurPage -= 1;
  }
  var readme_path = path.join(__dirname, 'tutorials', String(Code.tutorialsCurPage) + '.md');
  var readme_text = window.readFile(readme_path);
  var showdown  = require('showdown'),
      converter = new showdown.Converter(),
      readme    = converter.makeHtml(readme_text);
  $('#readme-body').html(readme);
};

Code.openPath = function() {
  window.openPath(path.join(__dirname, 'MLGame', 'games', Code.GAME, 'ml'))
};

// Load the Code demo's language strings.
document.write('<script src="js/ui_msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="node_modules/@paia-arena/blockly/msg/' + Code.LANG + '.js"></script>\n');
// Load game messages.
document.write('<script src="node_modules/@paia-arena/blockly/msg/mlgame/' + Code.GAME.toLowerCase() + '.js"></script>\n');

window.addEventListener('load', Code.init);
