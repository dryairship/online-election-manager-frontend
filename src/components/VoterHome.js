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
    }
  }
  */

  const [voted, setVoted] = useState(false);
  const [ballotIds, setBallotIds] = useState({});

  const onVote = (ballotIds) => {
    setBallotIds(ballotIds);
    setVoted(true);
  }

  const onInit = () => {
    if(props.user.data.Voted) {
      setBallotIds(DecryptBallotIds(props.user.data.BallotID, props.user.password));
    }
  }
  React.useEffect(onInit, []);

  console.log(props.user)
  return (
    props.user.data.Voted || voted
      ? <Alert severity="success">
          Hi {props.user.data.Name}! Your vote has been submitted.<br/>
          {Object.keys(ballotIds).map(postId =>
            <p>Ballot Id for post {postId}: {ballotIds[postId]}</p>
          )}
        </Alert>
      : <PostsList user={props.user} onVote={onVote}/>
  );
}
