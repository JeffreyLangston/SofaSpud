var fs = require('fs');
var path = require('path');


if (!fs.existsSync('./functions/lib')){
  fs.mkdirSync('./functions/lib');
}

if (!fs.existsSync('./functions/lib/Data')){
  fs.mkdirSync('./functions/lib/Data');
}

fs.createReadStream(path.resolve(__dirname, '../src/Data/FundList.json')).pipe(fs.createWriteStream('./functions/lib/Data/FundList.json'));