import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import CandidateCard from './CandidateCard';

export default function PostCard(props) {
  /*
  props = {
    id: string
    name: string
    candidates: array of strings
  }
  */
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Alert severity="info">{props.name}</Alert>
      {props.candidates &&
        props.candidates.map(candidate => (
          <CandidateCard id={candidate} />
        ))
      }
    </Container>
  );
}