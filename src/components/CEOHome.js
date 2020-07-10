import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ResultCalculator from './ResultCalculator';
import { getPostableResult } from '../utils/Results';
import Keys from '../utils/Keys';

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
        if(res.status === 202)
          setCurrentStatus(CEO_STATUS_ENUM.RESULTS_SUBMITTED);
      },
      err => setErrorMessage(err)
    );
  }

  const onPrepareNextRoundClick = () => {
    fetch("/ceo/prepareForNextRound", {
      method: "POST",
    })
    .then(
      res => {
        res.text().then(text => setCeohStatus({
          display: true,
          severity: res.status===200?"success":"error",
          message: text,
        }));
        if(res.status === 200)
          setCurrentStatus(CEO_STATUS_ENUM.VOTING_NOT_STARTED);
      },
      err => setErrorMessage(err)
    );
  }

  const onStartVotingClick = () => {
    let [ publicKey, privateKey ] = Keys.generateKeysForCEO(props.user.password);
    let data = {
      pubkey: publicKey,
      privkey: privateKey,
    };
    fetch("/ceo/startVoting", {
      method: "POST",
      body: JSON.stringify(data),
    })
    .then(
      res => {
        res.text().then(text => setCeohStatus({
          display: true,
          severity: res.status===200?"success":"error",
          message: text,
        }));
        if(res.status === 200)
          setCurrentStatus(CEO_STATUS_ENUM.VOTING_ON);
      },
      err => setErrorMessage(err)
    );
  }

  const onStopVotingClick = () => {
    fetch("/ceo/stopVoting", {
      method: "POST",
    })
    .then(
      res => {
        res.text().then(text => setCeohStatus({
          display: true,
          severity: res.status===200?"success":"error",
          message: text,
        }));
        if(res.status === 200)
          setCurrentStatus(CEO_STATUS_ENUM.VOTING_OVER);
      },
      err => setErrorMessage(err)
    );
  }

  const onInit = () => {
    fetch("/election/getElectionState")
    .then(res => res.text())
    .then(state => {
      if(state === "0")
        setCurrentStatus(CEO_STATUS_ENUM.VOTING_NOT_STARTED);
      else if(state === "1")
        setCurrentStatus(CEO_STATUS_ENUM.VOTING_ON);
      else if(state === "2")
        setCurrentStatus(CEO_STATUS_ENUM.VOTING_OVER);
      else if(state === "3")
        setCurrentStatus(CEO_STATUS_ENUM.RESULTS_SUBMITTED);
    })
    .catch(err => console.log(err));
  }
  React.useEffect(onInit, []);

  return (
    <Grid container spacing={4} justify="center" alignItems="center" classes={{flexDirection: 'column'}}>
      <CssBaseline />
        {ceohStatus.display && // Only display if ceohStatus.display is true
          <Alert severity={ceohStatus.severity}>{ceohStatus.message}</Alert>
        }
        <Alert severity="info">CEO Home!<br/></Alert>

        {currentStatus === CEO_STATUS_ENUM.VOTING_NOT_STARTED &&
          <Button type="button" onClick={onStartVotingClick} color="primary" variant="contained">
            Start Voting
          </Button>
        }
        {currentStatus === CEO_STATUS_ENUM.VOTING_ON &&
          <Button type="button" onClick={onStopVotingClick} color="primary" variant="contained">
            Stop Voting
          </Button>
        }
        {currentStatus === CEO_STATUS_ENUM.VOTING_OVER &&
          <Button type="button" onClick={onCalculateClick} color="primary" variant="contained">
            Calculate Results
          </Button>
        }
        {currentStatus === CEO_STATUS_ENUM.CALCULATING_RESULTS &&
          <ResultCalculator
            ceoKey={props.user.data.privatekey}
            ceoPassword={props.user.password}
            onError={setErrorMessage}
            onResultReady={onResultReady}
          />
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
