import React from 'react';
import Alert from '@material-ui/lab/Alert';
import CssBaseline from '@material-ui/core/CssBaseline';
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
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
        <Alert severity="info">CEO Home!<br/></Alert>
    </Container>
  );
}