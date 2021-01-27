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
          [Blockly.Msg['MODEL_DECISION_TREE'], 'DecisionTreeClassifier'],
          [Blockly.Msg['MODEL_LINEAR_SVM'], 'LinearSVC']
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
            .appendField(new Blockly.FieldNumber(5, 1, 10000, 1), 'PARAM_K');
        this.paramCount_ = 1;
        break
      case 'DecisionTreeClassifier':
        this.paramCount_ = 0;
        break
      case 'LinearSVC':
        this.paramCount_ = 0;
        break
    }
  }
}