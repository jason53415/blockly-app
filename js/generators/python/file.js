'use strict';

goog.provide('Blockly.Python.file');

goog.require('Blockly.Python');

Blockly.Python['file_save'] = function(block) {
  // Save an object as a file.
  Blockly.Python.definitions_['import_pickle'] = 'import pickle';
  Blockly.Python.definitions_['import_os'] = 'import os';
  var obj = Blockly.Python.valueToCode(block, 'OBJECT',
      Blockly.Python.ORDER_NONE) || 'None';
  var name = block.getFieldValue('FILENAME') + '.pickle';
  var code = "with open(os.path.join(os.path.dirname(__file__), '" + name + "'), 'wb') as f:\n" + 
      Blockly.Python.prefixLines("pickle.dump(" + obj + ", f)\n", Blockly.Python.INDENT);
  return code;
};

Blockly.Python['file_load'] = function(block) {
  // Save an object as a file.
  Blockly.Python.definitions_['import_pickle'] = 'import pickle';
  Blockly.Python.definitions_['import_os'] = 'import os';
  var obj = Blockly.Python.valueToCode(block, 'OBJECT',
      Blockly.Python.ORDER_NONE) || '_';
  var name = block.getFieldValue('FILENAME') + '.pickle';
  var code = "with open(os.path.join(os.path.dirname(__file__), '" + name + "'), 'rb') as f:\n" + 
      Blockly.Python.prefixLines(obj + " = pickle.load(f)\n", Blockly.Python.INDENT);
  return code;
};
