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
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#bba3d4",
    border: "10px",
    borderColor: "#000000",
    borderRadius: "20px",
  },
  card: {
    minWidth: 275,
  },
  section1: {
    width: "100%",
    backgroundColor: "#ebd9ff",
  },
  title: {
    fontSize: 14,
  },
}));

export default function PostCard(props) {
  /*
  props = {
    id: string
    name: string
    allowedCounts: array of numbers
    candidates: array of candidates {name, roll}
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

  const preferencesValid = () => props.allowedCounts.includes(preferences.length);

  return (
    <Grid container
      className={classes.root}
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Card className={classes.section1} variant="outlined">
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h4">
                {props.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h6">
                <Chip
                  color={preferencesValid() ? "primary" : "secondary"}
                  label={preferences.length === 0 ? "Current Choice: NOTA" :
                    (preferencesValid() ? "Choices valid" : "Choices invalid")}
                />
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="body2">
            {props.allowedCounts.length == 1
              ? "You are supposed to choose exactly "+props.allowedCounts[0]+" preference(s) for this post."
              : "You can choose either 0 (NOTA) or exactly "+props.allowedCounts[1]+" preference(s) for this post."
            }
          </Typography>
        </CardContent>
      </Card>
      <Divider variant="middle" />
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
                      {(index+1)+". "+candidate.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    &nbsp;&nbsp;&nbsp;&nbsp;{candidate.roll}
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
        props.candidates.filter(cand => !preferences.find(el => cand.roll==el.roll))
        .map(candidate => <CandidateCard id={candidate} onVote={onVote} key={candidate}/>)
      }
    </Grid>
  );
}
