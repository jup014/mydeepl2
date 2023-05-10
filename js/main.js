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

    // Create an empty array of translated paragraphs as the same length as the original paragraphs
    var translatedParagraphs = new Array(paragraphs.length);
    // Initialize all elements of the array to empty string
    translatedParagraphs.fill('');

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
            // Add the translated text to the array of translated paragraphs
            translatedParagraphs[index] = result;

            // Form a concatenated, translated text with the original text
            if(concatenate){
                translatedText = '';
                if (translateParagraph){
                    // Form a concatenated, translated text with the original text
                    for (let i = 0; i < translatedParagraphs.length; i++) {
                        translatedText += `${paragraphs[i]}\n\n${translatedParagraphs[i]}\n\n`;
                    }
                } else {
                    // Form a concatenated text, all the original texts come first, then all the translated texts come next
                    for (let i = 0; i < paragraphs.length; i++) {
                        translatedText += `${paragraphs[i]}\n\n`;
                    }
                    for (let i = 0; i < translatedParagraphs.length; i++) {
                        translatedText += `${translatedParagraphs[i]}\n\n`;
                    }
                }
            }else{
                // Form a translated text with the original text
                translatedText = result;
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
