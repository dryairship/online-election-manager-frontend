import React, { useState } from 'react';
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

  const [lStatus, setLStatus] = useState({});

  const sha = text => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(text));

  const login = () => {
    let rollVal = document.getElementById("l-roll").value;
    let passwordVal = document.getElementById("l-password").value;
    let passwordHash = sha(sha(sha(passwordVal)));

    let formData = new FormData();
    formData.append('roll', rollVal);
    formData.append('pass', passwordHash);

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
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {lStatus.display && // Only display if lStatus.display is true
          <Alert severity={lStatus.severity}>{lStatus.message}</Alert>
        }
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="l-roll"
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
