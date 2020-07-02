import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import PostsList from './PostsList';

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

  const onVote = () => setVoted(true);

  return (
    props.user.data.Voted || voted
      ? <Alert severity="success">Hi {props.user.data.Name}! Your vote has been submitted.</Alert>
      : <PostsList user={props.user} onVote={onVote}/>
  );
}