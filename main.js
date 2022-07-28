const { app, BrowserWindow } = require('electron')

const createWindow = async () => {

    let mainWindow = new BrowserWindow({
        minWidth: 950,
        width: 1250,
        minHeight: 800,
        height: 800,
        icon: __dirname + "/src/img/logo.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadURL(`file://${__dirname}/src/index.html`)
}


app.whenReady().then(createWindow)