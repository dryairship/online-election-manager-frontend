const sjcl = require('sjcl-all');

export default function DecryptBallotIds(ballotIds, userPassword) {
    var decryptedBallotIds = {};
    ballotIds.forEach(ballotId => {
        decryptedBallotIds[ballotId.postId] = sjcl.decrypt(userPassword, ballotId.ballotString);
    });
    return decryptedBallotIds;
}
