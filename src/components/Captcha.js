import React from 'react';
import Grid from '@material-ui/core/Grid';
import sample from '../static/captcha.png';

function Captcha() {
  return (
    <Grid container justify="center">
      <img src={sample} alt="Captcha" />
    </Grid>
  );
}
export default Captcha;