// Characters to be used to construct hash string
const hashChars = ["슈", "슉", ".", "!"];
// Characters of origianl string
const textChars = "abcdefghijklmnopqrstuvwxyz1234567890-";

// Calculate required character number for each caracter
let count = 1;
while (hashChars.length ** count < textChars.length) {
  count += 1;
}

// Generate array of hash unit with hashChar^count length
function getAllText(count) {
  if (count === 0) return [""];
  const list = [];
  for (let i = 0; i < hashChars.length; i++) {
    getAllText(count - 1).forEach((str) => {
      list.push(hashChars[i] + str);
    });
  }
  return list;
}

const hashUnits = getAllText(count);

// Get hash function(dictionary) that converts original char to a set of hash units
const hashFunction = new Array(textChars.length).fill(0).map(() => []);
hashUnits.forEach((x, i) => {
  hashFunction[i % textChars.length].push(x);
});

// Hash original string
function hash(str) {
  let hashString = "";
  for (let i = 0; i < str.length; i++) {
    const charIndex = textChars.indexOf(str.charAt(i));
    const hashChars = hashFunction[charIndex];
    const random = Math.floor(Math.random() * hashChars.length);
    hashString += hashChars[random];
  }
  return hashString;
}

// Reverse hash original string
function unhash(hashStr) {
  let str = "";
  for (let i = 0; i < hashStr.length; i += count) {
    const hashIndex = hashUnits.indexOf(hashStr.substr(i, count));
    const charIndex = hashIndex % textChars.length;
    str += textChars.charAt(charIndex);
  }
  return str;
}

// Check if given string is unhashable.
function isUnhashable(str) {
  // Length check
  if (str.length % count !== 0) return false;

  // Character check
  let unhashable = true;
  for (let i = 0; i < str.length; i++) {
    if (hashChars.indexOf(str.charAt(i)) < 0) {
      unhashable = false;
      break;
    }
  }

  return unhashable;
}

export { hash, unhash, isUnhashable };
