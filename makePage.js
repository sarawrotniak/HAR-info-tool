const match = require('@menadevs/objectron');
const fs = require('fs');

try {
    var htmlTop = fs.readFileSync('htmltop');
    var htmlEnd = fs.readFileSync('htmlend');
    var HARdataStr = fs.readFileSync('harfile');
    var HARdata = JSON.parse(HARdataStr);
} catch (err) {
    console.log(err);
    return;
}

var html = htmlTop;
html += "<h1>Info About Requests</h1>";
html += "<p> <span style='color:black;'>Below are shown the type of request (GET/POST), any parameters sent in the URL (in blue), and the names of any cookies sent (in green). Also, origin and referer may be shown in blue if present. </span><\p>";

const requestFilter = { "request": (val) => val };

const ORFilter = {
    "request": {
        "headers": [
            {   "name": "Origin",
                "value": (val) => val },
            {   "name": "Referer",
                "value": (val) => val } ,
            {   "name": "origin",
                "value": (val) => val },
            {   "name": "referer",
                "value": (val) => val } ] } }

for (var i=0; i<HARdata.log.entries.length; i++) {
    var entry = HARdata.log.entries[i];
    var result = match(entry, requestFilter);
    var result2 = match(entry, ORFilter);
    if (result.match == true) {
        var url = entry.request.url; //url
        html += "<h3>" + url + "<\h3>";
        html += "<p> <span style='color:black;'>" + entry.request.method + "</span><\p>"; //GET/POST
        //origin, referer
        for (var j=0; j<4; j++)
            if (result2.matches.request.headers[j].name)
                html += "<p> " + result2.matches.request.headers[j].name + ": "
                    + result2.matches.request.headers[j].value + "<\p>";
        //queryString
        if (entry.request.queryString.length>0) {
            html += "<p> <span style='color:black;'>" + "queryString (URL params):" + "</span><\p>";
            for (var j=0; j<entry.request.queryString.length; j++)
                html += "<p> " + entry.request.queryString[j].name + ": " + entry.request.queryString[j].value + "<\p>";
        }
        //names of cookies
        if (entry.request.cookies.length>0) {
            html += "<p> <span style='color:black;'>" + "names of cookies:" + "</span><\p>";
            for (var j=0; j<entry.request.cookies.length; j++)
                html += "<p> <span style='color:green;'>" + entry.request.cookies[j].name + "</span><\p>";
        }
    }
}

html += (htmlEnd);

fs.writeFile('results.html', html, (err) => { if (err) throw err; });