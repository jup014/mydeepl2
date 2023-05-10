import configparser
import streamlit as st
import pyperclip
import requests

# Config
config = configparser.ConfigParser()
config.read('config.ini')
# bring the API key from the config file if it exists
if 'API' in config and 'Key' in config['API']:
    api_key = config['API']['Key']
else:
    api_key = ''
    
def __request(paragraph, target_lang='KO'):
    url = 'https://api-free.deepl.com/v2/translate'
    api_key = st.session_state.api_key
    params = {
        'auth_key': api_key,
        'text': paragraph,
        'target_lang': target_lang
    }
    response = requests.get(url, params=params)
    result = response.json()
    
    return result['translations'][0]['text']

def translate():
    if checkbox2:
        # split the text by paragraph
        text_list = text.split("\n")
        # translate each paragraph
        result_list = []
        for paragraph in text_list:
            result_list.append(__request(paragraph))
        # concatenate the result
        if checkbox:
            final_result = ""
            for index, paragraph in enumerate(text_list):
                final_result += paragraph + "\n\n" + result_list[index] + "\n\n"
        else:
            final_result = "\n\n".join(result_list)
        # set the result text in the result text area
        st.session_state.result_text = final_result
        # Copy text to clipboard
        pyperclip.copy(final_result)
    else:
        result_text_str = __translate(text)
        
        if checkbox:
            result_text_str = text + "\n\n" + result_text_str
        else:
            result_text_str = result_text_str
        # set the result text in the result text area
        st.session_state.result_text = result_text_str
        # Copy text to clipboard
        pyperclip.copy(result_text_str)


# Make the GUI structure first

# Title
st.title('My DeepL')

# Text Input
st.text_input('DeepL API Key', api_key, key='api_key')

# Text Area
text = st.text_area('Original Text', 'Hello World')

# create a button and a checkbox
st.button('Translate', key='translate_button', on_click=translate)
checkbox = st.checkbox('Concatenate the translation after the original', True, key='checkbox')
checkbox2 = st.checkbox('Translate paragraph by paragraph', True, key='checkbox2')

# Result Text paragraph and name it to use later
result_text = st.text_area('Translated Text', "", key='result_text')

# Footer
st.header("Author")
st.markdown("Junghwan Park <ffee21@gmail.com>")
st.text("Ministry of Health and Welfare, Korea\nUniversity of California, San Diego")
st.text("")