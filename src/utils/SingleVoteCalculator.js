import sjcl from 'sjcl-all';
import Keys from './Keys';

function getRandomString(){
    var randBytes = sjcl.random.randomWords(8);
    var randHex = sjcl.codec.hex.fromBits(randBytes);
    return randHex;
}

function getSingleVoteDataForPost(user, post, chosenCandidate, ballotId) {
    let encryptedBallotId = sjcl.encrypt(user.password, ballotId);

    let publicKeyofCandidate = Keys.unserializePublicKey(chosenCandidate.PublicKey);
    let publicKeyofCEO = Keys.unserializePublicKey(user.data.CEOKey);

    let currentVote = ballotId;
    currentVote = sjcl.encrypt(publicKeyofCandidate, currentVote);
    currentVote = sjcl.encrypt(publicKeyofCEO, currentVote);
    
    return {
        "PostID": parseInt(post.PostID),
        "BallotString": encryptedBallotId,
        "VoteData": currentVote,
    };
}

/*
    user: {
        roll: 
        password:
        data: {
            "Roll":"",
            "Name":"",
            "BallotID":[],
            "Voted":bool,
            "CEOKey":"",
            "State":int
        }
    },
    posts: [
        {
            "PostID":"",
            "PostName":"",
            "Candidates":[""]
        }
    ],
    chosenCandidate: {
        "1": {
            "Roll":"",
            "Username":"",
            "Name":"",
            "PublicKey":"",
            "Manifesto":"",
            "State":int,
            "KeyState":int
        }
*/
export default function CalculateSingleVoteData(user, posts, chosenCandidates){
    let voteData = [];
    let ballotIds = {};
    posts.forEach(post => {
        let ballotId = getRandomString();
        voteData.push(
            getSingleVoteDataForPost(
                user,
                post,
                chosenCandidates[post.PostID],
                ballotId,
            )
        );
        ballotIds[post.PostID] = ballotId;
    });
    return [ voteData, ballotIds ];
}
