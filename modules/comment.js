module.exports = async (page, messages, max_comments, delay, onMsgCallback) => {
  let count = 0;
  const delay_ms = (parseInt(delay) || 1) * 1000;

  function Sleep(time_ms) {
    return new Promise((resolve) => setTimeout(resolve, time_ms));
  }

  function ChoiceRandomMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  async function CommentNewMessage() {
    const message = ChoiceRandomMessage();

    await page.waitForSelector('textarea[class="Ypffh"]');
    await page.click('textarea[class="Ypffh"]');

    await page.keyboard.type(message);

    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');

    // await page.waitForNavigation();

    count++;

    onMsgCallback({
      count,
      max: max_comments,
      message,
      delay: delay_ms,
    });

    if (count < max_comments) {
      await Sleep(delay_ms);
      await CommentNewMessage();
    }
  }

  await CommentNewMessage();
}