function getPostableResult(result) {
    let postableResult = {
        posts: [],
    };
    result.posts.forEach(post => {
        let postData = {
            postid: post.postid,
            postname: post.postname,
            resolved: post.resolved,
            candidates: [],
        };
        let ballotIdCandidateMap = {};
        result.candidateCounts[post.postid].forEach(candidate => {
            ballotIdCandidateMap[candidate.Roll] = [];
        });
        Object.keys(result.ballotIdMaps[post.postid]).forEach(ballotId => {
            ballotIdCandidateMap[result.ballotIdMaps[post.postid][ballotId].Roll].push(ballotId); 
        });
        result.candidateCounts[post.postid].forEach(candidate => {
            let candidateData = {
                roll: candidate.Roll,
                name: candidate.Name,
                count: candidate.count,
                status: candidate.status,
                ballotIds: ballotIdCandidateMap[candidate.Roll],
            };
            postData.candidates.push(candidateData);
        });
        postableResult.posts.push(postData);
    });
    return postableResult;
}

export { getPostableResult };
