// 
// Description:
//  - This file contains the main logic of the extension.
//  - It is responsible for handling user input and calling the DeepL API.
//  - It also handles the concatenation of paragraphs and copying the result to the clipboard.
document.getElementById("translateButton").addEventListener("click", function() {
    // Get user input
    var apiKey = document.getElementById("apiKey").value;
    var originalText = document.getElementById("originalText").value;
    var concatenate = document.getElementById("concatenateCheckbox").checked;
    var translateParagraph = document.getElementById("translateParagraphCheckbox").checked;

    // Split the text into paragraphs if concatenate and translateParagraph are both true
    var paragraphs = concatenate && translateParagraph 
        ? originalText.split('\n').filter(Boolean)
        : [originalText];

    // Translate each paragraph and concatenate the result if concatenate is true
    var translatedText = '';

    paragraphs.forEach((paragraph, index) => {
        var url = 'https://api-free.deepl.com/v2/translate';
        var params = {
            'auth_key': apiKey,
            'text': paragraph,
            'target_lang': 'KO'
        };
        
        // Call DeepL API
        fetch(url + '?' + new URLSearchParams(params), {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            // Get the translated text
            var result = data['translations'][0]['text'];

            // Concatenate the translated text with the original text
            if(concatenate){
                // Add the original text and the translated text to the textarea
                translatedText += `${paragraphs[index]}\n\n${result}\n\n`;
            }else{
                // Add the translated text to the textarea
                translatedText += `${result}\n\n`;
            }
            // Add the translated text to the div element. Wrap each paragraph with <p> tag
            document.getElementById("translatedText").innerHTML = translatedText.split('\n').filter(Boolean).map((paragraph) => `<p>${paragraph}</p>`).join('');
            // Copy the translated text to the clipboard
            navigator.clipboard.writeText(translatedText);
        })
        .catch((error) => {
            console.error('Error:', error);

        });
    });
});

// Disable translateParagraphCheckbox when concatenateCheckbox is unchecked
document.getElementById("concatenateCheckbox").addEventListener("change", function() {
    document.getElementById("translateParagraphCheckbox").disabled = !this.checked;
});
