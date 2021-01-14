'use strict';

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldLabel');
goog.require('Blockly.Mutator');

Blockly.Blocks['mlplay_class'] = {
  /**
   * Block for defining the MLPlay class.
   * @this {Blockly.Block}
   */
  init: function() {
    this.jsonInit({
      "message0": "MLPlay %1 %{BKY_MLPLAY_CLASS_INITIALIZE} %2 %{BKY_MLPLAY_CLASS_UPDATE} %3 %{BKY_MLPLAY_CLASS_RESET} %4",
      "args0": [
        {
          "type": "input_dummy",
          "align": "CENTRE"
        },
        {
          "type": "input_statement",
          "name": "INIT",
          "align": "RIGHT"
        },
        {
          "type": "input_statement",
          "name": "UPDATE",
          "align": "RIGHT"
        },
        {
          "type": "input_statement",
          "name": "RESET",
          "align": "RIGHT"
        }
      ],
      "colour": 0,
      "tooltip": "%{BKY_MLPLAY_CLASS_TOOLTIP}",
      "helpUrl": ""
    });
  },
  onchange: function(_e) {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return;  // Don't change state at the start of a drag.
    }
    // Is there more than one block?
    var blockNum = 0;
    var topBlocks = this.workspace.getTopBlocks();
    for (var i = 0; i < topBlocks.length; i++) {
      if (topBlocks[i].type == this.type) {
        blockNum++;
      }
    }
    if (blockNum > 1) {
      this.setWarningText(Blockly.Msg['MLPLAY_CLASS_WARNING']);
      this.setEnabled(false);
    } else {
      this.setWarningText(null);
      this.setEnabled(true);
    }
  }
};

Blockly.Blocks['mlplay_init_info'] = {
  /**
   * Block for getting initial information.
   * @this {Blockly.Block}
   */
  init: function() {
    if ('MLPLAY_INIT_INFO_OPTIONS' in Blockly.Msg) {
      this.appendDummyInput()
          .appendField(Blockly.Msg['MLPLAY_INIT_INFO'])
          .appendField(new Blockly.FieldDropdown(Blockly.Msg['MLPLAY_INIT_INFO_OPTIONS']), "FIELD");
      this.setColour(0);
      this.setOutput(true);
      this.setTooltip(Blockly.Msg['MLPLAY_INIT_INFO_TOOLTIP']);
    } else {
      this.appendDummyInput()
          .appendField(Blockly.Msg['MLPLAY_INIT_INFO'])
          .appendField(new Blockly.FieldDropdown([["", ""]]), "FIELD");
      this.setColour(0);
      this.setOutput(true);
      this.setTooltip(Blockly.Msg['MLPLAY_INIT_INFO_TOOLTIP']);
      this.setEnabled(false);
    }
  },
  onchange: function(_e) {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return;  // Don't change state at the start of a drag.
    }
    //
    var legal = false;
    var block = this;
    var parentBlock = this.getParent();
    while (parentBlock) {
      if (parentBlock.type == 'mlplay_class') {
        var input = parentBlock.getInputWithBlock(block);
        if (input.name == "INIT") {
          legal = true;
        }
        break;
      }
      block = parentBlock;
      parentBlock = block.getParent();
    }
    if (legal) {
      this.setWarningText(null);
      this.setEnabled(true);
    } else if (!this.isInFlyout) {
      this.setWarningText(Blockly.Msg['MLPLAY_INIT_INFO_WARNING']);
      this.setEnabled(false);
    }
  }
};

Blockly.Blocks['mlplay_player_status'] = {
  /**
   * Block for checking game status.
   * @this {Blockly.Block}
   */
  init: function() {
    if ('MLPLAY_PLAYER_STATUS_OPTIONS' in Blockly.Msg) {
      this.appendDummyInput()
          .appendField(Blockly.Msg['MLPLAY_PLAYER_STATUS'])
          .appendField(new Blockly.FieldDropdown(Blockly.Msg['MLPLAY_PLAYER_STATUS_OPTIONS']), "STATUS");
      this.setColour(0);
      this.setOutput(true);
      this.setTooltip(Blockly.Msg['MLPLAY_PLAYER_STATUS_TOOLTIP']);
    } else {
      this.appendDummyInput()
          .appendField(Blockly.Msg['MLPLAY_PLAYER_STATUS'])
          .appendField(new Blockly.FieldDropdown([["", ""]]), "STATUS");
      this.setColour(0);
      this.setOutput(true);
      this.setTooltip(Blockly.Msg['MLPLAY_PLAYER_STATUS_TOOLTIP']);
      this.setEnabled(false);
    }
  }
}

Blockly.Blocks['mlplay_game_status'] = {
  /**
   * Block for checking game status.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['MLPLAY_GAME_STATUS'])
        .appendField(new Blockly.FieldDropdown(Blockly.Msg['MLPLAY_GAME_STATUS_OPTIONS']), "STATUS");
    this.setColour(0);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg['MLPLAY_GAME_STATUS_TOOLTIP']);
  }
}

Blockly.Blocks['mlplay_get_info'] = {
  /**
   * Block for getting scene information.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['MLPLAY_GET_INFO'])
        .appendField(new Blockly.FieldDropdown(Blockly.Msg['MLPLAY_GET_INFO_OPTIONS']), "FIELD");
    this.setColour(0);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg['MLPLAY_GET_INFO_TOOLTIP']);
  },
  onchange: function(_e) {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return;  // Don't change state at the start of a drag.
    }
    //
    var legal = false;
    var block = this;
    var parentBlock = this.getParent();
    while (parentBlock) {
      if (parentBlock.type == 'mlplay_class') {
        var input = parentBlock.getInputWithBlock(block);
        if (input.name == "UPDATE") {
          legal = true;
        }
        break;
      }
      block = parentBlock;
      parentBlock = block.getParent();
    }
    if (legal) {
      this.setWarningText(null);
      this.setEnabled(true);
    } else if (!this.isInFlyout) {
      this.setWarningText(Blockly.Msg['MLPLAY_GET_INFO_WARNING']);
      this.setEnabled(false);
    }
  }
};

Blockly.Blocks['mlplay_get_constant'] = {
  /**
   * Block for getting game constants.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['MLPLAY_GET_CONSTANT'])
        .appendField(new Blockly.FieldDropdown(Blockly.Msg['MLPLAY_GET_CONSTANT_OPTIONS']), "CONSTANT");
    this.setColour(0);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg['MLPLAY_GET_CONSTANT_TOOLTIP']);
  }
}

Blockly.Blocks['mlplay_return_action'] = {
  /**
   * Block for returning next action.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['MLPLAY_RETURN_ACTION'])
        .appendField(new Blockly.FieldDropdown(Blockly.Msg['MLPLAY_RETURN_ACTION_OPTIONS']), "ACTION");
    this.setColour(0);
    this.setOutput(false);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg['MLPLAY_RETURN_ACTION_TOOLTIP']);
  },
  onchange: function(_e) {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return;  // Don't change state at the start of a drag.
    }
    //
    var legal = false;
    var block = this;
    var parentBlock = this.getParent();
    while (parentBlock) {
      if (parentBlock.type == 'mlplay_class') {
        var input = parentBlock.getInputWithBlock(block);
        if (input.name == "UPDATE") {
          legal = true;
        }
        break;
      }
      block = parentBlock;
      parentBlock = block.getParent();
    }
    if (legal) {
      this.setWarningText(null);
      this.setEnabled(true);
    } else if (!this.isInFlyout) {
      this.setWarningText(Blockly.Msg['MLPLAY_RETURN_ACTION_WARNING']);
      this.setEnabled(false);
    }
  }
};

Blockly.Blocks['mlplay_return_mazecar_action'] = {
  /**
   * Block for returning Maze_Car action.
   * @this {Blockly.Block}
   */
  init: function() {
    this.jsonInit({
      "message0": "%{BKY_MLPLAY_RETURN_MAZECAR_ACTION}",
      "args0": [
        {
          "type": "input_value",
          "name": "LEFT_RPM",
          "check": "Number",
          "align": "RIGHT",
        },
        {
          "type": "input_value",
          "name": "RIGHT_RPM",
          "check": "Number",
          "align": "RIGHT"
        }
      ],
      "colour": 0,
      "previousStatement": null,
      "tooltip": "%{BKY_MLPLAY_RETURN_ACTION_TOOLTIP}",
      "helpUrl": ""
    });
  },
  onchange: function(_e) {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return;  // Don't change state at the start of a drag.
    }
    //
    var legal = false;
    var block = this;
    var parentBlock = this.getParent();
    while (parentBlock) {
      if (parentBlock.type == 'mlplay_class') {
        var input = parentBlock.getInputWithBlock(block);
        if (input.name == "UPDATE") {
          legal = true;
        }
        break;
      }
      block = parentBlock;
      parentBlock = block.getParent();
    }
    if (legal) {
      this.setWarningText(null);
      this.setEnabled(true);
    } else if (!this.isInFlyout) {
      this.setWarningText(Blockly.Msg['MLPLAY_RETURN_ACTION_WARNING']);
      this.setEnabled(false);
    }
  }
};

