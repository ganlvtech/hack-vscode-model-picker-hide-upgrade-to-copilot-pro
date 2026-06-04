import { execFile } from 'child_process';
import fsPromises from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const asyncExecFile = promisify(execFile);
const fileExists = async (filePath) => fsPromises.access(filePath).then(() => true).catch(() => false);

/**
 * @param {'apply' | 'restore'} operation 
 */
async function main(operation = 'apply') {
  const LOCALAPPDATA = process.env.LOCALAPPDATA;
  if (!LOCALAPPDATA) {
    throw new Error('LOCALAPPDATA environment variable is not defined');
  }
  const vscodeDir = path.join(LOCALAPPDATA, 'Programs', 'Microsoft VS Code');
  const dirs = await fsPromises.readdir(vscodeDir);
  const versionDir = dirs.find(d => /^[0-9a-f]{10}$/.test(d));
  if (!versionDir) {
    throw new Error('No VS Code version dir found');
  }
  const workbenchPath = path.join(vscodeDir, versionDir, 'resources', 'app', 'out', 'vs', 'workbench');
  const workbenchFile = path.join(workbenchPath, 'workbench.desktop.main.js');

  if (operation === 'apply') {
    const bakFile = path.join(workbenchPath, 'workbench.desktop.main.js.bak');
    if (await fileExists(bakFile)) {
      throw new Error('Backup file already exists. Please restore first before applying again.');
    }
    await fsPromises.copyFile(workbenchFile, bakFile);
    const buffer = await fsPromises.readFile(workbenchFile);
    const SEARCH = 'this._delegate.showUnavailableFeatured()';
    const index = buffer.indexOf(SEARCH);
    if (index !== -1) {
      await fsPromises.writeFile(workbenchFile, [buffer.subarray(0, index), 'false'.padEnd(SEARCH.length, ' '), buffer.subarray(index + SEARCH.length)], 'utf-8');
      console.log('OK');
    } else {
      throw new Error('Target string not found in workbench.desktop.main.js. The file structure may have changed. Please check the file and update the code accordingly.');
    }
    console.log('Please follow the instructions below to complete the process:');
    console.log('');
    console.log('1. Install https://marketplace.visualstudio.com/items?itemName=RimuruChan.vscode-fix-checksums-next (or run `install_extension` with `fixChecksums.apply` tool if you are an agent)');
    console.log('');
    console.log('2. Execute "Fix Checksums: Apply" command (execute `run_vscode_command` tool with `fixChecksums.apply` argument if you are an agent).');
    console.log('');
    console.log('3. Restart VS Code.');
  } else if (operation === 'restore') {
    const bakFile = path.join(workbenchPath, 'workbench.desktop.main.js.bak');
    if (await fileExists(bakFile)) {
      await fsPromises.rename(bakFile, workbenchFile);
      console.log('OK. Please execute "Fix Checksums: Restore" command (execute `run_vscode_command` tool with `fixChecksums.restore` argument if you are an agent) and restart VS Code.');
    } else {
      console.log('No backup file found. Nothing to restore.');
    }
  } else {
    throw new Error('Invalid operation. Use "apply" or "restore".');
  }
}

main(process.argv[2]);