import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ResultBoard from './ResultBoard';
import ResultCalculator from './ResultCalculator';

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
  const [calculatingResult, setCalculatingResult] = React.useState(false);
  const [finalResult, setFinalResult] = React.useState(null);

  const setErrorMessage = err => setCeohStatus({
    display: true,
    severity: "error",
    message: err,
  });

  const onCalculateClick = () => setCalculatingResult(true);
  const onResultReady = result => {
    console.log("Received result");
    setFinalResult(result);
  }

  return (
    <Grid container spacing={4} justify="center" alignItems="center">
      <CssBaseline />
        {ceohStatus.display && // Only display if ceohStatus.display is true
          <Alert severity={ceohStatus.severity}>{ceohStatus.message}</Alert>
        }
        <Alert severity="info">CEO Home!<br/></Alert>
        {calculatingResult && 
          <ResultCalculator ceoKey={props.user.data.privatekey} 
            onError={setErrorMessage}
            onResultReady={onResultReady}/>
        }
        {finalResult != null &&
          <ResultBoard result={finalResult} />
        }
        <Button type="button" onClick={onCalculateClick} color="primary" variant="contained">
          Calculate Results
        </Button>
    </Grid>
  );
}