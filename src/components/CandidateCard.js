import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  cCard: {
    minWidth: 275,
  },
});

export default function CandidateCard(props) {
  /*
  props = {
    id: string // Candidate ID
    onVote: function
  }
  */

  /*
  candidateData: {
    "Roll": ""
    "Username":"",
    "Name":"",
    "PublicKey":"",
    "Manifesto":"",
    "State":1,
    "KeyState":0}
  */

  const classes = useStyles();
  const [candidateData, setCandidateData] = useState(null);
  const [ccStatus, setCCStatus] = useState({});
  
  useEffect(() => {
    if(!candidateData) {
      fetch("/election/getCandidateInfo/"+props.id)
      .then(res => res.json())
      .then(
        result => setCandidateData(result),
        _ => setCCStatus({
          display: true,
          severity: "error",
          message: "Error while making a request. Please check your internet connection."
        })
      );
    }
  }, []);


  return (
    <Grid item xs={3} className={classes.cCard}>
        {ccStatus.display && // Only display if ccStatus.display is true
          <Alert severity={ccStatus.severity}>{ccStatus.message}</Alert>
        }
        {candidateData && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {candidateData.Name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {candidateData.Roll}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => props.onVote(candidateData)}>Vote</Button>
            </CardActions>
          </Card>
        )}
    </Grid>
  );
}