import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import VoterHome from './VoterHome';
import CEOHome from './CEOHome';

export default function Home(props) {
  /*
  props = {
    user: {
      roll: 
      password:
      data:
    }
  }
  */
  return (
    <Grid container>
      <CssBaseline />
      { props.user.roll === "CEO"
        ? <Grid item xs={12}><CEOHome user={props.user}/></Grid>
        : <Grid item xs={12}><VoterHome user={props.user}/></Grid>
      }
    </Grid>
  );
}