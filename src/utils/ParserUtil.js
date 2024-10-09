export function parseWordCorrectness(word, input) {
  let cor = '';
  let badInd = 0;
  for(let i = 0; i < input.length; i++) {
    if(input[i] === word[i]) {
      cor = `${cor}${input[i]}`;
    }
    else {
      badInd = i;
      break;
    }
  }

  return [
    cor,
    word.substring(cor.length, input.length),
    word.substring(input.length)
  ];
}