const match = require('@menadevs/objectron');
const fs = require('fs');

try {
    var htmlTop = fs.readFileSync('htmlTop');
    var htmlEnd = fs.readFileSync('htmlEnd');
    var HARdataStr = fs.readFileSync('dining.uconn.edu.har');
    var HARdata = JSON.parse(HARdataStr);
} catch (err) {
    console.log(err);
    return;
}

var html = htmlTop;
html += "<h1>URLs of All GET Requests</h1>";

const interestingStuffFilter = {
    "request": {
        "method": "GET",
        "url": (val) => val
    }
};

for (var i=0; i<HARdata.log.entries.length; i++) {
    var result = match(HARdata.log.entries[i], interestingStuffFilter);
    if (result.match == true) html += "<p>" + JSON.stringify(result.matches.request.url) + "<\p>";
}

html += (htmlEnd);

fs.writeFile('results.html', html, (err) => { if (err) throw err; })