import { CONECTORES } from "./constants";

export const getKeyWordsFromName = (nombre: string) => {
  const keyWords = nombre
    .split(" ")
    .filter((word) => !CONECTORES.includes(word));
  return keyWords;
};
