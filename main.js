const { app, BrowserWindow } = require('electron')


const createWindow = async () => {

    let mainWindow = new BrowserWindow({
        minWidth: 600,
        width: 900,
        height: 600
    })

    mainWindow.loadURL(`file://${__dirname}/src/index.html`)
}


app.whenReady().then(createWindow)