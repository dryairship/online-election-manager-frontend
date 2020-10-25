import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PostCard from './SingleVotePostCard';
import Button from '@material-ui/core/Button';
import ConfirmSingleVotes from './ConfirmSingleVotes';
import CalculateSingleVoteData from '../utils/SingleVoteCalculator';

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [chosenCandidates, setChosenCandidates] = useState({});
  
  const onInit = () => {
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
  }
  useEffect(onInit, []);

  const updateChosenCount = delta => setChosenCount(chosenCount+delta);

  const setChosenCandidate = (postId, candidate) => {
    if(!candidate) updateChosenCount(-1);
    else updateChosenCount(1);
    setChosenCandidates({
      ...chosenCandidates,
      [postId]: candidate,
    });
  }

  const onSubmit = () => {
    setConfirmDialogOpen(true);
  }

  const onConfirmReply = reply  => {
    setConfirmDialogOpen(false);
    if(reply) submitVote();
  }

  const submitVote = () => {
    let [ voteData, ballotIds ] = CalculateSingleVoteData(props.user, availablePosts, chosenCandidates);
    console.log("Vote Data: "+JSON.stringify(voteData));
    fetch("/election/submitVote", {
      method: "POST",
      body: JSON.stringify(voteData),
    })
    .then(
      res => {
        if(res.status===200){
          props.onVote(ballotIds);
        }else{
          res.text().then(text =>
            setVHStatus({
              display: true,
              severity: "error",
              message: text,
            })
          );
        }
      },
      _ => setVHStatus({
        display: true,
        severity: "error",
        message: "Error while making a request. Please check your internet connection.",
      })
    );
  }

  return (
    <Grid container spacing={4} justify="center" alignItems="center">
      <CssBaseline />
        <Alert severity="info">Hi {props.user.data.Name}! Please cast your vote below.</Alert>
        {vhStatus.display && // Only display if vhStatus.display is true
          <Alert severity={vhStatus.severity}>{vhStatus.message}</Alert>
        }
        {availablePosts && 
          availablePosts.map(post => (
            <Grid item xs={12} key={post.PostID}>
              <PostCard id={post.PostID} name={post.PostName} candidates={post.Candidates} setChosenCandidate={setChosenCandidate}/>
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
              onClick={onSubmit}
              className={classes.submit}
            >
              Submit
            </Button>
          </Grid>
        }
        <ConfirmSingleVotes open={confirmDialogOpen} onClose={onConfirmReply} posts={availablePosts} candidates={chosenCandidates}/>
    </Grid>
  );
}
