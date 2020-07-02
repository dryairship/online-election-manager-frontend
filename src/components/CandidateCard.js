import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

export default function CandidateCard(props) {
  /*
  props = {
    id: string // Candidate ID
  }
  */

  /*
  candidateData: {
    "Username":"",
    "Name":"",
    "PublicKey":"",
    "Manifesto":"http://ix.io/1EYr",
    "State":1,
    "KeyState":0}
  */
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
        {ccStatus.display && // Only display if ccStatus.display is true
          <Alert severity={ccStatus.severity}>{ccStatus.message}</Alert>
        }
        <Alert severity="info">{props.id}<br/></Alert>
        <Alert severity="info">{JSON.stringify(candidateData)}<br/></Alert>
    </Container>
  );
}