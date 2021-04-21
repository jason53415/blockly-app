'use strict';

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldLabel');

Blockly.defineBlocksWithJsonArray([
  // Train a model.
  {
    "type": "model_train",
    "message0": "%{BKY_MODEL_TRAIN}",
    "args0": [
      {
        "type": "input_value",
        "name": "X"
      },
      {
        "type": "input_value",
        "name": "Y"
      },
      {
        "type": "input_value",
        "name": "MODEL"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "style": "model_blocks",
    "tooltip": "%{BKY_MODEL_TRAIN_TOOLTIP}"
  },
  // Use model to predict.
  {
    "type": "model_predict",
    "message0": "%{BKY_MODEL_PREDICT}",
    "args0": [
      {
        "type": "input_value",
        "name": "MODEL"
      },
      {
        "type": "input_value",
        "name": "X"
      }
    ],
    "inputsInline": true,
    "output": null,
    "style": "model_blocks",
    "tooltip": "%{BKY_MODEL_PREDICT_TOOLTIP}"
  }
]);

Blockly.Blocks["model_create_classification"] = {
  /**
   * Block for creating classification model.
   * @this {Blockly.Block}
   */
  init: function() {
    var MODEL =
        [
          [Blockly.Msg['MODEL_KNN'], 'KNeighborsClassifier'],
          [Blockly.Msg['MODEL_LINEAR_SVM'], 'LinearSVC'],
          [Blockly.Msg['MODEL_DECISION_TREE'], 'DecisionTreeClassifier'],
          [Blockly.Msg['MODEL_RANDOM_FOREST'], 'RandomForestClassifier'],
          [Blockly.Msg['MODEL_MLP'], 'MLPClassifier']
        ];
    this.setStyle('model_blocks');
    var modelMenu = new Blockly.FieldDropdown(MODEL, function(value) {
      this.getSourceBlock().updateParameters_(value);
    });
    this.appendDummyInput()
        .appendField(Blockly.Msg['MODEL_CREATE'])
        .appendField(modelMenu, 'MODEL')
        .appendField(Blockly.Msg['MODEL_CLASSIFICATION']);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg['MODEL_CREATE_CLASSIFICATION_TOOLTIP'])
    this.paramCount_ = 0;
  },
  updateParameters_: function(model) {
    for (var x = 0; x < this.paramCount_; x++) {
      this.removeInput('PARAM' + x);
    }
    switch(model) {
      case 'KNeighborsClassifier':
        this.appendDummyInput('PARAM0')
            .appendField(" k :")
            .appendField(new Blockly.FieldNumber(5, 1, 10000, 1), 'PARAM_K')
            .appendField(" " + Blockly.Msg['MODEL_WEIGHT'] + " :")
            .appendField(new Blockly.FieldDropdown([
              [Blockly.Msg['MODEL_WEIGHT_UNIFORM'], 'uniform'],
              [Blockly.Msg['MODEL_WEIGHT_DISTANCE'], 'distance']
            ]), 'PARAM_WEIGHTS');
        this.paramCount_ = 1;
        break
      case 'LinearSVC':
        this.appendDummyInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_C'] + " :")
            .appendField(new Blockly.FieldNumber(1, 0.0001, null, 0.0001), 'PARAM_C')
            .appendField(" " + Blockly.Msg['MODEL_PENALTY'] + " :")
            .appendField(new Blockly.FieldDropdown([
              [Blockly.Msg['MODEL_PENALTY_L2'], 'l2'],
              [Blockly.Msg['MODEL_PENALTY_L1'], 'l1']
            ]), 'PARAM_PENALTY')
            .appendField(" " + Blockly.Msg['MODEL_LOSS'] + " :")
            .appendField(new Blockly.FieldDropdown([
              [Blockly.Msg['MODEL_LOSS_SQUARED_HINGE'], 'squared_hinge'],
              [Blockly.Msg['MODEL_LOSS_HINGE'], 'hinge']
            ]), 'PARAM_LOSS');
        this.paramCount_ = 1;
        break
      case 'DecisionTreeClassifier':
        this.appendDummyInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_MAX_DEPTH'] + " :")
            .appendField(new Blockly.FieldNumber(5, 0, null, 1), 'PARAM_MAX_DEPTH')
            .appendField(" " + Blockly.Msg['MODEL_MIN_SAMPLES_SPLIT'] + " :")
            .appendField(new Blockly.FieldNumber(2, 2, null, 1), 'PARAM_MIN_SAMPLES_SPLIT');
        this.paramCount_ = 1;
        break
      case 'RandomForestClassifier':
        this.appendDummyInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_N_ESTIMATORS'] + " :")
            .appendField(new Blockly.FieldNumber(100, 1, null, 1), 'PARAM_N_ESTIMATORS')
            .appendField(" " + Blockly.Msg['MODEL_MAX_DEPTH'] + " :")
            .appendField(new Blockly.FieldNumber(5, 0, null, 1), 'PARAM_MAX_DEPTH')
            .appendField(" " + Blockly.Msg['MODEL_MIN_SAMPLES_SPLIT'] + " :")
            .appendField(new Blockly.FieldNumber(2, 2, null, 1), 'PARAM_MIN_SAMPLES_SPLIT');
        this.paramCount_ = 1;
        break
      case 'MLPClassifier':
        this.appendValueInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_HIDDEN_LAYER_SIZES'] + " :");
        this.appendDummyInput('PARAM1')
            .appendField(" " + Blockly.Msg['MODEL_ACTIVATION'] + " :")
            .appendField(new Blockly.FieldDropdown([
              [Blockly.Msg['MODEL_ACTIVATION_LOGISTIC'], 'logistic'],
              [Blockly.Msg['MODEL_ACTIVATION_TANH'], 'tanh'],
              [Blockly.Msg['MODEL_ACTIVATION_RELU'], 'relu']
            ]), 'PARAM_ACTIVATION')
            .appendField(" " + Blockly.Msg['MODEL_BATCH_SIZE'] + " :")
            .appendField(new Blockly.FieldNumber(200, 1, null, 1), 'PARAM_BATCH_SIZE');
        this.paramCount_ = 2;
        break
    }
  }
}

Blockly.Blocks["model_create_regression"] = {
  /**
   * Block for creating regression model.
   * @this {Blockly.Block}
   */
  init: function() {
    var MODEL =
    [
      [Blockly.Msg['MODEL_KNN'], 'KNeighborsRegressor'],
      [Blockly.Msg['MODEL_LINEAR_SVM'], 'LinearSVR'],
      [Blockly.Msg['MODEL_DECISION_TREE'], 'DecisionTreeRegressor'],
      [Blockly.Msg['MODEL_RANDOM_FOREST'], 'RandomForestRegressor'],
      [Blockly.Msg['MODEL_MLP'], 'MLPRegressor']
    ];
    this.setStyle('model_blocks');
    var modelMenu = new Blockly.FieldDropdown(MODEL, function(value) {
      this.getSourceBlock().updateParameters_(value);
    });
    this.appendDummyInput()
        .appendField(Blockly.Msg['MODEL_CREATE'])
        .appendField(modelMenu, 'MODEL')
        .appendField(Blockly.Msg['MODEL_REGRESSION']);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg['MODEL_CREATE_REGRESSION_TOOLTIP'])
    this.paramCount_ = 0;
  },
  updateParameters_: function(model) {
    for (var x = 0; x < this.paramCount_; x++) {
      this.removeInput('PARAM' + x);
    }
    switch(model) {
      case 'KNeighborsRegressor':
        this.appendDummyInput('PARAM0')
            .appendField(" k :")
            .appendField(new Blockly.FieldNumber(5, 1, 10000, 1), 'PARAM_K')
            .appendField(" " + Blockly.Msg['MODEL_WEIGHT'] + " :")
            .appendField(new Blockly.FieldDropdown([
              [Blockly.Msg['MODEL_WEIGHT_UNIFORM'], 'uniform'],
              [Blockly.Msg['MODEL_WEIGHT_DISTANCE'], 'distance']
            ]), 'PARAM_WEIGHTS');
        this.paramCount_ = 1;
        break
      case 'LinearSVR':
        this.appendDummyInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_C'] + " :")
            .appendField(new Blockly.FieldNumber(1, 0.0001, null, 0.0001), 'PARAM_C');
        this.paramCount_ = 1;
        break
      case 'DecisionTreeRegressor':
        this.appendDummyInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_MAX_DEPTH'] + " :")
            .appendField(new Blockly.FieldNumber(5, 0, null, 1), 'PARAM_MAX_DEPTH')
            .appendField(" " + Blockly.Msg['MODEL_MIN_SAMPLES_SPLIT'] + " :")
            .appendField(new Blockly.FieldNumber(2, 2, null, 1), 'PARAM_MIN_SAMPLES_SPLIT');
        this.paramCount_ = 1;
        break
      case 'RandomForestRegressor':
        this.appendDummyInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_N_ESTIMATORS'] + " :")
            .appendField(new Blockly.FieldNumber(100, 1, null, 1), 'PARAM_N_ESTIMATORS')
            .appendField(" " + Blockly.Msg['MODEL_MAX_DEPTH'] + " :")
            .appendField(new Blockly.FieldNumber(5, 0, null, 1), 'PARAM_MAX_DEPTH')
            .appendField(" " + Blockly.Msg['MODEL_MIN_SAMPLES_SPLIT'] + " :")
            .appendField(new Blockly.FieldNumber(2, 2, null, 1), 'PARAM_MIN_SAMPLES_SPLIT');
        this.paramCount_ = 1;
        break
      case 'MLPRegressor':
        this.appendValueInput('PARAM0')
            .appendField(" " + Blockly.Msg['MODEL_HIDDEN_LAYER_SIZES'] + " :");
        this.appendDummyInput('PARAM1')
            .appendField(" " + Blockly.Msg['MODEL_ACTIVATION'] + " :")
            .appendField(new Blockly.FieldDropdown([
              [Blockly.Msg['MODEL_ACTIVATION_LOGISTIC'], 'logistic'],
              [Blockly.Msg['MODEL_ACTIVATION_TANH'], 'tanh'],
              [Blockly.Msg['MODEL_ACTIVATION_RELU'], 'relu']
            ]), 'PARAM_ACTIVATION')
            .appendField(" " + Blockly.Msg['MODEL_BATCH_SIZE'] + " :")
            .appendField(new Blockly.FieldNumber(200, 1, null, 1), 'PARAM_BATCH_SIZE');
        this.paramCount_ = 2;
        break
    }
  }
}