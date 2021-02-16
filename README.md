# Blockly-App

Blockly-App is a visual programming editor based on Blockly, and built on Electron. We designed it to make everyone can easily build AI to play games.

## Downloads

Pre-built installers of latest release can be downloaded from the links below.

#### Windows 64-bit

[![](https://img.shields.io/badge/EXE%20Installer-v1.1.0-red)](https://github.com/jason53415/blockly-app/releases/download/v1.1.0/blockly-app-win32-x64-1.1.0.exe)
#### macOS 64-bit

[![](https://img.shields.io/badge/DMG%20Installer-v1.1.0-blue)](https://github.com/jason53415/blockly-app/releases/download/v1.1.0/blockly-app-darwin-x64-1.1.0.dmg) 

## Building

To build Blockly-App from source you'll need [Git](https://git-scm.com), [Python 3.6+](https://www.python.org/) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone --recursive https://gitlab.com/mlgame-platform/blockly-app.git
# Go into the repository
cd blockly-app
# Install Python dependencies
pip install -r requirements.txt
# Install Node.js dependencies
npm install
# Build Python executable
npm run make-py
# Build Blockly-App executable
npm run make
```
The built executables can be found in the `out` directory.