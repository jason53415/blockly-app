'use strict';

goog.provide('Blockly.Python.model');

goog.require('Blockly.Python');

Blockly.Python['model_create_classification'] = function(block) {
  // Create a classification model.
  var model = block.getFieldValue('MODEL');
  switch(model) {
    case 'KNeighborsClassifier':
      Blockly.Python.definitions_['import_neighbors'] = 'from sklearn import neighbors';
      var k = block.getFieldValue('PARAM_K');
      var code = "neighbors.KNeighborsClassifier(" + k + ")"
      break
    case 'DecisionTreeClassifier':
      Blockly.Python.definitions_['import_tree'] = 'from sklearn import tree';
      var code = "tree.DecisionTreeClassifier()"
      break
    case 'LinearSVC':
      Blockly.Python.definitions_['import_svm'] = 'from sklearn import svm';
      var code = "svm.LinearSVC()"
      break
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['model_train'] = function(block) {
  // Train a model.
  var x = Blockly.Python.valueToCode(block, 'X',
  Blockly.Python.ORDER_NONE) || '[]';
  var y = Blockly.Python.valueToCode(block, 'Y',
  Blockly.Python.ORDER_NONE) || '[]';
  var model = Blockly.Python.valueToCode(block, 'MODEL',
  Blockly.Python.ORDER_NONE) || 'None';
  var code = model + '.fit(' + x + ', ' + y + ')\n';
  return code;
};

Blockly.Python['model_predict'] = function(block) {
  // Use model to predict.
  var model = Blockly.Python.valueToCode(block, 'MODEL',
  Blockly.Python.ORDER_NONE) || 'None';
  var x = Blockly.Python.valueToCode(block, 'X',
  Blockly.Python.ORDER_NONE) || '[]';
  var code = model + '.predict(' + x + ')\n';
  return [code, Blockly.Python.ORDER_ATOMIC];
};