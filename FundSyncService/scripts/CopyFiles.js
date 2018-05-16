var fs = require('fs');
var path = require('path');

fs.createReadStream(path.resolve(__dirname, '../src/FundList.json')).pipe(fs.createWriteStream('./Dist/FundList.json'));