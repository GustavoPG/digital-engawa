export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface KanjiEntry {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  romaji: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples?: KanjiExample[];
}
