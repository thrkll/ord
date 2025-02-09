# orð.is

Easily navigate to Icelandic dictionary sites and perform direct word lookups from the terminal.

## How to use

`orð.is` provides quick redirection to the right Icelandic language resources offered by The Árni Magnússon Institute for Icelandic Studies.

- Typing `orð.is/word` in your browser directs you to the relevant entry in the *[Íslensk nútímamálsorðabók](https://islenskordabok.arnastofnun.is/um-verkefnid/)*
- Typing `orð.is/b/word` in your browser directs you to the relevant entry in *[The Database of Icelandic Morphology](https://bin.arnastofnun.is/)*.
- Typing `orð.is/t/word` in your browser directs you to the relevant entry in *[The ISLEX Project](https://islex.arnastofnun.is/is/about/)*,

## Dictionary Entries in the Terminal

Working on your PhD in Vim? Opening a browser is a slippery slope to watching cat videos for hours? Perfect! You can also search for dictionary entries right from the terminal. Simply use `curl` with `orð.is/word`.

<img src="/media/defaultHandler.gif" width="600">

If the word has multiple classifications, information for each classification is displayed in separate entries, along with its class.

## Translations in the Terminal

You can also find basic translations for words in several languages by calling `orð.is/t/word` from the terminal.

<img src="/media/tHandler.gif" width="600">

If a word has different meanings in the target language, these distinctions are indicated in parentheses.

## About the Project

This tool operates as a compact JavaScript script executed on a Cloudflare Worker, ensuring swift response times. Please note that this project is not affiliated with The Árni Magnússon Institute for Icelandic Studies.

## Source of Data and Attribution

All data retrieved and displayed by `orð.is` is sourced directly from the services provided by The Árni Magnússon Institute for Icelandic Studies without any responsibility or guarantee. 


## Licence

MIT License

Copyright (c) 2025 Þorkell Einarsson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


---

The recipient of data from DIM is required to accredit the right holder clearly in the user interface of all products based on the data. The following is hereby attributed: _The Database of Icelandic Morphology. The Árni Magnússon Institute for Icelandic Studies. Author and editor Kristín Bjarnadóttir_
