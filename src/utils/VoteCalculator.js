import sjcl from 'sjcl-all';
import Keys from './Keys';

function getRandomString(){
    var randBytes = sjcl.random.randomWords(8);
    var randHex = sjcl.codec.hex.fromBits(randBytes);
    return randHex;
}

function getVoteDataForPost(user, post, chosenCandidates, ballotId) {
    let encryptedBallotId = sjcl.encrypt(user.password, ballotId);
    let numChosen = chosenCandidates ? chosenCandidates.length : 0;
    let publicKeyofCEO = Keys.unserializePublicKey(user.data.CEOKey);

    let currentVote = ballotId;
    for(let i=0; i<3; i++){
        if(i>=numChosen) currentVote += "-0";
        else currentVote += "-" + chosenCandidates[i].Roll;
    }
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
    chosenCandidates: {
        "1": [
            {
                "Roll":"",
                "Username":"",
                "Name":"",
                "PublicKey":"",
                "Manifesto":"",
                "State":int,
                "KeyState":int
            },{
                "Roll":"",
                "Username":"",
                "Name":"",
                "PublicKey":"",
                "Manifesto":"",
                "State":int,
                "KeyState":int
            },{
                "Roll":"",
                "Username":"",
                "Name":"",
                "PublicKey":"",
                "Manifesto":"",
                "State":int,
                "KeyState":int
            }
        ]
*/
export default function CalculateVoteData(user, posts, chosenCandidates){
    let voteData = [];
    let ballotIds = {};
    posts.forEach(post => {
        let ballotId = getRandomString();
        voteData.push(
            getVoteDataForPost(
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
