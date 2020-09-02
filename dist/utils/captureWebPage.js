"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const captureWebPageScreenShot = async (url, path) => {
    try {
        const browser = await puppeteer_1.default.launch();
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
    }
    catch (error) {
        throw new Error(`failed to screenshot, error: ${error}`);
    }
};
exports.default = captureWebPageScreenShot;
