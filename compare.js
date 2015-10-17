"use strict";

const ip = require("ip");
const ipcheck = require("ipcheck");

function comp(arr1, arr2) {
  for(let i = 0; i < arr1.length; i++) {
    if(arr1[i] !== arr2[i])
      return false;
  }
  return true;
}

function addressMinus(addr, v) {
  for(let i = addr.length - 1; i >= 0; i--) {
    addr[i] -= v;
    v = 1;
    if(addr[i] >= 0) {
      return addr;
    }
    else addr[i] += 256;
  }
  return addr;
}

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

   if(nA.length == nB.length) {
     let candidate = null;
     if(comp(nA.lastAddress.address, addressMinus(nB.firstAddress.address, 3)))  {
       // nA first, nB next
       candidate = { a: nA.networkAddress, m: nA.subnetMaskLength - 1 };
     } else if(comp(nB.lastAddress.address, addressMinus(nA.firstAddress.address, 3))) {
       // nB first, nA next
       candidate = { a: nB.networkAddress, m: nB.subnetMaskLength - 1 };
     }

     if(candidate) {
       let candidate_network = ip.mask(candidate.a, ip.fromPrefixLen(candidate.m));
       if(candidate.a == candidate_network) {
         candidate = `${candidate.a}/${candidate.m}`;
         console.warn(a, b, "grouped:", candidate);
         return candidate;
       }
     }
   }

   return false;
}
