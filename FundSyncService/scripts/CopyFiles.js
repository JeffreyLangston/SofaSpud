var fs = require('fs');
var path = require('path');


if (!fs.existsSync('./Dist')){
  fs.mkdirSync('./Dist');
}

if (!fs.existsSync('./Dist/Data')){
  fs.mkdirSync('./Dist/Data');
}

fs.createReadStream(path.resolve(__dirname, '../src/Data/FundList.json')).pipe(fs.createWriteStream('./Dist/Data/FundList.json'));