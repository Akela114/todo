export const formatNounByNumber = (
  number: number | bigint,
  nouns: [string, string, string],
) => {
  if (typeof number === "number") {
    const roundedNumber = Math.floor(number);

    if (roundedNumber % 100 >= 11 && roundedNumber % 100 <= 19) return nouns[2];
    if (roundedNumber % 10 === 1) return nouns[0];
    if (roundedNumber % 10 >= 2 && roundedNumber % 10 <= 4) return nouns[1];
    return nouns[2];
  }

  if (number % BigInt(100) >= BigInt(11) && number % BigInt(100) <= BigInt(19))
    return nouns[2];
  if (number % BigInt(10) === BigInt(1)) return nouns[0];
  if (number % BigInt(10) >= BigInt(2) && number % BigInt(10) <= BigInt(4))
    return nouns[1];
  return nouns[2];
};

export const formatNumberWithNoun = (
  number: number | bigint,
  nouns: [string, string, string],
) => {
  return `${number} ${formatNounByNumber(number, nouns)}`;
};
