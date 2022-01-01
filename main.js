const { app, BrowserWindow } = require('electron')


const createWindow = async () => {

    let mainWindow = new BrowserWindow({
        minWidth: 950,
        width: 950,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(`file://${__dirname}/src/index.html`)
}


app.whenReady().then(createWindow)