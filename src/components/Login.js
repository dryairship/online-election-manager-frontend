import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import sjcl from 'sjcl-all';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login(props) {
  const classes = useStyles();

  const [captcha, setCaptcha] = useState({});
  const [lStatus, setLStatus] = useState({});

  const sha = text => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(text));

  useEffect(() => {
    if(!captcha.id) {
      captcha.id = true;
      fetch("/users/captcha")
      .then(res => res.json())
      .then(
        result => setCaptcha(result),
        _ => setLStatus({
          display: true,
          severity: "error",
          message: "CAPTCHA service is not working",
        }),
      );
    }
  });

  const login = () => {
    let rollVal = document.getElementById("l-roll").value;
    let passwordVal = document.getElementById("l-password").value;
    let captchaValue = document.getElementById("l-captcha").value;
    let passwordHash = sha(sha(sha(passwordVal)));

    let formData = new FormData();
    formData.append('roll', rollVal);
    formData.append('pass', passwordHash);
    formData.append('captchaId', captcha.id);
    formData.append('captchaValue', captchaValue);

    fetch("/users/login", {
      body: formData,
      method: "POST"
    }).then(
      response => {
        let code = response.status;
        if(code === 200) {
          response.json().then(userData =>{
            props.onLogin({
              roll: rollVal,
              password: passwordVal,
              data: userData,
            })
          });
        } else {
          response.text().then(text => 
            setLStatus({
              display: true,
              severity: "error",
              message: text,
            })
          );
        }
      },
      _ => setLStatus({
        display: true,
        severity: "error",
        message: "Error while making a request. Please check your internet connection."
      }),
    );
    setCaptcha({});
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {lStatus.display && // Only display if lStatus.display is true
          <Alert severity={lStatus.severity}>{lStatus.message}</Alert>
        }
        <form className={classes.form} noValidate>
          <Grid container justify="center">
            <img src={captcha.value} alt="CAPTCHA" />
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="l-captcha"
            label="CAPTCHA"
            name="captcha"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="l-roll"
            label="Roll Number"
            name="roll"
            autoComplete="roll"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="l-password"
            autoComplete="current-password"
          />
          <Grid container justify="center">
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={login}
              className={classes.submit}
            >
              Sign In
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
