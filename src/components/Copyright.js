import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Open source software built by '}
      <Link color="inherit" target="_blank" href="https://dryairship.github.io/?utm_source=elections.pclub.in&utm_medium=referral&utm_campaign=elections">
        Priydarshi Singh.
      </Link>
      <br/>
      <Link color="inherit" target="_blank" href="https://github.com/dryairship/online-election-manager">
        The source code is available here.
      </Link>
    </Typography>
  );
}
