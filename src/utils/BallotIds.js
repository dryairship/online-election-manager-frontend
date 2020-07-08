const sjcl = require('sjcl-all');

export default function DecryptBallotIds(ballotIds, userPassword) {
    var decryptedBallotIds = {};
    ballotIds.forEach(ballotId => {
        decryptedBallotIds[ballotId.PostID] = sjcl.decrypt(userPassword, ballotId.BallotString);
    });
    return decryptedBallotIds;
}
