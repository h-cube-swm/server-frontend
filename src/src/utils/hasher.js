const hashChars = ['슈', '슉', '.', '!'];
const textChars = "abcdefghijklmnopqrstuvwxyz1234567890-";

let count = 1;
while (Math.pow(hashChars.length, count) < textChars.length) {
  count += 1;
}

function getAllText(count) {
  if (count === 0) return [""];
  let list = [];
  for (let i = 0; i < hashChars.length; i++) {
    getAllText(count - 1).forEach((str) => {
      list.push(hashChars[i] + str);
    });
  }
  return list;
}

const combination = getAllText(count);

const hashFunction = new Array(textChars.length).fill(0).map(() => []);
combination.forEach((x, i) => {
  hashFunction[i % textChars.length].push(x);
});

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

function unhash(hashStr) {
  let str = "";
  for (let i = 0; i < hashStr.length; i += count) {
    const hashIndex = combination.indexOf(hashStr.substr(i, count));
    const charIndex = hashIndex % textChars.length;
    str += textChars.charAt(charIndex);
  }
  return str;
}

function isUnhashable(str) {

  if (str.length % count != 0) return false;

  let hashed = true;
  for (let i = 0; i < str.length; i++) {
    if (hashChars.indexOf(str.charAt(i)) < 0) {
      hashed = false;
      break;
    }
  }
  return hashed;
}

export { hash, unhash, isUnhashable };