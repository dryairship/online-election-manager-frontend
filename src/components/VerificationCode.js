import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

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

export default function VerificationCode() {
  const classes = useStyles();

  const [captcha, setCaptcha] = useState({});
  const [vcStatus, setVCStatus] = useState({});

  useEffect(() => {
    if(!captcha.id) {
      captcha.id = true;
      fetch("/users/captcha")
      .then(res => res.json())
      .then(
        result => setCaptcha(result),
        _ => setVCStatus({
          display: true,
          severity: "error",
          message: "CAPTCHA service is not working",
        }),
      );
    }
  });

  const sendVerificationCode = () => {
    let rollVal = document.getElementById("vc-roll").value;
    let captchaVal = {
      id: captcha.id,
      value: document.getElementById("vc-captcha").value,
    };
    fetch("/users/mail/"+rollVal, {
      method: 'POST',
      body: JSON.stringify(captchaVal),
    }).then(
      response => {
        let code = response.status;
        response.text().then(text =>
          setVCStatus({
            display: true,
            severity: code === 202 ? "success" : "error",
            message: text,
          })
        );
      },
      _ => setVCStatus({
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
        {vcStatus.display && // Only display if vcStatus.display is true
          <Alert severity={vcStatus.severity}>{vcStatus.message}</Alert>
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
            id="vc-captcha"
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
            id="vc-roll"
            autoComplete="roll"
          />
          <Grid container justify="center">
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={sendVerificationCode}
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