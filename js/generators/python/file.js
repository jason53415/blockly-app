'use strict';

goog.provide('Blockly.Python.file');

goog.require('Blockly.Python');

Blockly.Python['file_save'] = function(block) {
  // Save an object as a pickle file.
  Blockly.Python.definitions_['import_pickle'] = 'import pickle';
  Blockly.Python.definitions_['import_os'] = 'import os';
  var obj = Blockly.Python.valueToCode(block, 'OBJECT',
      Blockly.Python.ORDER_NONE) || 'None';
  var name = Blockly.Python.valueToCode(block, 'FILENAME',
      Blockly.Python.ORDER_NONE) || ("'save_" + new Date().getTime() + "'");
  var code = "with open(os.path.join(os.path.dirname(__file__), " + name + " + '.pickle'), 'wb') as f:\n" + 
      Blockly.Python.prefixLines("pickle.dump(" + obj + ", f)\n", Blockly.Python.INDENT);
  return code;
};

Blockly.Python['file_load'] = function(block) {
  // Load an object from a pickle file.
  Blockly.Python.definitions_['import_pickle'] = 'import pickle';
  Blockly.Python.definitions_['import_os'] = 'import os';
  var obj = Blockly.Python.valueToCode(block, 'OBJECT',
      Blockly.Python.ORDER_NONE) || '_';
  var name = Blockly.Python.valueToCode(block, 'FILENAME',
      Blockly.Python.ORDER_NONE) || "''";
  var code = "with open(os.path.join(os.path.dirname(__file__), " + name + " + '.pickle'), 'rb') as f:\n" + 
      Blockly.Python.prefixLines(obj + " = pickle.load(f)\n", Blockly.Python.INDENT);
  return code;
};

Blockly.Python['file_csv_save'] = function(block) {
    // Save an object as a csv file.
    Blockly.Python.definitions_['import_csv'] = 'import csv';
    Blockly.Python.definitions_['import_os'] = 'import os';
    var obj = Blockly.Python.valueToCode(block, 'OBJECT',
        Blockly.Python.ORDER_NONE) || 'None';
    var name = Blockly.Python.valueToCode(block, 'FILENAME',
        Blockly.Python.ORDER_NONE) || ("'save_" + new Date().getTime() + "'");
    var delimiter = block.getFieldValue('DELIMITER');
    var code = "with open(os.path.join(os.path.dirname(__file__), " + name + " + '.csv'), 'w', newline='') as f:\n" + 
        Blockly.Python.prefixLines("csv.writer(f, delimiter='" + delimiter + "').writerows(" + obj + ")\n", Blockly.Python.INDENT);
    return code;
  };
  
  Blockly.Python['file_csv_load'] = function(block) {
    // Load an object from a csv file.
    Blockly.Python.definitions_['import_csv'] = 'import csv';
    Blockly.Python.definitions_['import_os'] = 'import os';
    var obj = Blockly.Python.valueToCode(block, 'OBJECT',
        Blockly.Python.ORDER_NONE) || '_';
    var name = Blockly.Python.valueToCode(block, 'FILENAME',
        Blockly.Python.ORDER_NONE) || "''";
    var delimiter = block.getFieldValue('DELIMITER');
    var code = "with open(os.path.join(os.path.dirname(__file__), " + name + " + '.csv'), 'r', newline='') as f:\n" + 
        Blockly.Python.prefixLines(obj + " = [row for row in csv.reader(f, delimiter='" + delimiter + "')]\n", Blockly.Python.INDENT);
    return code;
  };
