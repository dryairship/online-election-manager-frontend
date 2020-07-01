import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Captcha from './Captcha';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  media: {
    height: 140,
  },
}));

export default function VerificationCode() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>

          <Captcha/>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="captcha"
            label="CAPTCHA"
            name="captcha"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="roll"
            label="Roll Number"
            id="roll"
            autoComplete="roll"
          />
          <Grid container justify="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Get Verification Code
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
}