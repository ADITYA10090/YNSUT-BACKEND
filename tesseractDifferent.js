import express from 'express'
// import Tesseract from 'tesseract.js';
import prompt from "prompt"
import puppeteer from 'puppeteer'
import cors from 'cors'
import fs from 'fs'
import tesseract from 'node-tesseract-ocr'
let browser;
let page;
let link;
let frame;
let f;
let finaldata;
let texting;
let page2;
const config = {
  lang: "eng", // default
  oem: 3,
  psm: 12,
  tessedit_char_whitelist: '0123456789',
}
const app = express()
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(express.static('./public'))
const port = process.env.PORT || 5000;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  const delay = (time) => {
    return new Promise(res => {
      setTimeout(res,time)
    })
  }
  // async function imagepart(link){
  //   const browser2=await puppeteer.launch({
  //     headless:true,
  //   });
  //   const page2 = await browser2.newPage();
  //   await page2.goto(link);
  // }


async function getAttendance(){
    try {
        let num= randomNumber(10,100)
        browser=await puppeteer.launch({
        headless:false,
        slowMo:num
         });
    } catch (error) {
        console.log(error)
    }
}
app.get('/something',(req,res)=>{
  async function run() {
    try {
      page = await browser.newPage();
      // await page.goto('https://www.google.com',{waitUntil:'networkidle0'});
      await page.goto('https://www.imsnsit.org',{waitUntil:'networkidle0'});
      await page.goto('https://www.imsnsit.org/imsnsit/student.htm',{waitUntil:'networkidle0'});
      f = await page.$("frame[name='banner']")
      frame =  await f.contentFrame();
      link=await frame.$eval('#captchaimg', el => el.src);
      console.log(link);
      page2=await browser.newPage()
      let viewSource=await page2.goto(link);
      fs.writeFile("./imgtes.jpg",await viewSource.buffer(),function(err){
        if (err){
          return console.log(err)
        }
      })
      texting = await tesseract.recognize('imgtes.jpg',config)
      console.log("Result:", texting)
      f = await page.$("frame[name='banner']")
      frame =  await f.contentFrame();
     await frame.$eval('#uid', el => el.value = '2022UIT3054');
     await frame.$eval('#pwd', el => el.value = 'wrchb~0');
    //  await frame.$eval('#cap', el => el.value = texting);
     await frame.type("#cap",texting);
    //  await frame.click('#login')
    //  await page.waitForNavigation()
     await delay(500)
     await page.mouse.click(250,107)
     
     await delay(500)
     await page.mouse.click(17,327)
     await delay(500)
     await page.mouse.click(64,350)
     await delay(500)
     
    const f2 = await page.$("frame[name='data']")
    const frame2 = await f2.contentFrame()
    await delay(1000)
    
    await frame2.select('#year','2023-24')
    await frame2.select('#sem','4')
    await delay(500)
    await page.mouse.click(675,153)
    // await frame2.click('xpath=//*[@id="rep"]/table/tbody/tr/td/input[3]')
    await delay(500)

    const thTexts = await frame2.evaluate(() => {
      const thElements = document.querySelectorAll('div#myreport table.plum_fieldbig tr.plum_head th');
      return Array.from(thElements, th => th.textContent);
    });
    const attendanceArray = thTexts;
    // console.log(attendanceArray)
    // await browser.close();
    return attendanceArray;
    } catch (error) {
      console.log(error.message)
    }
  }
  finaldata=run()
    const data = finaldata.then((response)=>{
    console.log({data:response})
    res.json({data:response});

})
})
// app.get('/mlFunction',(req,res)=>{
//   async function mlFunc() {
//     try {
//       // const img = "https://www.imsnsit.org/imsnsit/images/captcha/captcha_1711166381.jpg"
//       const text = await tesseract.recognize('imgtes.jpg',config)
//       console.log("Result:", text)
//     } catch (error) {
//       console.log(error.message)
//     }
//   }
  
//   mlFunc()
// })
app.get('/getcaptcha',(req,res)=>{
    async function h(){
    page = await browser.newPage();
    // await page.goto('https://www.google.com',{waitUntil:'networkidle0'});
    await page.goto('https://www.imsnsit.org',{waitUntil:'networkidle0'});
    await page.goto('https://www.imsnsit.org/imsnsit/student.htm',{waitUntil:'networkidle0'});
    f = await page.$("frame[name='banner']")
    frame =  await f.contentFrame();
    link=await frame.$eval('#captchaimg', el => el.src);
    console.log(link);
    return link;
    }
    const arr=h();
    const data = arr.then((response)=>{
      res.json({data:response});
      // console.log({data:response})
    });
})

app.get('/sendcaptcha',(req,res)=>{
  
  async function g(){
    // const {otp}=await req.body
    // console.log(otp);
    f = await page.$("frame[name='banner']")
    frame =  await f.contentFrame();
     await frame.$eval('#uid', el => el.value = '2022UIT3054');
     await frame.$eval('#pwd', el => el.value = 'wrchb~0');
    //  await frame.$eval('#cap', el => el.value = texting);
     await frame.type("#cap",texting);
    //  await frame.click('#login')
     await page.waitForNavigation()
     await delay(3500)
     await page.mouse.click(250,107)
     await delay(500)
     await page.mouse.click(17,327)
     await delay(500)
     await page.mouse.click(64,350)
     await delay(500)
  
    const f2 = await page.$("frame[name='data']")
    const frame2 = await f2.contentFrame();
    await delay(1000)
    
    await frame2.select('#year','2023-24')
    await frame2.select('#sem','4')
    await delay(500)
    await page.mouse.click(675,153)
    // await frame2.click('xpath=//*[@id="rep"]/table/tbody/tr/td/input[3]')
    await delay(500)

    const thTexts = await frame2.evaluate(() => {
      const thElements = document.querySelectorAll('div#myreport table.plum_fieldbig tr.plum_head th');
      return Array.from(thElements, th => th.textContent);
    });
    const attendanceArray = thTexts;
    // console.log(attendanceArray)
    // await browser.close();
    return attendanceArray;
   
  }
    finaldata=g()
    const data = finaldata.then((response)=>{
    console.log({data:response})
    res.json({data:response});
})

})
app.get('/attendance',(req,res)=>{
  
  const data = finaldata.then((response)=>{
    res.json({data:response});
    console.log({data:response})
  });
})
getAttendance()

  const start= async()=>{
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}
start()