import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import PostCard from './PostCard';

export default function VoterHome(props) {
  /*
  props = {
    user: {
      roll: 
      password:
    }
  }
  */

  const [availablePosts, setAvailablePosts] = useState(null);
  const [vhStatus, setVHStatus] = useState({});
  
  useEffect(() => {
    if(!availablePosts) {
      fetch("/election/getVotablePosts")
      .then(res => res.json())
      .then(
        result => setAvailablePosts(result),
        _ => setVHStatus({
          display: true,
          severity: "error",
          message: "Error while making a request. Please check your internet connection."
        })
      );
    }
  }, []);

  return (
    <Grid container spacing={4} justify="center" alignItems="center">
      <CssBaseline />
        <Alert severity="info">Voter Home!</Alert>
        {vhStatus.display && // Only display if vhStatus.display is true
          <Alert severity={vhStatus.severity}>{vhStatus.message}</Alert>
        }
        {availablePosts && 
          availablePosts.map(post => (
            <Grid item xs={12}>
              <PostCard id={post.PostID} name={post.PostName} candidates={post.Candidates} />
            </Grid>
          ))
        }
    </Grid>
  );
}