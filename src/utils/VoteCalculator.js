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
    let publicKeyofCEO = Keys.unserializePublicKey(user.data.ceoKey);

    let currentVote = ballotId;
    for(let i=0; i<3; i++){
        if(i>=numChosen) currentVote += "-0";
        else currentVote += "-" + chosenCandidates[i].roll;
    }
    currentVote = sjcl.encrypt(publicKeyofCEO, currentVote);
    
    return {
        "postId": post.postId,
        "ballotString": encryptedBallotId,
        "voteData": currentVote,
    };
}

/*
    user: {
        roll: 
        password:
        data: {
            "roll":"",
            "name":"",
            "ballotIds":[],
            "voted":bool,
            "ceoKey":"",
            "electionState":int,
            "posts":[],
        }
    },
    posts: [
        {
            "postId":"",
            "postName":"",
            "hasNota":bool
            "candidates":[{name, roll}]
        }
    ],
    chosenCandidates: {
        "1": [
            {
                "roll":"",
                "name":"",
            },{
                "roll":"",
                "name":"",
            },{
                "roll":"",
                "name":"",
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
                chosenCandidates[post.postId],
                ballotId,
            )
        );
        ballotIds[post.postId] = ballotId;
    });
    return [ voteData, ballotIds ];
}
