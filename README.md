# Hide Claude Opus 4.7 in VSCode Model Picker (Unavailable Featured Models, Upgrade to Copilot Pro+)

![AI Assisted](https://img.shields.io/badge/AI%20Assisted-No-red)
![Human Crafted](https://img.shields.io/badge/Human%20Crafted-100%25-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://choosealicense.com/licenses/mit/)

https://github.com/microsoft/vscode/issues/312960

## Usage

```bash
cd ~/.agents/skills

git clone https://github.com/ganlvtech/hack-vscode-model-picker-hide-upgrade-to-copilot-pro.git
cd hack-vscode-model-picker-hide-upgrade-to-copilot-pro/

node index.mjs apply
```

Currently only supports Windows, but feel free to contribute for other platforms.

## How it works

```bash
sed -i 's/this._delegate.showUnavailableFeatured()/false                                   /' "$LOCALAPPDATA/Programs/Microsoft VS Code/**********/resources/app/out/vs/workbench/workbench.desktop.main.js"
```
