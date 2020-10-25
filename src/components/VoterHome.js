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
  const [electionState, setElectionState] = useState("0");

  const onVote = (ballotIds) => {
    setBallotIds(ballotIds);
    setVoted(true);
  }

  const onInit = () => {
    if(props.user.data.Voted) {
      setBallotIds(DecryptBallotIds(props.user.data.BallotID, props.user.password));
    }
    fetch("/election/getElectionState")
    .then(res => res.text())
    .then(state => setElectionState(state));

    if(!posts) {
      fetch("/election/getVotablePosts")
      .then(res => res.json())
      .then(result => setPosts(result));
    }
  }
  React.useEffect(onInit, []);

  return (
    (props.user.data.Voted || voted)
    ? (
      <Alert severity="success">
        Hi {props.user.data.Name}! Your vote has been submitted.<br/>
        {posts && Object.keys(ballotIds).map(postId =>
          <div key={postId}>
            <p>Ballot Id for your vote for {posts.find(post=>post.PostID===postId).PostName}:</p>
            <p>{ballotIds[postId]}</p>
          </div>
        )}
      </Alert>
    )
    : (electionState === "1"
      ? <PostsList user={props.user} onVote={onVote} posts={posts}/>
      : <Alert severity="success"> Hi {props.user.data.Name}! Please wait for the voting to start.</Alert>
    )
  );
}
