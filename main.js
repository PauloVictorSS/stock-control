const { app, BrowserWindow } = require('electron')


const createWindow = async () => {

    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })

    mainWindow.removeMenu()
    mainWindow.loadURL(`file://${__dirname}/src/index.html`)
}


app.whenReady().then(createWindow)