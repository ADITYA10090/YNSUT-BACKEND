import express from 'express'
import prompt from "prompt"
import puppeteer from 'puppeteer'
import cors from 'cors';
const app = express()
let link;
app.use(cors());

app.use(express.static('./public'))
const port = process.env.PORT || 5000;
app.get('/captchareq',(req,res)=>{
  res.json({data:link})
})
app.get('/attendance',(req,res)=>{
    
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const delay = (time) => {
  return new Promise(res => {
    setTimeout(res,time)
  })
}
async function imagepart(link){
  const browser2=await puppeteer.launch({
    headless:false,
  });
  const page2 = await browser2.newPage();
  await page2.goto(link);

}

async function reroute(){
  try {
  let num= randomNumber(10,100)
  const browser=await puppeteer.launch({
    headless:true,
    slowMo:num
  });
  const page = await browser.newPage();

  // await page.goto('https://www.google.com',{waitUntil:'networkidle0'});

  await page.goto('https://www.imsnsit.org',{waitUntil:'networkidle0'});

  await page.goto('https://www.imsnsit.org/imsnsit/student.htm',{waitUntil:'networkidle0'});
  // await page.waitForNavigation({waitUntil:'networkidle0'})
  const f = await page.$("frame[name='banner']")
  const frame = await f.contentFrame();
  // await delay(1000);
 
  await frame.$eval('#uid', el => el.value = '2022UIT3054');
  await frame.$eval('#pwd', el => el.value = 'wrchb~0');
  link=await frame.$eval('#captchaimg', el => el.src);
  
  await delay(100);

  imagepart(link)

  const credentials = await new Promise((resolve, reject) => {
    prompt.get(['passcode'], (error, result) => {
      resolve(result);
    });
  });

  const pass = credentials.passcode
  
  // app.post('/captchares',(req,res)=>{
  //    const otp=req.body
  //    frame.type("#cap",otp);
  // })
  await frame.type("#cap",pass);
  
  await frame.click('#login')
  
  await frame.waitForNavigation()
  await delay(500)
  await page.mouse.click(250,107)
  await delay(500)
  await page.mouse.click(17,327)
  await delay(500)
  await page.mouse.click(64,350)
  await delay(600)
  
    const f2 = await page.$("frame[name='data']")
    const frame2 = await f2.contentFrame();
    await delay(2000)
    
    await frame2.select('#year','2023-24')
    await frame2.select('#sem','4')
    await delay(300)
    await page.mouse.click(675,153)
    // await frame2.click('xpath=//*[@id="rep"]/table/tbody/tr/td/input[3]')
    await delay(500)

    const thTexts = await frame2.evaluate(() => {
      const thElements = document.querySelectorAll('div#myreport table.plum_fieldbig tr.plum_head th');
      return Array.from(thElements, th => th.textContent);
    });
    const attendanceArray = thTexts;
    // console.log(attendanceArray)
    await browser.close();
    return attendanceArray;
   
    
  } catch (error) {
    console.log(error)
    
  }
  
};

const arr=reroute();

let data2;


const data = arr.then((response)=>{
  res.json({data:response});
  console.log({data:response})
});


})

const start= async()=>{
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}
start();