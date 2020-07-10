import sjcl from 'sjcl-all';

function seedSJCL() {
    var arr = new Uint32Array(128);
    crypto.getRandomValues(arr);
    sjcl.random.addEntropy(arr, 1024, "crypto.randomBytes");
}

// Convert Public Key from JSON to Base64
function serializePublicKey(pub){
    return sjcl.codec.base64.fromBits(pub.get().x.concat(pub.get().y));
}

// Convert Private Key from JSON to Base64
function serializePrivateKey(priv){
    return sjcl.codec.base64.fromBits(priv.get());
}

// Convert Public Key from Base64 to JSON
function unserializePublicKey(serPub){
    return new sjcl.ecc.elGamal.publicKey(
        sjcl.ecc.curves.c256,
        sjcl.codec.base64.toBits(serPub)
    );
}

// Convert Private Key from Base64 to JSON
function unserializePrivateKey(serPriv){
    return new sjcl.ecc.elGamal.secretKey(
        sjcl.ecc.curves.c256,
        sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(serPriv))
    );
}

// Generate a public-private key pair.
function generateKeyPair(){
    return sjcl.ecc.elGamal.generateKeys(256);
}

function generateKeysForCEO(password) {
    let pair = generateKeyPair();
    let publicKey = serializePublicKey(pair.pub);
    let privateKey = serializePrivateKey(pair.sec);
    let encryptedPrivateKey = sjcl.encrypt(password, privateKey);
    return [ publicKey, encryptedPrivateKey ];
}

export default {
    seedSJCL,
    generateKeyPair,
    unserializePublicKey,
    unserializePrivateKey,
    serializePublicKey,
    serializePrivateKey,
    generateKeysForCEO
};
