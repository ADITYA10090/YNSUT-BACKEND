const { Configuration, NopeCHAApi } = require('nopecha');

const configuration = new Configuration({
    apiKey: 'YOUR_API_KEY',
});
const nopecha = new NopeCHAApi(configuration);

(async () => {
    // Call the Recognition API
    const text = await nopecha.solveRecognition({
        type: 'textcaptcha',
        image_urls: ['https://www.imsnsit.org/imsnsit/images/captcha/captcha_1711195831.jpg'],
    });

    // Print the text to type
    console.log(text);
})();