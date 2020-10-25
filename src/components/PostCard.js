import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
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
    updatePreferences: function
  }
  */

  const classes = useStyles();

  const [preferences, setPreferences] = useState([]);

  const onVote = candidate => {
    setPreferences([...preferences, candidate]);
  }

  const resetVote = () => {
    setPreferences([]);
  }

  const informParentAboutChange = () => {
    props.setPreferences(props.id, preferences);
  }
  React.useEffect(informParentAboutChange, [preferences]);

  const preferencesValid = () => {
    return preferences.length === 0 || preferences.length === Math.min(3, props.candidates.length)
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
        <Alert severity="info" action={
          <Chip
            color={preferencesValid() ? "primary" : "secondary"}
            label={preferences.length === 0 ? "Current Choice: NOTA" :
             (preferencesValid() ? "Choices valid" : "Choices invalid")}
          />
        }>Post: {props.name}</Alert>
      </Grid>
      {preferences.length > 0
        && (
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Chosen Candidates
                </Typography>
                {preferences.map((candidate, index) => (
                  <div key={index}>
                    <Typography variant="h5" component="h2">
                      {(index+1)+". "+candidate.Name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    &nbsp;&nbsp;&nbsp;&nbsp;{candidate.Roll}
                    </Typography>
                  </div>
                ))}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={resetVote} variant="contained" color="secondary">Reset Vote</Button>
              </CardActions>
            </Card>
          </Grid>
        )
      }
      {props.candidates && preferences.length < Math.min(3, props.candidates.length) &&
        props.candidates.filter(cand => !preferences.find(el => cand.endsWith(el.Roll)))
        .map(candidate => <CandidateCard id={candidate} onVote={onVote} key={candidate}/>)
      }
    </Grid>
  );
}
