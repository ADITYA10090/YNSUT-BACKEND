import express, { response } from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("./public"));
const port = process.env.PORT || 5000;

function waitForCondition() {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      // Check the condition
      if (OK === true) {
        clearInterval(intervalId); // Stop the interval
        resolve("Condition is met!"); // Resolve the promise
      }
    }, 30); // Check every 30ms
  });
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const delay = (time) => {
  return new Promise((res) => {
    setTimeout(res, time);
  });
};

let browser;
async function getAttendance() {
  try {
    let num = randomNumber(10, 100);
    browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome"
          : puppeteer.executablePath(),
      headless: false,
      slownum: true,
    });
  } catch (error) {
    console.log(error);
  }
}
let page;
let frame;
let attendanceData;
let OK;
app.get("/getcaptcha", (req, res) => {
  async function getCaptcha() {
    page = await browser.newPage();
    await page.goto("https://www.imsnsit.org", { waitUntil: "networkidle0" });
    await page.goto("https://www.imsnsit.org/imsnsit/student.htm", {
      waitUntil: "networkidle0",
    });
    const frame_name = await page.$("frame[name='banner']");
    frame = await frame_name.contentFrame();
    const link = await frame.$eval("#captchaimg", (el) => el.src);
    console.log(link);
    const page2 = await browser.newPage();
    const viewSources = await page2.goto(link);

    fs.writeFile("./imgtes.jpg", await viewSources.buffer(), function (err) {
      if (err) {
        return console.log(err);
      }
    });
    fs.readFile("./imgtes.jpg", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const base64Images = Buffer.from(data).toString("base64");
        res.send(base64Images);
      }
    });

    await frame.$eval("#uid", (el) => (el.value = "2022UIT3054"));
    await frame.$eval("#pwd", (el) => (el.value = "wrchb~0"));
    await page2.close();
    await page.bringToFront();
    return;
  }
  const callFunc = getCaptcha();
});

app.post("/sendcaptcha", (req, res) => {
  async function g() {
    const { otp } = await req.body;
    let userId = "2022UIT3054";
    let password = "wrchb~0";
    // const [otp, userId, password] = d.split(" ");
    console.log(otp);
    await frame.$eval("#uid", (el) => (el.value = "2022UIT3054"));
    await frame.$eval("#pwd", (el) => (el.value = "wrchb~0"));
    await frame.type("#cap", otp);
    await frame.click("#login");
    // await page.waitForFrame('banner');
    // const frameHandleH = await page.waitForFrame(async (frame) => {
    //   return frame.name() === "banner";
    // });
    // await page.waitForSelector('frame[name="banner"]');

    const frameHandle = await page.$('frame[name="banner"]');

    const Currframe = await frameHandle.contentFrame();

    await Currframe.waitForSelector(
      "body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td:nth-child(5) > a",
      { visible: true }
    );

    await Currframe.click(
      "body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td:nth-child(5) > a"
    );
    // const frameHandleHa = await page.waitForFrame(async (frame) => {
    //   return frame.name() === "top";
    // });
    const NextframeHandle = await page.$('frame[name="top"]');
    const NextCurrframe = await NextframeHandle.contentFrame();
    // await NextCurrframe.waitForSelector("xpath=/html/body/div/ul/ul/li/div", {
    //   visible: true,
    // });
    await NextCurrframe.waitForSelector("#tree > ul > li > div", {
      visible: true,
    });
    await NextCurrframe.click("xpath=/html/body/div/ul/ul/li/div");
    // await NextCurrframe.waitForSelector(
    //   "xpath=/html/body/div/ul/ul/li/ul/li[1]/a/span",
    //   { visible: true }
    // );
    await NextCurrframe.waitForSelector(
      "#tree > ul > li > ul > li:nth-child(1) > a > span",
      { visible: true }
    );
    await NextCurrframe.click("xpath=/html/body/div/ul/ul/li/ul/li[1]/a/span");
    // const frameHandleHanj = await page.waitForFrame(async (frames) => {
    //   return frames.name() === "data";
    // });
    const dataFrameHandle = await page.$('frame[name="data"]');
    console.log("F Point");
    const dataFrame = await dataFrameHandle.contentFrame();
    await dataFrame.waitForSelector("#year", { visible: true });
    await dataFrame.select("#year", "2024-25");
    await dataFrame.select("#sem", "5");
    await dataFrame.click('input[name="submit"]');

    await delay(500);

    const thTexts = await dataFrame.evaluate(() => {
      const thElements = document.querySelectorAll(
        "div#myreport table.plum_fieldbig tr.plum_head th"
      );
      return Array.from(thElements, (th) => th.textContent);
    });
    console.log("hey");
    console.log(thTexts);
    OK = true;
    return thTexts;
  }
  attendanceData = g();
  res.send("Received data");
});

app.get("/attendance", (req, res) => {
  waitForCondition().then((result) => {
    console.log(result);
    console.log("Getting");
    const data = attendanceData.then((response) => {
      res.json({ data: response });
      console.log({ data: response });

      page.close();
    });
  });
});

getAttendance();

const start = async () => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();
