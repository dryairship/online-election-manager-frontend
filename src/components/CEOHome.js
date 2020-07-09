import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ResultBoard from './ResultBoard';
import ResultCalculator from './ResultCalculator';
import { getPostableResult } from '../utils/Results';

const CEO_STATUS_ENUM = Object.freeze({
  VOTING_NOT_STARTED: 1,
  VOTING_ON: 2,
  VOTING_OVER: 3,
  CALCULATING_RESULTS: 4,
  RESULTS_CALCULATED: 5,
  RESULTS_SUBMITTED: 6,
});

export default function CEOHome(props) {
  /*
  props = {
    user: {
      roll: 
      password:
      data:
    }
  }
  */

  const [ceohStatus, setCeohStatus] = React.useState({});
  const [currentStatus, setCurrentStatus] = React.useState(CEO_STATUS_ENUM.VOTING_OVER);
  const [finalResult, setFinalResult] = React.useState(null);

  const setErrorMessage = err => setCeohStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const onCalculateClick = () => setCurrentStatus(CEO_STATUS_ENUM.CALCULATING_RESULTS);

  const onResultReady = result => {
    console.log("Received result");
    console.log(result);
    setFinalResult(result);
    setCurrentStatus(CEO_STATUS_ENUM.RESULTS_CALCULATED);
  }

  const onSubmitResultsClick = () => {
    let postableResult = getPostableResult(finalResult);
    fetch("/ceo/submitResults", {
      method: "POST",
      body: JSON.stringify(postableResult),
    })
    .then(
      res => {
        res.text().then(text => setCeohStatus({
          display: true,
          severity: res.status===202?"success":"error",
          message: text,
        }));
      },
      err => setErrorMessage(err)
    );
  }

  const onPrepareNextRoundClick = () => {

  }

  return (
    <Grid container spacing={4} justify="center" alignItems="center">
      <CssBaseline />
        {ceohStatus.display && // Only display if ceohStatus.display is true
          <Alert severity={ceohStatus.severity}>{ceohStatus.message}</Alert>
        }
        <Alert severity="info">CEO Home!<br/></Alert>
        {currentStatus === CEO_STATUS_ENUM.VOTING_OVER &&
          <Button type="button" onClick={onCalculateClick} color="primary" variant="contained">
            Calculate Results
          </Button>
        }
        {currentStatus === CEO_STATUS_ENUM.CALCULATING_RESULTS &&
          <ResultCalculator ceoKey={props.user.data.privatekey} 
            onError={setErrorMessage}
            onResultReady={onResultReady}/>
        }
        {currentStatus === CEO_STATUS_ENUM.RESULTS_CALCULATED &&
          <Button type="button" onClick={onSubmitResultsClick} color="primary" variant="contained">
            Submit Results
          </Button>
        }
        {currentStatus === CEO_STATUS_ENUM.RESULTS_SUBMITTED &&
          <Button type="button" onClick={onPrepareNextRoundClick} color="primary" variant="contained">
            Prepare for Next Round
          </Button>
        }
    </Grid>
  );
}
