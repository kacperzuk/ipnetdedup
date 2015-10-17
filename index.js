"use strict";

const compare = require("./compare");

process.stdin.setEncoding('utf8');

let stdin = "";

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    stdin += chunk;
  }
});

process.stdin.on('end', function() {
  let networks = JSON.parse(stdin);
  let found_overlap;
  do {
    found_overlap = false;
    for(let i = 0; i < networks.length-1; i++) {
      for(let j = i+1; j < networks.length; j++) {
        let n = compare(networks[i], networks[j]);
        if(n) {
          found_overlap = true;
          networks.splice(j, 1);
          networks.splice(i, 1);
          networks.push(n);
        }
      }
    }
  } while(found_overlap);
  networks.sort();
  process.stdout.write(JSON.stringify(networks, null, 2));
});

