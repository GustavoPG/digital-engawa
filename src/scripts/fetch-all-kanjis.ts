import fs from 'fs';
import path from 'path';

// Local Kana to Romaji mapping and helper
function kanaToRomaji(kanaStr: string): string {
  if (!kanaStr) return '';
  const clean = kanaStr.replace(/[!\^\-\.]/g, '').trim();
  if (!clean) return '';

  const romajiMap: Record<string, string> = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',

    'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
    'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
    'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
    'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
    'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
    'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
    'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
    'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
    'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
    'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
    'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
    'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
    'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
    'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
    'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',

    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',

    'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
    'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
    'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
    'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
    'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
    'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
    'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
    'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
    'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
    'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
    'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo'
  };

  let result = '';
  let i = 0;
  while (i < clean.length) {
    if (i + 1 < clean.length) {
      const twoChar = clean.substring(i, i + 2);
      if (romajiMap[twoChar]) {
        result += romajiMap[twoChar];
        i += 2;
        continue;
      }
    }
    const oneChar = clean.charAt(i);
    if (oneChar === 'っ' || oneChar === 'ッ') {
      if (i + 1 < clean.length) {
        const nextChar = clean.charAt(i + 1);
        let nextRomaji = romajiMap[nextChar] || '';
        if (i + 2 < clean.length && romajiMap[clean.substring(i + 1, i + 3)]) {
          nextRomaji = romajiMap[clean.substring(i + 1, i + 3)];
        }
        if (nextRomaji) {
          result += nextRomaji.charAt(0);
        }
      }
      i++;
      continue;
    }
    if (oneChar === 'ー') {
      i++;
      continue;
    }
    result += romajiMap[oneChar] || oneChar;
    i++;
  }
  return result;
}

function buildRomaji(onyomiKana: string[], kunyomiKana: string[]): string {
  const onPart = onyomiKana
    .map(k => k.replace(/[\-\.]/g, ''))
    .map(kanaToRomaji)
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));
    
  const kunPart = kunyomiKana
    .map(k => {
      const parts = k.split('.');
      if (parts.length > 1) {
        return kanaToRomaji(parts[0]) + '(' + kanaToRomaji(parts[1]) + ')';
      }
      return kanaToRomaji(k.replace('-', ''));
    })
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  const allParts = [...onPart, ...kunPart];
  const uniqueParts = Array.from(new Set(allParts)).slice(0, 3);
  return uniqueParts.join(' / ');
}

function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

// Free Google Translate API helper (No key required, highly reliable)
async function translateToSpanish(textList: string[]): Promise<string[]> {
  if (textList.length === 0) return [];
  const text = textList.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    let translatedText = '';
    if (data && data[0]) {
      translatedText = data[0].map((item: any) => item[0]).join('');
    }
    
    // Split back and clean
    const translatedList = translatedText.split('\n').map((s: string) => s.trim());
    
    // Safety check to ensure we matching array sizes
    if (translatedList.length === textList.length) {
      return translatedList;
    }
    
    // If sizing mismatch, map one by one as fallback
    console.warn(`Translation alignment mismatch (${translatedList.length} vs ${textList.length}). Using slower direct translation fallback...`);
    const fallbackList: string[] = [];
    for (const t of textList) {
      const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(t)}`;
      const singleRes = await fetch(singleUrl);
      const singleData = await singleRes.json();
      const singleTrans = (singleData && singleData[0] && singleData[0][0]) ? singleData[0][0][0] : t;
      fallbackList.push(singleTrans.trim());
      await new Promise(r => setTimeout(r, 200)); // rate limit safety
    }
    return fallbackList;
  } catch (err: any) {
    console.error('Translation error:', err.message);
    // Return original text if translation fails completely
    return textList;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('--- DIGITAL ENGAWA: HIGH SPEED KANJI DATASET BUILDER ---');
  
  // 1. Load existing examples
  console.log('Loading existing datasets to preserve manually curated examples...');
  const existingExamples: Record<string, any[]> = {};
  const files = ['n5', 'n4', 'n3', 'n2', 'n1'];
  
  for (const f of files) {
    const filePath = path.resolve(`src/data/${f}.ts`);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const kanjiBlockRegex = /kanji:\s*'([^']+)'[\s\S]*?examples:\s*(\[[\s\S]*?\])/g;
        let match;
        while ((match = kanjiBlockRegex.exec(content)) !== null) {
          const kanji = match[1];
          const examplesStr = match[2];
          try {
            const evalExamples = new Function(`return ${examplesStr}`)();
            if (Array.isArray(evalExamples) && evalExamples.length > 0) {
              existingExamples[kanji] = evalExamples;
            }
          } catch (e) {}
        }
      } catch (err) {
        console.warn(`Could not parse examples from ${f}.ts:`, err);
      }
    }
  }
  console.log(`Preserved examples for ${Object.keys(existingExamples).length} kanjis.`);

  // 2. Fetch kanji.json database
  console.log('Downloading complete kanji-data database from GitHub...');
  const res = await fetch('https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json');
  if (!res.ok) {
    console.error('Failed to download kanji.json');
    process.exit(1);
  }
  const kanjiDb = await res.json();
  const allChars = Object.keys(kanjiDb);
  console.log(`Successfully loaded ${allChars.length} kanji records.`);

  // 3. Group by JLPT level
  const levels: Record<number, string[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] };
  for (const char of allChars) {
    const entry = kanjiDb[char];
    if (entry.jlpt_new >= 1 && entry.jlpt_new <= 5) {
      levels[entry.jlpt_new].push(char);
    }
  }

  // Process levels N5 -> N1
  const jlptLevels = [5, 4, 3, 2, 1];
  for (const lvl of jlptLevels) {
    console.log(`\n=== Processing JLPT N${lvl} (${levels[lvl].length} kanjis) ===`);
    const chars = levels[lvl];
    const results: any[] = [];
    
    // Batch translation in groups of 50 to avoid request URL length limits
    const batchSize = 50;
    for (let i = 0; i < chars.length; i += batchSize) {
      const batchChars = chars.slice(i, i + batchSize);
      console.log(`Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chars.length / batchSize)} (${batchChars.length} kanjis)...`);
      
      const englishMeanings = batchChars.map(c => {
        const raw = kanjiDb[c];
        return raw.meanings ? raw.meanings.slice(0, 2).join(', ') : 'Unknown';
      });

      const spanishMeanings = await translateToSpanish(englishMeanings);
      
      for (let k = 0; k < batchChars.length; k++) {
        const char = batchChars[k];
        const raw = kanjiDb[char];
        const meaning = spanishMeanings[k] || (raw.meanings ? raw.meanings[0] : 'Desconocido');
        
        const onyomi = (raw.readings_on || []).map(hiraganaToKatakana).join(', ');
        const kunyomi = (raw.readings_kun || []).join(', ');
        const romaji = buildRomaji(raw.readings_on || [], raw.readings_kun || []);

        const entry: any = {
          kanji: char,
          onyomi: onyomi || '-',
          kunyomi: kunyomi || '-',
          meaning: meaning,
          romaji: romaji || 'N/A',
          level: `N${lvl}`
        };

        if (existingExamples[char]) {
          entry.examples = existingExamples[char];
        }

        results.push(entry);
      }
      
      // Gentle throttle to avoid rate limiting
      await delay(800);
    }

    // Write updated dataset file
    const outputFilePath = path.resolve(`src/data/n${lvl}.ts`);
    console.log(`Writing ${results.length} kanjis to ${outputFilePath}...`);
    
    const fileContent = `import { KanjiEntry } from '../types/kanji';

export const n${lvl}KanjiData: KanjiEntry[] = ${JSON.stringify(results, null, 2)};
`;
    
    fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
    console.log(`Successfully completed JLPT N${lvl}!`);
  }

  console.log('\n--- ALL JLPT KANJI DATASETS COMPLETED SUCCESSFULLY! ---');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
});
