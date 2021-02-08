import React, { useState } from 'react';
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
import CONFIG from '../config';

export const CHOICE_STATUS_ENUM = Object.freeze({
  NOTHING_CHOSEN: 1,
  CANDIDATE_CHOSEN: 2,
  NOTA_CHOSEN: 3,
});

const CANDIDATE_NOTA = Object.freeze({
  name: "NOTA",
  roll: "0",
});

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
    fontSize: 18,
  },
}));

const prefText = ["First", "Second", "Third"];

export default function PostCard(props) {
  /*
  props = {
    id: string
    name: string
    allowedCounts: array of numbers
    candidates: array of candidates {name, roll}
    setPreferences: function
    setChoiceStatus: function
  }
  */

  const classes = useStyles();

  const [preferences, setPreferences] = useState([]);
  const [choiceStatus, setChoiceStatus] = useState(CHOICE_STATUS_ENUM.NOTHING_CHOSEN);

  const onVote = candidate => {
    if(candidate.roll === "0"){
      setChoiceStatus(CHOICE_STATUS_ENUM.NOTA_CHOSEN);
      setPreferences([]);
    }else{
      setChoiceStatus(CHOICE_STATUS_ENUM.CANDIDATE_CHOSEN);
      setPreferences([...preferences, candidate]);
    }
  }

  const resetVote = () => {
    setPreferences([]);
    setChoiceStatus(CHOICE_STATUS_ENUM.NOTHING_CHOSEN);
  }

  const informParentAboutChange = () => {
    props.setPreferences(props.id, preferences);
    props.setChoiceStatus(props.id, choiceStatus);
  }
  React.useEffect(informParentAboutChange, [preferences, choiceStatus]);

  const preferencesValid = () => choiceStatus !== CHOICE_STATUS_ENUM.NOTHING_CHOSEN && props.allowedCounts.includes(preferences.length);

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
                  label={preferencesValid() ? "Choices valid" : "Choices invalid"}
                />
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="body2"  className={classes.title}>
            {props.allowedCounts.length === 1
              ? "You are supposed to choose exactly "+props.allowedCounts[0]+" preference(s) for this post."
              : "You can choose either NOTA or exactly "+props.allowedCounts[1]+" preference(s) for this post."
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
                <Typography className={classes.title} gutterBottom>
                  <u>Chosen Candidates</u>
                </Typography>
                {preferences.map((candidate, index) => (
                  <div key={index}>
                    <Typography gutterBottom>
                    {prefText[index]+" preference:"}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {(index+1)+". "+candidate.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{candidate.roll}
                    </Typography>
                    <hr/>
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
      {choiceStatus === CHOICE_STATUS_ENUM.NOTA_CHOSEN
        && (
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  You have chosen NOTA.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={resetVote} variant="contained" color="secondary">Reset Vote</Button>
              </CardActions>
            </Card>
          </Grid>
        )
      }
      {choiceStatus === CHOICE_STATUS_ENUM.NOTHING_CHOSEN &&
        props.candidates && preferences.length < Math.min(CONFIG.MAX_PREFERENCES, props.candidates.length) &&
        (props.allowedCounts.length === 1 ?
            props.candidates.filter(cand => !preferences.find(el => cand.roll===el.roll))
            .map(candidate => <CandidateCard id={candidate} onVote={onVote} key={candidate}/>)
          :
            props.candidates.concat(CANDIDATE_NOTA).filter(cand => !preferences.find(el => cand.roll===el.roll))
            .map(candidate => <CandidateCard id={candidate} onVote={onVote} key={candidate}/>)
        )
      }
      {choiceStatus === CHOICE_STATUS_ENUM.CANDIDATE_CHOSEN &&
        props.candidates && preferences.length < Math.min(CONFIG.MAX_PREFERENCES, props.candidates.length) &&
        props.candidates.filter(cand => !preferences.find(el => cand.roll===el.roll))
        .map(candidate => <CandidateCard id={candidate} onVote={onVote} key={candidate}/>)
      }
    </Grid>
  );
}
