import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import sjcl from 'sjcl';

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

export default function Register() {
  const classes = useStyles();

  const [rStatus, setRStatus] = useState({});

  const registerUser = () => {
    let rollVal = document.getElementById("r-roll").value;
    let passwordVal = document.getElementById("r-password").value;
    let confirmPasswordVal = document.getElementById("r-confirm-password").value;
    let verificationCodeVal = document.getElementById("r-verification-code").value;
    
    if(passwordVal !== confirmPasswordVal) {
      setRStatus({
        display: true,
        severity: "error",
        message: "The passwords do not match."
      });
      return;
    }

    let passwordHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(passwordVal));
    let formData = new FormData();
    formData.append('roll', rollVal);
    formData.append('pass', passwordHash);
    formData.append('auth', verificationCodeVal);

    fetch("/users/register", {
      body: formData,
      method: "POST"
    }).then(
      response => {
        let code = response.status;
        response.text().then(text => 
          setRStatus({
            display: true,
            severity: code === 202 ? "success" : "error",
            message: text,
          })
        );
      },
      _ => setRStatus({
        display: true,
        severity: "error",
        message: "Error while making a request. Please check your internet connection."
      }),
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          {rStatus.display && // Only display if rStatus.display is true
            <Alert severity={rStatus.severity}>{rStatus.message}</Alert>
          }
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="r-roll"
            label="Roll Number"
            name="roll"
            autoComplete="roll"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="r-password"
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="r-confirm-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="r-verification-code"
            label="Verification Code"
            name="verification-code"
          />
          <Grid container justify="center">
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={registerUser}
              className={classes.submit}
            >
              Register
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
}