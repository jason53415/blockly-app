'use strict';

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldLabel');

Blockly.defineBlocksWithJsonArray([
  // Block for saving an object as a file.
  {
    "type": "file_save",
    "message0": "%{BKY_FILE_SAVE}",
    "args0": [
      {
        "type": "input_value",
        "name": "OBJECT"
      },
      {
        "type": "field_input",
        "name": "FILENAME",
        "text": "%{BKY_FILE_DEFAULT_NAME}",
        "spellcheck": false
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "file_blocks",
    "tooltip": "%{BKY_FILE_SAVE_TOOLTIP}"
  },
  // Block for loading an object from a file.
  {
    "type": "file_load",
    "message0": "%{BKY_FILE_LOAD}",
    "args0": [
      {
        "type": "input_value",
        "name": "OBJECT"
      },
      {
        "type": "field_input",
        "name": "FILENAME",
        "text": "%{BKY_FILE_DEFAULT_NAME}",
        "spellcheck": false
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "file_blocks",
    "tooltip": "%{BKY_FILE_LOAD_TOOLTIP}"
  }
]);
