module.exports = async page => {
    await page.goto("https://www.instagram.com/accounts/login", {
        waitUntil: 'networkidle0',
        timeout: 60000
    });
    await page.waitForSelector('input[name="username"]');
    await page.waitForNavigation({ timeout: 120000 });
    await page.waitForSelector('html.logged-in');
}