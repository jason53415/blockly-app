goog.provide('Blockly.Python.MLGame');

goog.require('Blockly.Python');

Blockly.Python['mlplay_class'] = function(block) {
  // First, add a 'global' statement for every variable that is not shadowed by
  // a local parameter.
  var globals = [];
  var varName;
  var workspace = block.workspace;
  var variables = Blockly.Variables.allUsedVarModels(workspace) || [];
  for (var i = 0, variable; variable = variables[i]; i++) {
    varName = variable.name;
    if (block.getVars().indexOf(varName) == -1) {
      globals.push(Blockly.Python.variableDB_.getName(varName,
          Blockly.VARIABLE_CATEGORY_NAME));
    }
  }
  // Add developer variables.
  var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    globals.push(Blockly.Python.variableDB_.getName(devVarList[i],
        Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  }

  globals = globals.length ?
      Blockly.Python.INDENT + 'global ' + globals.join(', ') + '\n' : '';
  var init = Blockly.Python.statementToCode(block, 'INIT') || Blockly.Python.PASS;
  var init_var = "";
  if ('MLPLAY_INIT_INFO_OPTIONS' in Blockly.Msg) {
    for (var i = 0; i < Blockly.Msg['MLPLAY_INIT_INFO_OPTIONS'].length; i++) {
      init_var += (', ' + Blockly.Msg['MLPLAY_INIT_INFO_OPTIONS'][i][1])
    }
  }
  var update = Blockly.Python.statementToCode(block, 'UPDATE') || Blockly.Python.PASS;
  var reset = Blockly.Python.statementToCode(block, 'RESET') || Blockly.Python.PASS;
  var code = 'class MLPlay:\n' + Blockly.Python.prefixLines(
                                 'def __init__(self' + init_var + '):\n' + globals + init + 
                                 'def update(self, scene_info):\n' + globals + update +
                                 'def reset(self):\n' + globals + reset, Blockly.Python.INDENT);
  return code;
};

Blockly.Python['mlplay_init_info'] = function(block) {
  var code = block.getFieldValue('FIELD');
  return [code, Blockly.Python.ORDER_STRING_CONVERSION];
};

Blockly.Python['mlplay_player_status'] = function(block) {
  var code = '"' + block.getFieldValue('STATUS') + '"';
  return [code, Blockly.Python.ORDER_STRING_CONVERSION];
};

Blockly.Python['mlplay_game_status'] = function(block) {
  var code = '"' + block.getFieldValue('STATUS') + '"';
  return [code, Blockly.Python.ORDER_STRING_CONVERSION];
};

Blockly.Python['mlplay_get_info'] = function(block) {
  var code = block.getFieldValue('FIELD');
  return [code, Blockly.Python.ORDER_STRING_CONVERSION];
};

Blockly.Python['mlplay_get_constant'] = function(block) {
  var code = block.getFieldValue('CONSTANT').split("/").pop();
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['mlplay_return_action'] = function(block) {
  var action = block.getFieldValue('ACTION');
  if (action[0] == '[' || action[0] == '{') {
    var code = 'return ' + action + '\n';
  } else {
    var code = 'return "' + action + '"\n';
  }
  return code;
};

Blockly.Python['mlplay_return_mazecar_action'] = function(block) {
  var left = Blockly.Python.valueToCode(block, 'LEFT_RPM',
      Blockly.Python.ORDER_NONE) || '0';
  var right = Blockly.Python.valueToCode(block, 'RIGHT_RPM',
      Blockly.Python.ORDER_NONE) || '0';
  var code = "return [{'left_PWM': " + left + ", 'right_PWM': " + right + "}]\n";
  return code;
};

Blockly.Python['mlplay_is_key_pressed'] = function(block) {
  Blockly.Python.definitions_['import_keyboard'] = 'from pynput import keyboard';
  Blockly.Python.definitions_['import_defaultdict'] = 'from collections import defaultdict';
  var on_press_func = Blockly.Python.provideFunction_(
    'on_press',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(key):',
     '  _KEYBOARD_ON_PRESSED[str(key)] = True']
  );
  var on_release_func = Blockly.Python.provideFunction_(
    'on_release',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(key):',
     '  _KEYBOARD_ON_PRESSED[str(key)] = False']
  );
  Blockly.Python.provideFunction_(
    'keyboard_listener',
    ['_KEYBOARD_ON_PRESSED = defaultdict(bool)',
     'listener = keyboard.Listener(',
     '  on_press=' + on_press_func + ',',
     '  on_release=' + on_release_func + ')',
     'listener.start()']);
  var type = block.getFieldValue('TYPE');
  var key = block.getFieldValue('KEY');
  if (type == 'arrow') {
    var code = '_KEYBOARD_ON_PRESSED["Key.' + key + '"]';
  } else if (type == 'alpha') {
    var code = '(_KEYBOARD_ON_PRESSED["\'' + key + '\'"] or ' +
               '_KEYBOARD_ON_PRESSED["\'' + key.toLowerCase() + '\'"])';
  } else {
    var code = '_KEYBOARD_ON_PRESSED["\'' + key + '\'"]';
  }
  return [code, Blockly.Python.ORDER_RELATIONAL];
};
