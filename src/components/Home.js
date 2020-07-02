import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import VoterHome from './VoterHome';
import CEOHome from './CEOHome';

export default function Home(props) {
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
      { props.user.roll === "CEO"
        ? <CEOHome user={props.user}/>
        : <VoterHome user={props.user}/>
      }
    </Container>
  );
}