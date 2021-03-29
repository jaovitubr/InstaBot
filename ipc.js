const puppeteer = require('puppeteer');

const login = require('./modules/login.js');
const goToPost = require('./modules/goToPost.js');
const comment = require('./modules/comment');

module.exports = (ipc, window) => {
  ipc.on("start", async (event, config, messages) => {
    try {
      window.webContents.send("starting");

      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
      });

      const page = (await browser.pages())[0];

      window.webContents.send("wait_auth");
      await login(page);

      window.webContents.send("logged");
      await goToPost(page, config.url);

      window.webContents.send("loaded");
      await comment(page, messages, config.max_comments, config.delay, (args) => {
        window.webContents.send("message-sended", args);
      });

      page.close();
      window.webContents.send("finished");
    } catch (error) {
      window.webContents.send("error", error.toString());
    }
  });
}