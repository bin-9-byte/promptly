const { app, BrowserWindow } = require('electron');
const path = require('path');

// 处理 Windows 安装/卸载时的快捷方式创建
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // 创建浏览器窗口
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // 简化开发，生产环境建议开启并使用 preload
        },
        icon: path.join(__dirname, '../public/icon.png') // 使用 PNG 图标
    });

    // 根据环境加载 URL 或文件
    if (!app.isPackaged) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // 生产环境加载打包后的文件
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
};

// 应用准备就绪时创建窗口
app.on('ready', createWindow);

// 所有窗口关闭时退出应用 (Windows/Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
