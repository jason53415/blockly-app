'use strict';

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldLabel');
goog.require('Blockly.Mutator');

Blockly.defineBlocksWithJsonArray([
  // Block for getting the dict keys
  {
    "type": "dicts_get_keys",
    "message0": "%{BKY_DICTS_GET_KEYS}",
    "args0": [
      {
        "type": "input_value",
        "name": "DICT",
        "check": "Dictionary"
      }
    ],
    "output": "Array",
    "style": "dict_blocks",
    "tooltip": "%{BKY_DICTS_GET_KEYS_TOOLTIP}"
  },
  // Block for getting value from dictionary key.
  {
    "type": "dicts_get_value",
    "message0": "%{BKY_DICTS_GET_VALUE}",
    "args0": [
      {
        "type": "input_value",
        "name": "DICT",
        "check": "Dictionary"
      },
      {
        "type": "input_value",
        "name": "KEY",
      }
    ],
    "inputsInline": true,
    "output": null,
    "style": "dict_blocks",
    "tooltip": "%{BKY_DICTS_GET_VALUE_TOOLTIP}"
  },
  // Block for setting value from dictionary key.
  {
    "type": "dicts_set_value",
    "message0": "%{BKY_DICTS_SET_VALUE}",
    "args0": [
      {
        "type": "input_value",
        "name": "DICT",
        "check": "Dictionary"
      },
      {
        "type": "input_value",
        "name": "KEY",
      },
      {
        "type": "input_value",
        "name": "VALUE",
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "style": "dict_blocks",
    "tooltip": "%{BKY_DICTS_SET_VALUE_TOOLTIP}"
  }
]);

Blockly.Blocks['dicts_create_with_container'] = {
  // Container.
  init: function() {
    this.setStyle('dict_blocks');
    this.appendDummyInput()
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_CONTAINER_TITLE_ADD']);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg['DICTS_CREATE_WITH_CONTAINER_TOOLTIP']);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_create_with_item'] = {
  // Add items.
  init: function() {
    this.setStyle('dict_blocks');
    this.appendDummyInput()
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_TITLE']);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg['DICTS_CREATE_WITH_ITEM_TOOLTIP']);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_create_with'] = {
  init: function() {
    this.setStyle('dict_blocks');
    this.appendDummyInput('TITLE_TEXT')
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_INPUT_WITH']);
    this.appendValueInput('KEY0')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_KEY']);
    this.appendValueInput('VALUE0')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_VALUE']);
    this.appendValueInput('KEY1')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_KEY']);
    this.appendValueInput('VALUE1')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_VALUE']);
    
    this.setOutput(true, 'Dictionary');
    this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
    this.setTooltip(Blockly.Msg['DICTS_CREATE_WITH_TOOLTIP']);
    this.itemCount_ = 2;
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(container) {
    this.removeInput('TITLE_TEXT');
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('KEY' + x);
      this.removeInput('VALUE' + x);
    }
    this.itemCount_ = parseInt(container.getAttribute('items'), 10);
    if (this.itemCount_ > 0) {
      this.appendDummyInput('TITLE_TEXT')
          .appendField(Blockly.Msg['DICTS_CREATE_WITH_INPUT_WITH']);
    } else {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg['DICTS_CREATE_EMPTY_TITLE']);
    }
    for (var x = 0; x < this.itemCount_; x++) {
      this.appendValueInput('KEY' + x)
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_KEY']);
      this.appendValueInput('VALUE' + x)
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_VALUE']);
    }
  },
  decompose: function(workspace) {
    var containerBlock =  workspace.newBlock('dicts_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
      var itemBlock =  workspace.newBlock('dicts_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    if (this.itemCount_ == 0) {
      this.removeInput('EMPTY');
    } else {
      this.removeInput('TITLE_TEXT');
      for (var x = this.itemCount_ - 1; x >= 0; x--) {
        this.removeInput('VALUE' + x);
        this.removeInput('KEY' + x);
      }
    }
    this.itemCount_ = 0;
    // Rebuild the block's inputs.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    this.appendDummyInput('TITLE_TEXT')
        .appendField(Blockly.Msg['DICTS_CREATE_WITH_INPUT_WITH']);
    while (itemBlock) {
      var key_input = this.appendValueInput('KEY' + this.itemCount_)
                          .setAlign(Blockly.ALIGN_RIGHT)
                          .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_KEY']);
      var value_input = this.appendValueInput('VALUE' + this.itemCount_)
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .appendField(Blockly.Msg['DICTS_CREATE_WITH_ITEM_VALUE']);
      // Reconnect any child blocks.
      if (itemBlock.keyConnection_) {
        key_input.connection.connect(itemBlock.keyConnection_);
      }
      if (itemBlock.valueConnection_) {
        value_input.connection.connect(itemBlock.valueConnection_);
      }
      this.itemCount_++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    if (this.itemCount_ == 0) {
      this.removeInput('TITLE_TEXT');
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg['DICTS_CREATE_EMPTY_TITLE']);
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (itemBlock) {
      var key_input = this.getInput('KEY' + x);
      var value_input = this.getInput('VALUE' + x);
      itemBlock.keyConnection_ = key_input && key_input.connection.targetConnection;
      itemBlock.valueConnection_ = value_input && value_input.connection.targetConnection;
      x++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  }
};
