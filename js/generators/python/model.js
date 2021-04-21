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
      var weights = block.getFieldValue('PARAM_WEIGHTS');
      var code = "neighbors.KNeighborsClassifier(" + k + ", weights='" + weights + "')";
      break
    case 'LinearSVC':
      Blockly.Python.definitions_['import_svm'] = 'from sklearn import svm';
      var penalty = block.getFieldValue('PARAM_PENALTY');
      var loss = block.getFieldValue('PARAM_LOSS');
      var c = block.getFieldValue('PARAM_C');
      var code = "svm.LinearSVC('" + penalty + "', '" + loss + "', C=" + c + ")";
      break
    case 'DecisionTreeClassifier':
      Blockly.Python.definitions_['import_tree'] = 'from sklearn import tree';
      var max_depth = block.getFieldValue('PARAM_MAX_DEPTH');
      var min_samples_split = block.getFieldValue('PARAM_MIN_SAMPLES_SPLIT');
      if (min_samples_split == 0) {
        min_samples_split = "None";
      }
      var code = "tree.DecisionTreeClassifier(max_depth=" + max_depth + ", min_samples_split=" + min_samples_split + ")";
      break
    case 'RandomForestClassifier':
      Blockly.Python.definitions_['import_ensemble'] = 'from sklearn import ensemble';
      var n = block.getFieldValue('PARAM_N_ESTIMATORS');
      var max_depth = block.getFieldValue('PARAM_MAX_DEPTH');
      var min_samples_split = block.getFieldValue('PARAM_MIN_SAMPLES_SPLIT');
      if (min_samples_split == 0) {
        min_samples_split = "None";
      }
      var code = "ensemble.RandomForestClassifier(" + n + ", max_depth=" + max_depth + ", min_samples_split=" + min_samples_split + ")";
      break
    case 'MLPClassifier':
      Blockly.Python.definitions_['import_neural_network'] = 'from sklearn import neural_network';
      var hidden_layer_sizes = Blockly.Python.valueToCode(block, 'PARAM0',
      Blockly.Python.ORDER_COLLECTION) || '[1]';
      var activation = block.getFieldValue('PARAM_ACTIVATION');
      var batch_size = block.getFieldValue('PARAM_BATCH_SIZE');
      var code = "neural_network.MLPClassifier(" + hidden_layer_sizes + ", '" + activation + "', batch_size=" + batch_size + ")";
      break
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['model_create_regression'] = function(block) {
  // Create a regression model.
  var model = block.getFieldValue('MODEL');
  switch(model) {
    case 'KNeighborsRegressor':
      Blockly.Python.definitions_['import_neighbors'] = 'from sklearn import neighbors';
      var k = block.getFieldValue('PARAM_K');
      var weights = block.getFieldValue('PARAM_WEIGHTS');
      var code = "neighbors.KNeighborsRegressor(" + k + ", weights='" + weights + "')"
      break
    case 'LinearSVR':
      Blockly.Python.definitions_['import_svm'] = 'from sklearn import svm';
      var c = block.getFieldValue('PARAM_C');
      var code = "svm.LinearSVR(C=" + c + ")";
      break
    case 'DecisionTreeRegressor':
      Blockly.Python.definitions_['import_tree'] = 'from sklearn import tree';
      var max_depth = block.getFieldValue('PARAM_MAX_DEPTH');
      var min_samples_split = block.getFieldValue('PARAM_MIN_SAMPLES_SPLIT');
      if (min_samples_split == 0) {
        min_samples_split = "None";
      }
      var code = "tree.DecisionTreeRegressor(max_depth=" + max_depth + ", min_samples_split=" + min_samples_split + ")";
      break
    case 'RandomForestRegressor':
      Blockly.Python.definitions_['import_ensemble'] = 'from sklearn import ensemble';
      var n = block.getFieldValue('PARAM_N_ESTIMATORS');
      var max_depth = block.getFieldValue('PARAM_MAX_DEPTH');
      var min_samples_split = block.getFieldValue('PARAM_MIN_SAMPLES_SPLIT');
      if (min_samples_split == 0) {
        min_samples_split = "None";
      }
      var code = "ensemble.RandomForestRegressor(" + n + ", max_depth=" + max_depth + ", min_samples_split=" + min_samples_split + ")";
      break
    case 'MLPRegressor':
      Blockly.Python.definitions_['import_neural_network'] = 'from sklearn import neural_network';
      var hidden_layer_sizes = Blockly.Python.valueToCode(block, 'PARAM0',
      Blockly.Python.ORDER_COLLECTION) || '[1]';
      var activation = block.getFieldValue('PARAM_ACTIVATION');
      var batch_size = block.getFieldValue('PARAM_BATCH_SIZE');
      var code = "neural_network.MLPRegressor(" + hidden_layer_sizes + ", '" + activation + "', batch_size=" + batch_size + ")";
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