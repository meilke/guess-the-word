function isVocal(letter) {
  return _.includes(['a','e','i','o','u', 'ä', 'ö', 'ü' ], letter);
}

function matchesWildcard(wildCard, letter) {
  return wildCard === '*' && !isVocal(letter);
}

function lettersMatch(letter1, letter2) {
  return letter1 === letter2;
}

var fs = require('fs'),
  _ = require('lodash'),
  commandLineArgs = require('command-line-args');

var dictionary = fs.readFileSync('german.txt').toString().split('\n');
// var dictionary = ['Zeitbombe'];
var cli = commandLineArgs([
  { name: 'word', type: String, multiple: false, defaultOption: true },
  { name: 'top', alias: 't', type: Number, defaultValue: 5 }
]);

var options = cli.parse();

var matches = [];
_.each(dictionary, function (dictionaryWord) {
  if (dictionaryWord.length != options.word.length) {
    return;
  }
  var match = _.map(options.word, function (letter, i) {
    if (lettersMatch(letter, dictionaryWord[i]) || matchesWildcard(letter, dictionaryWord[i])) {
      return 1;
    }
    if (letter !== dictionaryWord[i]) {
      return -1;
    }
    if (isVocal(dictionaryWord[i])) {
      return -1;
    }
  });

  var someMismatch = _.min(match) === -1;
  if (!someMismatch) {
    var sum = _.sum(match);
    if (sum > 0) {
      matches.push({ dictionaryWord: dictionaryWord, sum: sum });
    }
  }
});

matches = _.orderBy(matches, ['sum'], ['desc']).slice(0, options.top);

_.each(matches, function (match) {
  console.log(match.dictionaryWord + ': ' + match.sum);
});