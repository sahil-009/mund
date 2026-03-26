const path = require('path');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');

let mainWindow;

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ========== File Operations ==========
const { dialog } = require('electron');
const fs = require('fs').promises;
const fsSync = require('fs');
const { exec, spawn } = require('child_process');

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'C++', extensions: ['cpp', 'cc', 'cxx', 'c', 'h', 'hpp'] },
      { name: 'Java', extensions: ['java'] },
      { name: 'JavaScript', extensions: ['js', 'jsx'] },
      { name: 'TypeScript', extensions: ['ts', 'tsx'] },
      { name: 'HTML', extensions: ['html', 'htm'] },
      { name: 'CSS', extensions: ['css', 'scss', 'less'] },
      { name: 'Text', extensions: ['txt', 'md'] },
    ],
  });

  if (!result.canceled) {
    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const language = getLanguageFromExtension(filePath);
    return { filePath, fileName, content, language };
  }
  return null;
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('save-file', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true, message: 'File saved successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('save-file-as', async (event, content) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'C++', extensions: ['cpp', 'cc', 'cxx', 'c', 'h', 'hpp'] },
      { name: 'Java', extensions: ['java'] },
      { name: 'JavaScript', extensions: ['js', 'jsx'] },
      { name: 'HTML', extensions: ['html', 'htm'] },
      { name: 'CSS', extensions: ['css', 'scss', 'less'] },
      { name: 'Text', extensions: ['txt', 'md'] },
    ],
  });

  if (!result.canceled) {
    await fs.writeFile(result.filePath, content, 'utf-8');
    return { success: true, filePath: result.filePath };
  }
  return { success: false };
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('list-files', async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const fileList = files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      path: path.join(dirPath, file.name),
    }));
    return { success: true, files: fileList };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// ========== Execution & Compilation ==========
let runningProcess = null;

ipcMain.handle('execute-command', async (event, command, args, cwd = null) => {
  return new Promise((resolve) => {
    const childProcess = spawn(command, args, {
      cwd: cwd || app.getAppPath(),
      shell: true,
    });

    runningProcess = childProcess;
    let output = '';
    let errorOutput = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
      mainWindow?.webContents.send('terminal-output', data.toString());
    });

    childProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      mainWindow?.webContents.send('terminal-output', data.toString());
    });

    childProcess.on('close', (code) => {
      runningProcess = null;
      mainWindow?.webContents.send('process-exit', { code, output, errorOutput });
      resolve({ code, output, errorOutput });
    });

    childProcess.on('error', (error) => {
      runningProcess = null;
      mainWindow?.webContents.send('terminal-output', `Error: ${error.message}`);
      resolve({ code: 1, output: '', errorOutput: error.message });
    });
  });
});

ipcMain.handle('compile-cpp', async (event, filePath) => {
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const outputName = fileName.replace(/\.(cpp|cc|cxx|c)$/, '');

  return new Promise((resolve) => {
    const compileCmd = `g++ -o ${outputName} ${fileName}`;
    const childProcess = spawn('bash', ['-c', compileCmd], { cwd: dirPath });

    runningProcess = childProcess;
    let output = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
      mainWindow?.webContents.send('terminal-output', data.toString());
    });

    childProcess.stderr.on('data', (data) => {
      output += data.toString();
      mainWindow?.webContents.send('terminal-output', data.toString());
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        mainWindow?.webContents.send('terminal-output', `\n✓ Compilation successful!\n`);
        // Auto-run after successful compilation
        const runCmd = `./${outputName}`;
        const runProcess = spawn('bash', ['-c', runCmd], { cwd: dirPath });
        runningProcess = runProcess;

        runProcess.stdout.on('data', (data) => {
          mainWindow?.webContents.send('terminal-output', data.toString());
        });

        runProcess.stderr.on('data', (data) => {
          mainWindow?.webContents.send('terminal-output', data.toString());
        });

        runProcess.on('close', (exitCode) => {
          runningProcess = null;
          mainWindow?.webContents.send('process-exit', { code: exitCode });
          resolve({ success: true, code: exitCode });
        });
      } else {
        runningProcess = null;
        mainWindow?.webContents.send('terminal-output', `\n✗ Compilation failed!\n`);
        mainWindow?.webContents.send('process-exit', { code });
        resolve({ success: false, code });
      }
    });
  });
});

ipcMain.handle('compile-java', async (event, filePath) => {
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const className = fileName.replace(/\.java$/, '');

  return new Promise((resolve) => {
    const compileCmd = `javac ${fileName}`;
    const childProcess = spawn('bash', ['-c', compileCmd], { cwd: dirPath });

    runningProcess = childProcess;
    let output = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
      mainWindow?.webContents.send('terminal-output', data.toString());
    });

    childProcess.stderr.on('data', (data) => {
      output += data.toString();
      mainWindow?.webContents.send('terminal-output', data.toString());
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        mainWindow?.webContents.send('terminal-output', `\n✓ Compilation successful!\n`);
        const runCmd = `java ${className}`;
        const runProcess = spawn('bash', ['-c', runCmd], { cwd: dirPath });
        runningProcess = runProcess;

        runProcess.stdout.on('data', (data) => {
          mainWindow?.webContents.send('terminal-output', data.toString());
        });

        runProcess.stderr.on('data', (data) => {
          mainWindow?.webContents.send('terminal-output', data.toString());
        });

        runProcess.on('close', (exitCode) => {
          runningProcess = null;
          mainWindow?.webContents.send('process-exit', { code: exitCode });
          resolve({ success: true, code: exitCode });
        });
      } else {
        runningProcess = null;
        mainWindow?.webContents.send('terminal-output', `\n✗ Compilation failed!\n`);
        mainWindow?.webContents.send('process-exit', { code });
        resolve({ success: false, code });
      }
    });
  });
});

ipcMain.handle('stop-process', () => {
  if (runningProcess) {
    runningProcess.kill();
    runningProcess = null;
    mainWindow?.webContents.send('terminal-output', '\n[Process stopped by user]\n');
    return { success: true };
  }
  return { success: false };
});

// ========== Utility Functions ==========
function getLanguageFromExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const languageMap = {
    '.cpp': 'cpp',
    '.cc': 'cpp',
    '.cxx': 'cpp',
    '.c': 'cpp',
    '.h': 'cpp',
    '.hpp': 'cpp',
    '.java': 'java',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.html': 'html',
    '.htm': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.less': 'less',
    '.md': 'markdown',
    '.txt': 'text',
  };
  return languageMap[ext] || 'text';
}

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

// Create application menu
const createMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New File', accelerator: 'CmdOrCtrl+N' },
        { label: 'Open File', accelerator: 'CmdOrCtrl+O' },
        { label: 'Open Folder', accelerator: 'CmdOrCtrl+K CmdOrCtrl+O' },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S' },
        { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S' },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Command Palette', accelerator: 'CmdOrCtrl+Shift+P' },
        { label: 'Toggle Terminal', accelerator: 'CmdOrCtrl+`' },
        { type: 'separator' },
        { label: 'Toggle DevTools', accelerator: 'F12' },
      ],
    },
    {
      label: 'Run',
      submenu: [
        { label: 'Run', accelerator: 'F5' },
        { label: 'Stop', accelerator: 'F7' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(createMenu);
