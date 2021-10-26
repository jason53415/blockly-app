'use strict';

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldLabel');

Blockly.defineBlocksWithJsonArray([
  // Block for saving an object as a pickle file.
  {
    "type": "ndarrays_create_with_list",
    "message0": "%{BKY_NDARRAYS_CREATE_WITH_LIST}",
    "args0": [
      {
        "type": "input_value",
        "name": "LIST"
      }
    ],
    "output": "Array",
    "inputsInline": true,
    "style": "ndarray_blocks",
    "tooltip": "%{BKY_NDARRAYS_CREATE_WITH_LIST_TOOLTIP}"
  },
  // Block for convert an ndarray to a list.
  {
    "type": "ndarrays_to_list",
    "message0": "%{BKY_NDARRAYS_TO_LIST}",
    "args0": [
      {
        "type": "input_value",
        "name": "ARRAY"
      }
    ],
    "output": "Array",
    "inputsInline": true,
    "style": "ndarray_blocks",
    "tooltip": "%{BKY_NDARRAYS_TO_LIST_TOOLTIP}"
  }
]);

Blockly.Blocks['ndarrays_create_with'] = {
  /**
   * Block for creating an ndarray of any shape filled with a specific element.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setStyle('ndarray_blocks');
    this.dimCount_ = 2;
    this.updateShape_();
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['ndarrays_create_with_dim']));
    this.setTooltip(Blockly.Msg['NDARRAYS_CREATE_WITH_TOOLTIP']);
  },
  /**
   * Create XML to represent dim inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('dims', this.dimCount_);
    return container;
  },
  /**
   * Parse XML to restore the dim inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    this.dimCount_ = parseInt(xmlElement.getAttribute('dims'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('ndarrays_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.dimCount_; i++) {
      var dimBlock = workspace.newBlock('ndarrays_create_with_dim');
      dimBlock.initSvg();
      connection.connect(dimBlock.previousConnection);
      connection = dimBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function(containerBlock) {
    var dimBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (dimBlock) {
      connections.push(dimBlock.valueConnection_);
      dimBlock = dimBlock.nextConnection &&
          dimBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.dimCount_; i++) {
      var connection = this.getInput('DIM' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    
    this.dimCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.dimCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'DIM' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function(containerBlock) {
    var dimBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (dimBlock) {
      var input = this.getInput('DIM' + i);
      dimBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      dimBlock = dimBlock.nextConnection &&
          dimBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function() {
    if (this.dimCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.dimCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg['NDARRAYS_CREATE_EMPTY_TITLE']);
    }
    if (this.dimCount_ && !this.getInput('FILL')) {
      this.appendValueInput('FILL')
          .appendField(Blockly.Msg['NDARRAYS_CREATE_FILL_WITH']);
    } else if (!this.dimCount_ && this.getInput('FILL')) {
      this.removeInput('FILL');
    }
    // Add new inputs.
    for (var i = 0; i < this.dimCount_; i++) {
      if (!this.getInput('DIM' + i)) {
        var input = this.appendValueInput('DIM' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg['NDARRAYS_CREATE_WITH_DIM_WITH']);
        } else {
          input.appendField("x");
        }
        this.moveInputBefore('DIM' + i, 'FILL');
      }
    }
    // Remove deleted inputs.
    while (this.getInput('DIM' + i)) {
      this.removeInput('DIM' + i);
      i++;
    }
  }
};

Blockly.Blocks['ndarrays_create_with_container'] = {
  /**
   * Mutator block for dimension container.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setStyle('ndarray_blocks');
    this.appendDummyInput()
        .appendField(Blockly.Msg['NDARRAYS_CREATE_WITH_CONTAINER']);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg['NDARRAYS_CREATE_WITH_CONTAINER_TOOLTIP']);
    this.contextMenu = false;
  }
};

Blockly.Blocks['ndarrays_create_with_dim'] = {
  /**
   * Mutator block for adding dimensions.
   * @this {Blockly.Block}
   */
  init: function() {
    this.setStyle('ndarray_blocks');
    this.appendDummyInput()
        .appendField(Blockly.Msg['NDARRAYS_CREATE_WITH_DIM']);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg['NDARRAYS_CREATE_WITH_DIM_TOOLTIP']);
    this.contextMenu = false;
  }
};