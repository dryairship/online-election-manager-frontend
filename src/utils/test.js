const crypto =  require('crypto');

function generateKeyPair() {
  const keys = crypto.generateKeyPairSync('rsa', {
    modulusLength: 512,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return keys;
}

function myKeys() {
let pubKey = `-----BEGIN RSA PUBLIC KEY-----
MEgCQQC7TjtGScCf/lnRyuAo4vN4lCPLtM1T+jDopLDilLej0/qD8wnMgw6bZh4Y
/3HVjJNyDnnRkieqly2X7wqJLKS3AgMBAAE=
-----END RSA PUBLIC KEY-----
`;
let privKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBALtOO0ZJwJ/+WdHK4Cji83iUI8u0zVP6MOiksOKUt6PT+oPzCcyD
DptmHhj/cdWMk3IOedGSJ6qXLZfvCokspLcCAwEAAQJAWpCRCINQqAuL0myNxjc2
Ee9O/4gEX75xN4uqG2RdBtD8ZUSErcqbC6bUK/uCEeiWcRH/ybR9c7D6c/ChUh6F
wQIhANnR9JVcvHjy2S48XBpstkzxvd3/ehSPXvL6ftMc+fQDAiEA3CMGUvCGVeHt
TUtaIZfuUKKAK2YgjElQSU+ZR100gD0CIQC8FyEtGTdm+c2wr06ZQubo6pcZ7FJv
Dp7fEpARnSP6IQIgEMV2WOFMSsTAsI/aGQ8bL/eBbk0Ek8uOG1e+JMq8Ej0CIBMg
4rZNlyifukpi1RdExQgPZDBfHgWQrYEc3BdVmX5o
-----END RSA PRIVATE KEY-----
`;
let myPubEnc = crypto.publicEncrypt(pubKey, Buffer.from("Lmaoooo", 'utf8'));
console.log(myPubEnc.toString('base64'));
let myPrivDec = crypto.privateDecrypt(privKey, myPubEnc);
console.log(myPrivDec.toString());
}

function main() {
    let key = generateKeyPair();
    console.log(key.publicKey);
    console.log(key.privateKey);

    let pubEnc = crypto.publicEncrypt(key.publicKey, Buffer.from("Lmaoooo", 'utf8'));
    console.log(pubEnc.toString('base64'));
//let myEnc = crypto.publicEncrypt(myPubKey, Buffer.from("Lmaoooo", 'utf8'));
//console.log(myEnc.toString('base64'));
    let privEnc = crypto.privateEncrypt(key.privateKey, Buffer.from("Lmaoooo", 'utf8'));
    console.log(privEnc.toString('base64'));
    let pubDec = crypto.publicDecrypt(key.publicKey, privEnc);
    console.log(pubDec.toString());
    //let myDec = crypto.publicDecrypt(myKey, privEnc);
    //console.log(myDec.toString());
    let privDec = crypto.privateDecrypt(key.privateKey, pubEnc);
    console.log(privDec.toString());
    //let myDec = crypto.privateDecrypt(key.privateKey, myEnc);
    //console.log(myDec.toString());
}

function genKeys(){
    let n = 50;
    let pubKeys = [], privKeys = [];
    for(let i=0; i<n; i++){
        let key = generateKeyPair();
        pubKeys.push(key.publicKey);
        privKeys.push(key.privateKey);
    }
    for(let i=0; i<n; i++){
        console.log("`"+pubKeys[i]+"`,");
    }
    for(let i=0; i<n; i++){
        console.log("`"+privKeys[i]+"`,");
    }

}

myKeys();