var fs = require('fs');
var path = require('path');


if (!fs.existsSync('./lib')){
  fs.mkdirSync('./lib');
}

if (!fs.existsSync('./lib/Data')){
  fs.mkdirSync('./lib/Data');
}

fs.createReadStream(path.resolve(__dirname, '../src/Data/FundList.json')).pipe(fs.createWriteStream('./lib/Data/FundList.json'));

if (!fs.existsSync('./lib/API')){
  fs.mkdirSync('./lib/API');
}


fs.createReadStream(path.resolve(__dirname, 'c:/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json')).pipe(fs.createWriteStream('./lib/API/sofaspuddev-firebase-adminsdk-00jxe-e314820134.json'));