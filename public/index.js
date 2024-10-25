
const btn = document.getElementById("btn")
const btnL = document.getElementById("btnL")
let dataArray;
btn?.addEventListener("click", async ()=>{
    console.log("hi");
    try {
        // const linkresponse = await axios.get("http://localhost:5000/getcaptcha")
        // const jsonString =JSON.stringify(linkresponse)
        // const jsonData = JSON.parse(jsonString);
        // link = jsonData.data.data;
        // console.log(link);
        
        console.log("Recognizing")
        const response = await axios.get("http://localhost:5000/getcaptcha")
        // const imageUrl=URL.createObjectURL(response.data);
        document.getElementById('imgtagz').src='data:image/jpeg;base64,' + response.data;
        // const jsonString2 =JSON.stringify(response)
        // const jsonData2 = JSON.parse(jsonString2);
        // const dataArray = jsonData2.data.data;
        // console.log(dataArray)
        // const response=await axios.get('http://localhost:5000/sendcaptcha')
        // console.log('POINT2')
        // await axios.get('http://localhost:5000/attendance')
        // const jsonString2 =JSON.stringify(response)
        // const jsonData2 = JSON.parse(jsonString2);
        // const dataArray = jsonData2.data.data;
        // console.log(dataArray);
        // document.getElementById('Yoga').innerHTML=dataArray[0]
        // document.getElementById('ADC').innerHTML=dataArray[1]
        // document.getElementById('OS').innerHTML=dataArray[2]
        // document.getElementById('DAA').innerHTML=dataArray[3]
        // document.getElementById('SE').innerHTML=dataArray[4]
        // document.getElementById('CN').innerHTML=dataArray[5]
        // console.log(recog);
    } catch (error) {
        console.log(error);
    }
})
let otp;
let U;
let P;
async function handleInputChange(){
        otp=document.getElementById("OTPINPUT").value;
}
async function handleUserChange(){
    U=document.getElementById("UserInput").value;
}
async function handlePassChange(){
    P=document.getElementById("PassInput").value;
}
const btn2 = document.getElementById("btn2");

btnL?.addEventListener("click",async()=>{
    try {
        await axios.post('http://localhost:5000/credentials',{U,P});
    } catch (error) {
        console.log(error)
    }
})
btn2?.addEventListener("click",async ()=>{
    console.log("hello");
    try {
        console.log(otp);
        await axios.post('http://localhost:5000/sendcaptcha',{otp})
        const response=await axios.get('http://localhost:5000/attendance')
        const jsonString =JSON.stringify(response)
        const jsonData = JSON.parse(jsonString);    
        const dataArray = jsonData.data.data;
        console.log(dataArray);
        document.getElementById('Yoga').innerHTML=dataArray[0]
        document.getElementById('ADC').innerHTML=dataArray[1]
        document.getElementById('OS').innerHTML=dataArray[2]
        document.getElementById('DAA').innerHTML=dataArray[3]
        document.getElementById('SE').innerHTML=dataArray[4]
        document.getElementById('CN').innerHTML=dataArray[5]
        
    } catch (error) {
        console.log(error);
    }
})

const btn0=document.getElementById('try');

btn0?.addEventListener("click", async ()=>{
    console.log("heay");
    try {
        const linkresponse = await axios.get("http://localhost:5000/something")
        console.log(linkresponse);
    } catch (error) {
        console.log(error);
    }
})





