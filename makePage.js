const match = require('@menadevs/objectron');
const fs = require('fs');

try {
    var htmlTop = fs.readFileSync('htmlTop');
    var htmlEnd = fs.readFileSync('htmlEnd');
    var HARdataStr = fs.readFileSync('harfile');
    var HARdata = JSON.parse(HARdataStr);
} catch (err) {
    console.log(err);
    return;
}

var html = htmlTop;
html += "<h1>URLs of All Requests</h1>";
html += "<h1 style='font-size:120%;''>and method and URL parameters</h1>";

const interestingStuffFilter = {
    "request": {
        "method": (val) => val,
        "url": (val) => val
    }
};

var numMatches = 0;

for (var i=0; i<HARdata.log.entries.length; i++) {
    var result = match(HARdata.log.entries[i], interestingStuffFilter);
    if (result.match == true) {
        numMatches++;
        var url = result.matches.request.url;
        html += "<h3>" + url + "<\h3>";
        html += "<p> <span style='color:white;'>" + result.matches.request.method + "</span><\p>";
        var paramIndex = url.indexOf("?");
        if (paramIndex != -1) {
            html += "<p><span style='color:white;'>URL params:</span><\p><p>";
            for (var j=paramIndex+1; j<url.length; j++) {
                if (url[j]=='&') html += "<\p><p>";
                else html += url[j];
            }
            html += "<\p>";
        }
    }
}

console.log(HARdata.log.entries.length);
console.log(numMatches);

html += (htmlEnd);

fs.writeFile('results.html', html, (err) => { if (err) throw err; })