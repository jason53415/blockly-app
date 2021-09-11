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
      var algorithm = block.getFieldValue('PARAM_ALGORITHM');
      var code = "neighbors.KNeighborsClassifier(" + k + ", weights='" + weights + "', algorithm='" + algorithm + "')";
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
    case 'SGDClassifier':
      Blockly.Python.definitions_['import_linear_model'] = 'from sklearn import linear_model';
      var loss = block.getFieldValue('PARAM_LOSS');
      var penalty = block.getFieldValue('PARAM_PENALTY');
      var code = "linear_model.SGDClassifier('" + loss + "', penalty='" + penalty + "')";
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
      var algorithm = block.getFieldValue('PARAM_ALGORITHM');
      var code = "neighbors.KNeighborsRegressor(" + k + ", weights='" + weights + "', algorithm='" + algorithm +  "')"
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
    case 'SGDRegressor':
      Blockly.Python.definitions_['import_linear_model'] = 'from sklearn import linear_model';
      var loss = block.getFieldValue('PARAM_LOSS');
      var penalty = block.getFieldValue('PARAM_PENALTY');
      var code = "linear_model.SGDRegressor('" + loss + "', penalty='" + penalty + "')";
      break
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['model_train'] = function(block) {
  // Train a model.
  var x = Blockly.Python.valueToCode(block, 'X',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var y = Blockly.Python.valueToCode(block, 'Y',
  Blockly.Python.ORDER_COLLECTION) || '[]';
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
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var code = model + '.predict(' + x + ').tolist()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['model_evaluate_classification'] = function(block) {
  // Evaluate classification results.
  Blockly.Python.definitions_['import_metrics'] = 'from sklearn import metrics';
  var y_true = Blockly.Python.valueToCode(block, 'TRUE',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var y_pred = Blockly.Python.valueToCode(block, 'PRED',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var code = 'metrics.accuracy_score(' + y_true + ', ' + y_pred + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['model_evaluate_regression'] = function(block) {
  // Evaluate regression results.
  Blockly.Python.definitions_['import_metrics'] = 'from sklearn import metrics';
  var y_true = Blockly.Python.valueToCode(block, 'TRUE',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var y_pred = Blockly.Python.valueToCode(block, 'PRED',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var func = block.getFieldValue('FUNC');
  switch(func) {
    case 'R2':
      var code = 'metrics.r2_score(' + y_true + ', ' + y_pred + ')';
      break
    case 'MAE':
      var code = 'metrics.mean_absolute_error(' + y_true + ', ' + y_pred + ')';
      break
    case 'MSE':
      var code = 'metrics.mean_squared_error(' + y_true + ', ' + y_pred + ')';
      break
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['model_train_test_split'] = function(block) {
  // Split training data and testing data.
  Blockly.Python.definitions_['import_model_selection'] = 'from sklearn import model_selection';
  var x = Blockly.Python.valueToCode(block, 'X',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var y = Blockly.Python.valueToCode(block, 'Y',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var test_size = Blockly.Python.valueToCode(block, 'TEST_SIZE',
  Blockly.Python.ORDER_ATOMIC) || '0';
  var shuffle = block.getFieldValue('SHUFFLE');
  var train_data = Blockly.Python.valueToCode(block, 'TRAIN_DATA',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var test_data = Blockly.Python.valueToCode(block, 'TEST_DATA',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var train_target = Blockly.Python.valueToCode(block, 'TRAIN_TARGET',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var test_target = Blockly.Python.valueToCode(block, 'TEST_TARGET',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var code = train_data + ', ' + test_data + ', ' + train_target + ', ' + test_target + 
             ' = model_selection.train_test_split(' + x + ', ' + y + ', test_size=' + test_size + ', shuffle=' + shuffle + ')\n';
  return code;
};

Blockly.Python['model_k_fold'] = function(block) {
  // k-fold cross-validation.
  Blockly.Python.definitions_['import_model_selection'] = 'from sklearn import model_selection';
  Blockly.Python.definitions_['import_np'] = 'import numpy as np';
  var x = Blockly.Python.valueToCode(block, 'X',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var y = Blockly.Python.valueToCode(block, 'Y',
  Blockly.Python.ORDER_COLLECTION) || '[]';
  var k = Blockly.Python.valueToCode(block, 'K',
  Blockly.Python.ORDER_ATOMIC) || '2';
  var shuffle = block.getFieldValue('SHUFFLE');
  var code = '[[np.array(' + x + ')[index1].tolist(), np.array(' + x + ')[index2].tolist(), ' + 
             'np.array(' + y + ')[index1].tolist(), np.array(' + y + ')[index2].tolist()] ' +
             'for index1, index2 in model_selection.KFold(n_splits='+ k +', shuffle=' + shuffle + ').split(' + x + ', ' + y + ')]';
  return [code, Blockly.Python.ORDER_COLLECTION];
};