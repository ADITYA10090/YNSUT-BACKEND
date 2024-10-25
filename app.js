document.getElementById('recognizeButton').addEventListener('click', function() {
    const imageUrl = document.getElementById('imageUrl').value;

    if (imageUrl.trim() === '') {
        alert('Please enter a valid URL');
        return;
    }

    Tesseract.recognize(
        imageUrl,
        'eng', // language
        { tessedit_char_whitelist: '0123456789' } // specify the whitelist of characters
    ).then(function(result) {
        document.getElementById('output').innerText = result.text;
    }).catch(function(error) {
        console.error('Error:', error);
        alert('Error occurred while recognizing the image');
    });
});