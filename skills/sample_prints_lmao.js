console.log('  Comparing \'a string\' and \'a string\': ' + isEqual('a string', 'a string'));
console.log('  Comparing \'a string\' and \'another string\': ' + isEqual('a string', 'another string'));
console.log('  Comparing \'A string\' and \'a string\': ' + isEqual('A string', 'a string'));
console.log('  Comparing \'A string\' and \'another string\': ' + isEqual('A string', 'another string'));
console.log('  Comparing \'a string\' and \'a string\': ' + isIdentical('a string', 'a string'));
console.log('  Comparing \'a string\' and \'another string\': ' + isIdentical('a string', 'another string'));
console.log('  Comparing \'A string\' and \'a string\': ' + isIdentical('A string', 'a string'));
console.log('  Comparing \'A string\' and \'another string\': ' + isIdentical('A string', 'another string'));
console.log('  Comparing new String(\'a string\') and new String(\'a string\'): ' + isEqualIgnoreCase('a string', 'a string'));
console.log('  Comparing new String(\'a string\') and new String(\'another string\'): ' + isEqualIgnoreCase('a string', 'another string'));
console.log('  Comparing new String(\'A string\') and new String(\'a string\'): ' + isEqualIgnoreCase('A string', 'a string'));
console.log('  Comparing new String(\'A string\') and new String(\'another string\'): ' + isEqualIgnoreCase('A string', 'another string'));
console.log('  Comparing new String(\'a string\') and new String(\'a string\'): ' + isIdenticalIgnoreCase('a string', 'a string'));
console.log('  Comparing new String(\'a string\') and new String(\'another string\'): ' + isIdenticalIgnoreCase('a string', 'another string'));
console.log('  Comparing new String(\'A string\') and new String(\'a string\'): ' + isIdenticalIgnoreCase('A string', 'a string'));
console.log('  Comparing new String(\'A string\') and new String(\'another string\'): ' + isIdenticalIgnoreCase('A string', 'another string'));

// A function that tests if two strings are equal
function isEqual(str1, str2){
  return str1 == str2;
}

// A function that tests if two strings are identical
function isIdentical(str1, str2){
  return str1 === str2;
}
  
// A function that tests if two String objects are equal
function isEqualIgnoreCase(str1, str2){
  return str1.toUpperCase() == str2.toUpperCase();
}

// A function that tests if two String objects are equal, regardless of case
function isIdenticalIgnoreCase(str1, str2){
  return str1.toUpperCase() === str2.toUpperCase();
}
