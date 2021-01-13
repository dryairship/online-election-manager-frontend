import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  cCard: {
    minWidth: 275,
  },
});

export default function CandidateCard(props) {
  /*
  props = {
    id: candidate {name, roll} // Candidate ID
    onVote: function
  }
  */

  const classes = useStyles();

  return (
    <Grid item xs={3} className={classes.cCard}>
        {props.id && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {props.id.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {props.id.roll}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" onClick={() => props.onVote(props.id)}>Vote</Button>
            </CardActions>
          </Card>
        )}
    </Grid>
  );
}
