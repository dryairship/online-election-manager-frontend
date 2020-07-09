import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CandidateCard from './CandidateCard';


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
});

export default function PostCard(props) {
  /*
  props = {
    id: string
    name: string
    candidates: array of strings
    updateChosenCount: function
  }
  */

  const classes = useStyles();

  const [chosenCandidate, setChosenCandidate] = useState(null);

  const onVote = candidate => {
    setChosenCandidate(candidate);
    props.setChosenCandidate(props.id, candidate);
  }

  const resetVote = () => {
    setChosenCandidate(null);
    props.setChosenCandidate(props.id, null);
  }

  return (
    <Grid container
      className={classes.root}
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Alert severity="info">Candidates for the post of {props.name}:</Alert>
      </Grid>
      {chosenCandidate !== null
        ? (
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Chosen Candidate
                </Typography>
                <Typography variant="h5" component="h2">
                  {chosenCandidate.Name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {chosenCandidate.Roll}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={resetVote}>Reset Vote</Button>
              </CardActions>
            </Card>
          </Grid>
        )
        : (props.candidates &&
          props.candidates.map(candidate => (
            <CandidateCard id={candidate} onVote={onVote} key={candidate}/>
          ))
        )
      }
    </Grid>
  );
}
