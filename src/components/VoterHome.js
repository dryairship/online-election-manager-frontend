import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import PostsList from './PostsList';
import DecryptBallotIds from '../utils/BallotIds';

export default function VoterHome(props) {
  /*
  props = {
    user: {
      roll: 
      password:
      data:
    },
  }
  */

  const [voted, setVoted] = useState(false);
  const [ballotIds, setBallotIds] = useState({});
  const [posts, setPosts] = useState(null);
  const [electionState, setElectionState] = useState("VotingNotYetStarted");

  const onVote = (ballotIds) => {
    setBallotIds(ballotIds);
    setVoted(true);
  }

  const onInit = () => {
    setElectionState(props.user.data.electionState);

    if(props.user.data.voted) {
      setBallotIds(DecryptBallotIds(props.user.data.ballotIds, props.user.password));
    }

    if(!posts) {
      fetch("/api/data/candidates?version="+Math.random())
      .then(res => res.json())
      .then(result => setPosts(result.filter(post => props.user.data.posts.includes(post.postId))));
    }
  }
  React.useEffect(onInit, []);

  return (
    (props.user.data.voted || voted)
    ? (
      <Alert severity="success">
        Hi {props.user.data.name}! Your vote has been submitted.<br/>
        {posts && Object.keys(ballotIds).map(postId =>
          <div key={postId}>
            <p>Ballot Id for your vote for {posts.find(post=>post.postId===postId).postName}:</p>
            <p>{ballotIds[postId]}</p>
          </div>
        )}
      </Alert>
    )
    : (electionState === "AcceptingVotes"
      ? <PostsList user={props.user} onVote={onVote} posts={posts}/>
      : <Alert severity="success"> Hi {props.user.data.name}! Please wait for the voting to start.</Alert>
    )
  );
}
