'use strict';

goog.provide('Blockly.Python.file');

goog.require('Blockly.Python');

Blockly.Python['file_save'] = function(block) {
  // Save an object as a file.
  Blockly.Python.definitions_['import_pickle'] = 'import pickle';
  var obj = Blockly.Python.valueToCode(block, 'OBJECT',
      Blockly.Python.ORDER_NONE) || 'None';
  var name = block.getFieldValue('FILENAME') + '.pickle';
  var code = "with open('" + name + "', 'rb') as f:\n" + 
      Blockly.Python.prefixLines("pickle.dump(" + obj + ", f)\n", Blockly.Python.INDENT);
  return code;
};
