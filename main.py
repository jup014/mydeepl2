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
    
def translate():
    # API Request    
    url = 'https://api-free.deepl.com/v2/translate'
    params = {
        'auth_key': api_key,
        'text': text,
        'target_lang': 'KO'
    }
    response = requests.get(url, params=params)
    result = response.json()
    # set the result text in the result text area
    st.session_state.result_text = result['translations'][0]['text']    

    # Copy text to clipboard
    # Put a checkbox next to the button
    if checkbox:
        clipboard_text = text + "\n\n" + result['translations'][0]['text']
    else:
        clipboard_text = result['translations'][0]['text']
    # Copy to clipboard
    pyperclip.copy(clipboard_text)

# Make the GUI structure first

# Title
st.title('My DeepL')

# Text Input
st.text_input('DeepL API Key', api_key)

# Text Area
text = st.text_area('Original Text', 'Hello World')

# create a button and a checkbox
st.button('Translate', key='translate_button', on_click=translate)
checkbox = st.checkbox('Concatenate the translation after the original', True, key='checkbox')

# Result Text paragraph and name it to use later
result_text = st.text_area('Translated Text', "", key='result_text')
