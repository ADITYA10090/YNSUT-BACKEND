import express from 'express'
import cluster from 'cluster';
import puppeteer from 'puppeteer'
 import os from 'os'
const numCPUs = os.cpus().length;
console.log(numCPUs);
let page;
let browser;
const app=express();
const PORT = 3000;
async function getAtt(){
 browser=await puppeteer.launch({
    headless:false,
    slowMo:10,
     });
}
getAtt();
app.get('/',(req,res)=>{
    async function foo(){
        console.log("Hello people");
        
        page=browser.newPage();
        (await page).goto('https://www.google.com/')
    }
    foo();
    res.send("Jolly")
    
})

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
   
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
   
    // This event is first when worker died
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  }
  else{
 
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    app.listen(PORT, err =>{
      err ? 
      console.log("Error in server setup") :
      console.log(`Worker ${process.pid} started`);
    });
  }