import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

export default function CEOHome(props) {
  /*
  props = {
    user: {
      roll: 
      password:
    }
  }
  */

  const STATUS_ENUM = Object.freeze({
    NOT_STARTED: 1,
    WAITING_FOR_DATA: 2,
    CALCULATING: 3,
  });

  const [fetchedPosts, setFetchedPosts] = React.useState(null);
  const [fetchedVotes, setFetchedVotes] = React.useState(null);
  const [fetchedCandidates, setFetchedCandidates] = React.useState(null);
  const [ceohStatus, setCeohStatus] = React.useState({});
  const [resultStatus, setResultStatus] = React.useState(STATUS_ENUM.NOT_STARTED);

  const setErrorMessage = err => setCeohStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const fetchAndSet = (url, setter) => {
      fetch(url)
      .then(
        result => {
          if(result.status===200)
            result.json().then(jsonResult => setter(jsonResult));
          else
            result.text().then(text => setErrorMessage(text));
        },
        err => setErrorMessage(err),
      )
  }

  const onCalculateClick = () => {
    fetchAndSet("/ceo/fetchPosts", setFetchedPosts);
    fetchAndSet("/ceo/fetchCandidates", setFetchedCandidates);
    fetchAndSet("/ceo/fetchVotes", setFetchedVotes);
    setResultStatus(STATUS_ENUM.WAITING_FOR_DATA);
  }

  const checkAndStartCalculation = () => {
    if (fetchedPosts && fetchedCandidates && fetchedVotes &&
    resultStatus === STATUS_ENUM.WAITING_FOR_DATA) {
      setResultStatus(STATUS_ENUM.CALCULATING);
      console.log(resultStatus);
      console.log("All data fetched.");
      console.log(fetchedPosts);
      console.log(fetchedCandidates);
      console.log(fetchedVotes);
    }
  }

  React.useEffect(checkAndStartCalculation,
    [fetchedCandidates, fetchedPosts, fetchedVotes, resultStatus]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
        {ceohStatus.display && // Only display if ceohStatus.display is true
          <Alert severity={ceohStatus.severity}>{ceohStatus.message}</Alert>
        }
        <Alert severity="info">CEO Home!<br/></Alert>
        <Button type="button" onClick={onCalculateClick} color="primary" variant="contained">
          Calculate Results
        </Button>
    </Container>
  );
}