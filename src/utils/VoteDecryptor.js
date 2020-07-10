import sjcl from 'sjcl-all';
import Keys from './Keys';

function stripVotes(votes, privateKey, password) {
    let decryptedPrivateKey = sjcl.decrypt(password, privateKey);
    let unserializedPrivateKey = Keys.unserializePrivateKey(decryptedPrivateKey);
    return votes.map(vote => sjcl.decrypt(unserializedPrivateKey, vote));
}

function tryDecryption(vote, privateKey) {
    try {
        let result = sjcl.decrypt(privateKey, vote);
        return result;
    } catch {
        return false;
    }
}

export default { stripVotes, tryDecryption };
