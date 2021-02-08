import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CONFIG from '../config';

const useStyles = makeStyles({
  cCard: {
    minWidth: 275,
    maxWidth: 275,
  },
  media: {
    height: 275,
    margin: "auto",
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
            {CONFIG.DISPLAY_PHOTOS &&
              <CardMedia
                className={classes.media}
                image={"/photo/"+props.id.roll+".jpg"}
                title={props.id.roll}
              />
            }
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
