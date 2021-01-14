import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PostCard from './PostCard';
import Button from '@material-ui/core/Button';
import ConfirmVotes from './ConfirmVotes';
import CalculateVoteData from '../utils/VoteCalculator';

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
    posts:
  }
  */

  const classes = useStyles();

  const [vhStatus, setVHStatus] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [chosenCandidates, setChosenCandidates] = useState({});

  const setPreferences = (postId, preferences) => {
    setChosenCandidates({
      ...chosenCandidates,
      [postId]: preferences,
    });
  }

  const onSubmit = () => {
    setConfirmDialogOpen(true);
  }

  const onConfirmReply = reply  => {
    setConfirmDialogOpen(false);
    if(reply) submitVote();
  }

  const areVotesValid = () => {
    return props.posts.every(post => {
        let result = chosenCandidates[post.postId] && chosenCandidates[post.postId].length === Math.min(3, post.candidates.length);
        if(post.hasNota)
          return !chosenCandidates[post.postId] || chosenCandidates[post.postId].length === 0 || result;
        else
          return result;
      }
    );
  }

  const getAllowedCounts = post => {
    if(post.hasNota)
      return [0, Math.min(3, post.candidates.length)];
    else
      return [Math.min(3, post.candidates.length)];
  }

  const submitVote = () => {
    let [ voteData, ballotIds ] = CalculateVoteData(props.user, props.posts, chosenCandidates);
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
        <Alert severity="info">Hi {props.user.data.name}! Please cast your vote below.</Alert>
        {vhStatus.display && // Only display if vhStatus.display is true
          <Alert severity={vhStatus.severity}>{vhStatus.message}</Alert>
        }
        {props.posts && 
          props.posts.map(post => (
            <Grid item xs={12} key={post.postId}>
              <PostCard
                id={post.postId}
                name={post.postName}
                allowedCounts={getAllowedCounts(post)}
                candidates={post.candidates}
                setPreferences={setPreferences}
              />
            </Grid>
          ))
        }
        {props.posts && areVotesValid() &&
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
        <ConfirmVotes open={confirmDialogOpen} onClose={onConfirmReply} posts={props.posts} candidates={chosenCandidates}/>
    </Grid>
  );
}
