// @codegen
const array = ['apple', 'orange', 'pear']
module.exports = array
  .map(fruit => `export const ${fruit} = '${fruit}';`)
  .join('')


  //codegen`module.exports=(function(){return (1+1).toString()}())`