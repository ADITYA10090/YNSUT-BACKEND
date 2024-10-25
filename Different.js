import express, { response } from 'express'
import prompt from "prompt"
import puppeteer from 'puppeteer'
import cors from 'cors'
import fs from 'fs'
import tesseract from 'node-tesseract-ocr'
import { log } from 'console'
import { rejects } from 'assert'

const map=new Map();
let browser;
let page;
let link;
let frame;
let f;
let finaldata;
let texting;
let OK=false;
let finale;
let OTPvalue;
const pages=[];
const frames=[];
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
  const getImageData = () => {
    return new Promise((resolve, reject) => {
        // Read the image file into a buffer
        fs.readFile('./imgtes.jpg', (err, data) => { // Update path accordingly
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // Convert buffer data to base64 string
                const base64Image = Buffer.from(data).toString('base64');
                OK=true;
                delay(1500);
                resolve(base64Image);
            }
        });
    });
}
let n=0;
function generateNewNumber(){

}
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


const f_s=[];
const links=[];
const pages2=[];
const viewSources=[];
const base64Images=[];
const f2s=[];
const frame2s=[];
const thTexts=[];
const imageNames=[];
// const thElements=[];
const attendanceArray=[];
const finales=[];
const dataprocessed=[];

app.get('/getcaptcha',(req,res)=>{
    async function getCaptcha(){
    n=n+1;
    // n = generateNewNumber();
    map.set(n,req.headers['x-unique-identifier']);
    pages[n]=await browser.newPage();
    // page = await browser.newPage();
    // await page.goto('https://www.google.com',{waitUntil:'networkidle0'});
    await pages[n].goto('https://www.imsnsit.org',{waitUntil:'networkidle0'});
    await pages[n].goto('https://www.imsnsit.org/imsnsit/student.htm',{waitUntil:'networkidle0'});
    f_s[n] = await pages[n].$("frame[name='banner']")
    frames[n] =  await f_s[n].contentFrame();
    links[n]=await frames[n].$eval('#captchaimg', el => el.src);
    console.log(links[n]);
    pages2[n]=await browser.newPage()
    viewSources[n]=await pages2[n].goto(links[n]);
    fs.writeFile('./imgtes.jpg',await viewSources[n].buffer(),function(err){
        if (err){
          return console.log(err)
        }
      })
    fs.readFile('./imgtes.jpg', (err, data) => { 
        if (err) {
            console.log(err);
            // reject(err);
        } else {
             base64Images[n] = Buffer.from(data).toString('base64');
            res.send(base64Images[n])
        }
    })
    await frames[n].$eval('#uid', el => el.value = '2022UIT3054');
    await frames[n].$eval('#pwd', el => el.value = 'wrchb~0');
    await pages[n].bringToFront();
    return ;
    }
    const callfunc=getCaptcha();

    //wrchb~0
    //rpdqbd^
})
app.post('/sendcaptcha',(req,res)=>{
  async function g(){
    const {otp}=await req.body
    console.log(otp);
    OTPvalue=otp;

    await frames[n].type("#cap",OTPvalue);
    // await frames[n].$eval('#cap',el=>el.value=OTPvalue);
    await delay(500);
    await frames[n].click('#login')
    await delay(500)
    await pages[n].waitForSelector("frame[name='banner']");
    f_s[n] = await pages[n].$("frame[name='banner']")
    frames[n] =  await f_s[n].contentFrame();
    await delay(500);//
    // await frame.click('xpath=/html/body/table/tbody/tr[1]/td/table/tbody/tr[2]/td[1]/table/tbody/tr/td[5]/a')
    await frames[n].click('body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td:nth-child(5) > a')
    
     await delay(500)
     await pages[n].mouse.click(17,327)
     await delay(500)//
     await pages[n].mouse.click(64,350)
     await delay(500)
    console.log("POINT 2")

    f2s[n]=await pages[n].$("frame[name='data']")
    frame2s[n]=await f2s[n].contentFrame();
    await delay(500)

    await frame2s[n].select('#year','2024-25')
    await frame2s[n].select('#sem','5')
    await delay(500)
    await pages[n].mouse.click(675,153)

    await delay(500)

    thTexts[n] = await frame2s[n].evaluate(() => {
      const thElements = document.querySelectorAll('div#myreport table.plum_fieldbig tr.plum_head th');
      return Array.from(thElements, th => th.textContent);
    });
     attendanceArray[n] = thTexts[n];
    OK=true;
    console.log("hey");
    console.log(attendanceArray[n]);
    return attendanceArray[n];

  }
  finales[n]=g();  
  res.send("Received data");
  
})
app.get('/attendance',(req,res)=>{
  waitForCondition().then((result)=>{
    console.log(result);
    console.log("Getting");
    dataprocessed[n]=finales[n];
    const data = dataprocessed[n].then((response)=>{
    res.json({data:response});
    console.log({data:response})

    pages[n].close();
    pages2[n].close();

  });
})

})
getAttendance()

  const start= async()=>{
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}
start()