"use strict";

const ip = require("ip");
const ipcheck = require("ipcheck");

module.exports = function(a, b) {
  let nA, nB;
  try {
    nA = ip.cidrSubnet(a),
    nB = ip.cidrSubnet(b);
  } catch(err) {
    return false;
  }

  [nA, nB].forEach(function(n) {
    n.firstAddress = new ipcheck(n.firstAddress);
    n.lastAddress = new ipcheck(n.lastAddress);
    n.network = new ipcheck(`${n.networkAddress}/${n.subnetMaskLength}`);
  });

  if(
     nA.firstAddress.match(nB.network) ||
     nA.lastAddress.match(nB.network) ||
     nB.firstAddress.match(nA.network) ||
     nB.lastAddress.match(nA.network)
   ) {
     console.warn(a, b, "overlap");
     if(nA.length > nB.length)
       return a;
     else
       return b;
   }

   return false;
}
