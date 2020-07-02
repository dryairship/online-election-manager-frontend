import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PostCard from './PostCard';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PostsList(props) {
  /*
  props = {
    user: {
      roll: 
      password:
      data:
    }
    onVote: function
  }
  */

  const classes = useStyles();

  const [availablePosts, setAvailablePosts] = useState(null);
  const [vhStatus, setVHStatus] = useState({});
  const [chosenCount, setChosenCount] = useState(0);
  
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

  const vote = () => {
    console.log("Voting!!!!");
  }

  const updateChosenCount = delta => setChosenCount(chosenCount+delta);

  return (
    <Grid container spacing={4} justify="center" alignItems="center">
      <CssBaseline />
        <Alert severity="info">Hi {props.user.data.Name}! Please cast your vote below.</Alert>
        {vhStatus.display && // Only display if vhStatus.display is true
          <Alert severity={vhStatus.severity}>{vhStatus.message}</Alert>
        }
        {availablePosts && 
          availablePosts.map(post => (
            <Grid item xs={12}>
              <PostCard id={post.PostID} name={post.PostName} candidates={post.Candidates} updateChosenCount={updateChosenCount}/>
            </Grid>
          ))
        }
        {availablePosts && chosenCount===availablePosts.length && 
          <Grid container justify="center">
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={vote}
              className={classes.submit}
            >
              Submit
            </Button>
          </Grid>
        }
    </Grid>
  );
}