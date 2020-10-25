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
    },
    onShowResults: function
  }
  */

  const [ceohStatus, setCeohStatus] = React.useState({});
  const [currentStatus, setCurrentStatus] = React.useState(CEO_STATUS_ENUM.VOTING_OVER);

  const setErrorMessage = err => setCeohStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const onCalculateClick = () => setCurrentStatus(CEO_STATUS_ENUM.CALCULATING_RESULTS);

  const onResultReady = result => {
    setCurrentStatus(CEO_STATUS_ENUM.RESULTS_CALCULATED);
    submitResults(result);
  }

  const submitResults = (finalResult) => {
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
        if(res.status === 202){
          setCurrentStatus(CEO_STATUS_ENUM.RESULTS_SUBMITTED);
          props.onShowResults();
        }
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
    <Grid container spacing={4} justify="center" alignItems="center" direction="column">
      <CssBaseline />
      {ceohStatus.display && // Only display if ceohStatus.display is true
        <Grid item>
          <Alert severity={ceohStatus.severity}>{ceohStatus.message}</Alert>
        </Grid>
      }

      <Grid item>
        <Alert severity="info">Welcome CEO!<br/></Alert>
      </Grid>

      {currentStatus === CEO_STATUS_ENUM.VOTING_NOT_STARTED &&
        <Grid item>
          <Button type="button" onClick={onStartVotingClick} color="primary" variant="contained">
            Start Voting
          </Button>
        </Grid>
      }
      {currentStatus === CEO_STATUS_ENUM.VOTING_ON &&
        <Grid item>
          <Button type="button" onClick={onStopVotingClick} color="primary" variant="contained">
            Stop Voting
          </Button>
        </Grid>
      }
      {currentStatus === CEO_STATUS_ENUM.VOTING_OVER &&
        <Grid item>
          <Button type="button" onClick={onCalculateClick} color="primary" variant="contained">
            Calculate Results
          </Button>
        </Grid>
      }
      {currentStatus === CEO_STATUS_ENUM.CALCULATING_RESULTS &&
        <Grid item>
          <ResultCalculator
            ceoKey={props.user.data.privatekey}
            ceoPassword={props.user.password}
            onError={setErrorMessage}
            onResultReady={onResultReady}
          />
        </Grid>
      }
      {currentStatus === CEO_STATUS_ENUM.RESULTS_SUBMITTED &&
        <Grid item>
          <Button type="button" onClick={onPrepareNextRoundClick} color="primary" variant="contained">
            Prepare for Next Round
          </Button>
        </Grid>
      }
    </Grid>
  );
}
