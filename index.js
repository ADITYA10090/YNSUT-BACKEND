function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
let otp;
// const uniqueIds=[];
const btn = document.getElementById("btn")
btn?.addEventListener("click", async ()=>{
    console.log("hi");
    try {
        const response = await axios.get("http://localhost:5000/getcaptcha",{
            headers: {
                'X-Unique-Identifier': document.getElementById("uniqueID").value
              }
        })
        document.getElementById('imgtagz').src='data:image/jpeg;base64,' + response.data;
        
    } catch (error) {
        console.log(error);
    }
})

// async function handleInputChange(){
//         otp=document.getElementById("OTPINPUT").value;
// }
// async function handleIDChange(){
//     uniqueIds[randomNumber(10,10000)]=document.getElementById("uniqueID").value;
// }
const btn2 = document.getElementById("btn2");
btn2?.addEventListener("click",async ()=>{
    console.log("hello");
    try {
        console.log(document.getElementById("OTPINPUT").value);
        otp=document.getElementById("OTPINPUT").value;
        
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





