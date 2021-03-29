const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Mantenha uma referência global do objeto window, caso contrário, a janela será
// fechado automaticamente quando o objeto JavaScript for coletado como lixo.
let window

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    height: 630,
    minWidth: 700,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
    backgroundColor: '#323232',
    icon: path.join(__dirname, 'src/images/icon.ico'),
    hasShadow: true,
    show: false
  })

  require("./ipc")(ipcMain, window);

  // and load the index.html of the app.
  window.loadFile('src/pages/index.html')

  window.once('ready-to-show', () => {
    window.show()
  })

  // Abra o DevTools.
  // window.webContents.openDevTools()

  // Emitido quando a janela é fechada.
  window.on('closed', function () {
    // Desreferencia o objeto window, normalmente você armazena janelas
    // em uma matriz, se o seu aplicativo suportar várias janelas, este é o momento
    // quando você deve excluir o elemento correspondente.
    window = null
  })
}

// Este método será chamado quando o elétron terminar
// inicialização e está pronto para criar janelas do navegador.
// Algumas APIs podem ser usadas apenas após a ocorrência deste evento.
app.on('ready', createWindow)

// Saia quando todas as janelas estiverem fechadas.
app.on('window-all-closed', function () {
  // No macOS, é comum os aplicativos e sua barra de menus
  // permanece ativo até que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // No macOS, é comum recriar uma janela no aplicativo quando o
  // o ícone do dock é clicado e não há outras janelas abertas.
  if (window === null) createWindow()
})

app.on('web-contents-created', (e, contents) => {
  contents.on('new-window', (e, url) => {
    e.preventDefault();
    require('open')(url);
  });
  contents.on('will-navigate', (e, url) => {
    if (url !== contents.getURL()) e.preventDefault(), require('open')(url);
  });
});

ipcMain.on("app-close", () => {
  app.quit();
})

ipcMain.on("app-relaunch", () => {
  app.relaunch();
  app.quit();
})