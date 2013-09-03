var fs = require("fs");

var json1 = JSON.parse( fs.readFileSync("json1.json") );
var json2 = JSON.parse( fs.readFileSync("json2.json") );

console.log("json1.length => " + json1.length + "\n");
console.log("json2.length => " + json2.length + "\n");
