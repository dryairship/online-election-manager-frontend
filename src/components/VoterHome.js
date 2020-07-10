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
  }
  React.useEffect(onInit, []);

  return (
    (props.user.data.Voted || voted)
    ? (
      <Alert severity="success">
        Hi {props.user.data.Name}! Your vote has been submitted.<br/>
        {Object.keys(ballotIds).map(postId =>
          <p>Ballot Id for post {postId}: {ballotIds[postId]}</p>
        )}
      </Alert>
    )
    : (electionState === "1"
      ? <PostsList user={props.user} onVote={onVote}/>
      : <Alert severity="success"> Hi {props.user.data.Name}! Please wait for the voting to start.</Alert>
    )
  );
}
