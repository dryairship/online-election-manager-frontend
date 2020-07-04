import sjcl from 'sjcl-all';

function stripVotes(votes, privateKey) {
    return votes.map(vote => sjcl.decrypt(privateKey, vote));
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