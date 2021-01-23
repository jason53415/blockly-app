'use strict';

goog.provide('Blockly.Python.dicts');

goog.require('Blockly.Python');

Blockly.Python['dicts_get_keys'] = function(block) {
  // Get dict keys.
  var list = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_NONE) || '{}';
  return [list + '.keys()', Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dicts_create_with'] = function(block) {
  if (block.itemCount_ == 0) {
    return ['{}', Blockly.Python.ORDER_ATOMIC];
  }
  
  var code = new Array(block.itemCount_);
  
  for (var n = 0; n < block.itemCount_; n++) {
    var key = Blockly.Python.valueToCode(block, 'KEY' + n,
    Blockly.Python.ORDER_NONE) || 'None';
    var value = Blockly.Python.valueToCode(block, 'VALUE' + n,
    Blockly.Python.ORDER_NONE) || 'None';
    code[n] = key +": "+ value;
  }
  code = '{\n' + Blockly.Python.INDENT + code.join(',\n' + Blockly.Python.INDENT) + '\n}';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['dicts_get_value'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '{}';
  var key = Blockly.Python.valueToCode(block, 'KEY',
      Blockly.Python.ORDER_NONE) || 'None';
  var code = dict + '[' + key + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['dicts_set_value'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '{}';
  var key = Blockly.Python.valueToCode(block, 'KEY',
      Blockly.Python.ORDER_NONE) || 'None';
  var value = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_NONE) || 'None';
  var code = dict + '[' + key + '] = ' + value + '\n';
  return code;
};
