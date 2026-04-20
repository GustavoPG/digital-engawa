export interface KanjiEntry {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  romaji: string;
}

export const n5KanjiData: KanjiEntry[] = [
  { kanji: '一', onyomi: 'イチ, イツ', kunyomi: 'ひと, ひと.つ', meaning: 'Uno', romaji: 'Ichi' },
  { kanji: '二', onyomi: 'ニ', kunyomi: 'ふた, ふた.つ', meaning: 'Dos', romaji: 'Ni' },
  { kanji: '三', onyomi: 'サン', kunyomi: 'み, み.つ, みっ.つ', meaning: 'Tres', romaji: 'San' },
  { kanji: '四', onyomi: 'シ', kunyomi: 'よ, よ.つ, よっ.つ, よん', meaning: 'Cuatro', romaji: 'Shi / Yon' },
  { kanji: '五', onyomi: 'ゴ', kunyomi: 'いつ, いつ.つ', meaning: 'Cinco', romaji: 'Go' },
  { kanji: '六', onyomi: 'ロク', kunyomi: 'む, む.つ, むっ.つ', meaning: 'Seis', romaji: 'Roku' },
  { kanji: '七', onyomi: 'シチ', kunyomi: 'なな, なな.つ', meaning: 'Siete', romaji: 'Shichi / Nana' },
  { kanji: '八', onyomi: 'ハチ', kunyomi: 'や, や.つ, やっ.つ', meaning: 'Ocho', romaji: 'Hachi' },
  { kanji: '九', onyomi: 'キュウ, ク', kunyomi: 'ここの, ここの.つ', meaning: 'Nueve', romaji: 'Kyuu' },
  { kanji: '十', onyomi: 'ジュウ', kunyomi: 'とお, と', meaning: 'Diez', romaji: 'Juu' },
  { kanji: '百', onyomi: 'ヒャク', kunyomi: 'もも', meaning: 'Cien', romaji: 'Hyaku' },
  { kanji: '千', onyomi: 'セン', kunyomi: 'ち', meaning: 'Mil', romaji: 'Sen' },
  { kanji: '万', onyomi: 'マン, バン', kunyomi: 'よろず', meaning: 'Diez mil', romaji: 'Man' },
  { kanji: '円', onyomi: 'エン', kunyomi: 'まる.い', meaning: 'Yen, Círculo', romaji: 'En' },
  { kanji: '日', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び, -か', meaning: 'Día, Sol', romaji: 'Nichi' },
  { kanji: '月', onyomi: 'ゲツ, ガツ', kunyomi: 'つき', meaning: 'Mes, Luna', romaji: 'Getsu' },
  { kanji: '火', onyomi: 'カ', kunyomi: 'ひ, -び, ほ-', meaning: 'Fuego', romaji: 'Ka' },
  { kanji: '水', onyomi: 'スイ', kunyomi: 'みず', meaning: 'Agua', romaji: 'Sui' },
  { kanji: '木', onyomi: 'ボク, モク', kunyomi: 'き, こ-', meaning: 'Árbol, Madera', romaji: 'Moku' },
  { kanji: '金', onyomi: 'キン, コン', kunyomi: 'かね, かな-', meaning: 'Oro, Dinero', romaji: 'Kin' },
  { kanji: '土', onyomi: 'ド, ト', kunyomi: 'つち', meaning: 'Tierra, Suelo', romaji: 'Do' },
  { kanji: '年', onyomi: 'ネン', kunyomi: 'とし', meaning: 'Año', romaji: 'Nen' },
  { kanji: '時', onyomi: 'ジ', kunyomi: 'とき, -どき', meaning: 'Tiempo, Hora', romaji: 'Ji' },
  { kanji: '分', onyomi: 'ブン, フン, ブ', kunyomi: 'わ.ける, わ.かる', meaning: 'Minuto, Dividir', romaji: 'Bun' },
  { kanji: '半', onyomi: 'ハン', kunyomi: 'なか.ば', meaning: 'Mitad', romaji: 'Han' },
  { kanji: '人', onyomi: 'ジン, ニン', kunyomi: 'ひと, -り, -と', meaning: 'Persona', romaji: 'Jin' },
  { kanji: '男', onyomi: 'ダン, ナン', kunyomi: 'おとこ', meaning: 'Hombre', romaji: 'Dan' },
  { kanji: '女', onyomi: 'ジョ, ニョ', kunyomi: 'おんな, め', meaning: 'Mujer', romaji: 'Jo' },
  { kanji: '子', onyomi: 'シ, ス', kunyomi: 'こ, -こ', meaning: 'Niño', romaji: 'Shi' },
  { kanji: '父', onyomi: 'フ', kunyomi: 'ちち', meaning: 'Padre', romaji: 'Fu' },
  { kanji: '母', onyomi: 'ボ', kunyomi: 'はは, も', meaning: 'Madre', romaji: 'Bo' },
  { kanji: '本', onyomi: 'ホン', kunyomi: 'もと', meaning: 'Libro, Origen', romaji: 'Hon' },
  { kanji: '中', onyomi: 'チュウ', kunyomi: 'なか, うち, あた.る', meaning: 'Centro, Adentro', romaji: 'Chuu' },
  { kanji: '大', onyomi: 'ダイ, タイ', kunyomi: 'おお, おお.きい', meaning: 'Grande', romaji: 'Dai' },
  { kanji: '小', onyomi: 'ショウ', kunyomi: 'ちい.さい, こ-, お-', meaning: 'Pequeño', romaji: 'Shou' },
  { kanji: '上', onyomi: 'ジョウ, ショウ', kunyomi: 'うえ, -うえ, うわ-', meaning: 'Arriba', romaji: 'Jou' },
  { kanji: '下', onyomi: 'カ, ゲ', kunyomi: 'した, しも, もと', meaning: 'Abajo', romaji: 'Ka' },
  { kanji: '右', onyomi: 'ウ, ユウ', kunyomi: 'みぎ', meaning: 'Derecha', romaji: 'U' },
  { kanji: '左', onyomi: 'サ', kunyomi: 'ひだり', meaning: 'Izquierda', romaji: 'Sa' },
  { kanji: '犬', onyomi: 'ケン', kunyomi: 'いぬ, いぬ-', meaning: 'Perro', romaji: 'Ken / Inu' }
];
