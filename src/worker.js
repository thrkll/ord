const color = {
  red: "\x1b[38;5;168m",
  green: "\x1b[38;5;151m",
  blue: "\x1b[38;5;152m",
  grey: "\x1b[38;5;249m",
  reset: "\x1b[0m",
};

const messages = {
  not_found : `\n  ${color.blue}Ekkert fannst${color.reset}\n\n`,
  network_error : `\n  ${color.blue}Gat ekki tengst.${color.reset}\n\n`
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.split('/');
  const word = path.slice(-1)[0];
  const userAgent = request.headers.get('User-Agent') || '';

  switch (path[1]) {
    case 'b':
      return handleBPath(word, userAgent);
    case 't':
      return handleTPath(word, userAgent);
    default:
      return handleDefaultPath(word, userAgent);
  }
}

async function handleDefaultPath(word, userAgent) {
  return userAgent.includes('curl') ? 
    await fetchWordData(word) : 
    Response.redirect(`https://islenskordabok.arnastofnun.is/leit/${word}/ofl/n?synafyrstu`, 301);
}

async function handleBPath(word, userAgent) {
  return userAgent.includes('curl') ?
    textResponse(`\n  ${color.blue}Engar upplýsingar fást með orð.is/b/${color.reset} \n`) :
    Response.redirect(`https://bin.arnastofnun.is/leit/beygingarmynd/${word}`, 301);
}

async function handleTPath(word, userAgent) {
  return userAgent.includes('curl') ? 
    await fetchTranslations(word) :
    Response.redirect(`https://islex.arnastofnun.is/is/leit/${word}`, 301);
}

async function fetchWordData(word) {
  let apiUrl = `https://malid.is/api_proxy/${word}`;
  let apiResponse = await fetch(apiUrl);

  if (apiResponse.ok) {
    let jsonData = await apiResponse.json();

    if (jsonData.malid.kata.length > 0) {
      return formatResponse(jsonData.malid.kata);
    }

    if (jsonData.malid.kata.length === 0 && jsonData.malid.beygingar.length > 0) {
      for (const beygingarItem of jsonData.malid.beygingar) {
        for (const flettur of beygingarItem.flettur) {
          apiUrl = `https://malid.is/api_proxy/${flettur.lemma}`;
          apiResponse = await fetch(apiUrl);
          jsonData = await apiResponse.json();

          if (jsonData.malid.kata.length > 0) {
            return formatResponse(jsonData.malid.kata);
          }
        }
      }
    }

    return textResponse(`${messages.not_found}`, 404);
  } else {
    return textResponse(`${messages.network_error}`, apiResponse.status);
  }
}

async function fetchTranslations(word) {
  let apiUrl = `https://malid.is/api_proxy/${word}`;
  let response = await fetch(apiUrl);

  if (!response.ok) {
    return textResponse(`${messages.network_error}`, response.status);
  }

  let jsonData = await response.json();

  if (jsonData.malid.kata && jsonData.malid.kata.length > 0) {
    return textResponse(formatTranslations(jsonData));
  } else {
    if (jsonData.malid.beygingar && jsonData.malid.beygingar.length > 0) {
      const baseForm = jsonData.malid.beygingar[0].flettur[0].lemma;
      apiUrl = `https://malid.is/api_proxy/${baseForm}`;
      response = await fetch(apiUrl);
      jsonData = await response.json();

      if (jsonData.malid.kata && jsonData.malid.kata.length > 0) {
        return textResponse(formatTranslations(jsonData));
      }
    }
    
    return textResponse(`${messages.not_found}`, 404);
  }
}

function formatResponse(kataItems) {
  const maxLineLength = 79;
  const indentSize = 6;
  let responseText = "";

  kataItems.forEach((kataItem) => {
    const { fletta, ordflokkur } = kataItem;
    let skyringar = getSkyringar(kataItem);

    responseText += `\n  ${color.red}${fletta}${color.reset} • ${color.green}${ordflokkur}${color.reset}\n\n`;
    skyringar.forEach(sky => {
      const wrappedSky = wrapText(sky, maxLineLength - indentSize, indentSize);
      responseText += `    ${color.blue}→${color.reset} ${wrappedSky}\n`; 
    });
  });

  responseText += '\n';
  return textResponse(responseText);
}

function getSkyringar(kataItem) {
  let skyringar;
  if (kataItem.lidur.length > 0) {
    skyringar = kataItem.lidur.map(lidurItem => lidurItem.skyring.map(skyring => skyring.skyring)).flat();
  } else {
    skyringar = kataItem.skyring.map(skyring => skyring.skyring);
  }
  return skyringar;
}

function wrapText(text, lineLength, indent) {
  const words = text.split(' ');
  let wrappedText = '';
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length > lineLength) {
      wrappedText += currentLine.trim() + '\n' + ' '.repeat(indent);
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });

  return wrappedText + currentLine.trim();
}

function formatTranslations(jsonData) {
  let translationText = '';

  jsonData.malid.kata.forEach(kataItem => {
    translationText += `\n  ${color.red}${kataItem.fletta}${color.reset} • ${color.green}${kataItem.ordflokkur}${color.reset}\n\n`;

    const languages = ['norska', 'danska', 'saenska', 'faereyska', 'finnska', 'nynorsk', 'franska', 'thyska'];

    languages.forEach(lang => {
      if (jsonData.malid[lang] && jsonData.malid[lang].length > 0) {
        const relevantTranslations = jsonData.malid[lang].filter(entry => entry.id === kataItem.id);

        if (relevantTranslations.length > 0) {
          relevantTranslations.forEach((entry, index) => {
            if (entry.lidir && entry.lidir.length > 0) {
              entry.lidir.forEach((lid, lidIndex) => {
                if (lid.target_lang) {
                  const translation = lid.target_lang;
                  const context = lid.zmerking ? ` ${lid.zmerking}` : '';
                  
                  if (index === 0 && lidIndex === 0) {
                    translationText += `    ${color.blue}→ ${languageMap(lang)}${color.reset}  ${translation}${color.grey}${context}${color.reset}\n`;
                  } else {
                    translationText += `          ${translation}${color.grey}${context}${color.reset}\n`;
                  }
                }
              });
            } else if (entry.merking && entry.merking.length > 0) {
              entry.merking.forEach((mk, mkIndex) => {
                if (mk.target_lang) {
                  const translation = mk.target_lang;
                  
                  if (index === 0 && mkIndex === 0) {
                    translationText += `    ${color.blue}→ ${languageMap(lang)}${color.reset}  ${translation}\n`;
                  } else {
                    translationText += `          ${translation}\n`;
                  }
                }
              });
            }
          });
        }
      }
    });

    translationText += '\n';
  });

  return translationText;
}

function languageMap(langCode) {
  const languageNames = {'franska': 'FR', 'thyska': 'DE', 'danska': 'DA', 'saenska': 'SV', 'faereyska': 'FO', 'finnska': 'FI', 'norska': 'NO','nynorsk': 'NN'};
  return languageNames[langCode] || langCode;
}

function textResponse(content, status = 200) {
  return new Response(content, {
    status: status,
    headers: { 'Content-Type': 'text/plain' }
  });
}