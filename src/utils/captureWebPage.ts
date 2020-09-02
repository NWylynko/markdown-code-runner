import puppeteer from "puppeteer";

const captureWebPageScreenShot = async (url: string, path: string) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const dimensions = await page.evaluate(() => {
      return {
        // plus 16 for the 8px margin from the body tag
        width: document.getElementById("app").offsetWidth + 16,
        height: document.getElementById("app").offsetHeight + 16,
      };
    });

    await page.screenshot({
      path,
      clip: { x: 0, y: 0, ...dimensions },
      omitBackground: true
    });

    await browser.close();

    return true;
  } catch (error) {
    throw new Error(`failed to screenshot, error: ${error}`)
  }
};

export default captureWebPageScreenShot