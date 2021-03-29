module.exports = async (page, draw_url) => {
  await page.goto(draw_url, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
}