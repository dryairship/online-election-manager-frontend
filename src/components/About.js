import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default function About() {
  const [showName, setShowName] = React.useState(false);
  
  const show = () => setShowName(true);

  return (showName ?
    <Typography variant="body2" color="textSecondary" align="center">
      {'Improved version of an '}
      <Link color="black" target="_blank" href="https://github.com/dryairship/online-election-manager">
        ESC101A Project
      </Link>
      {' built by '}
      <Link color="black" target="_blank" href="https://dryairship.github.io/?utm_source=elections.pclub.in&utm_medium=referral&utm_campaign=ge2021">
        Priydarshi Singh.
      </Link>
    </Typography>
    :
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="#" onClick={show}>
        About
      </Link>
    </Typography>
  );
}
