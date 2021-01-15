import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import ResultBoard from './ResultBoard';

export default function Results() {
  const [results, setResults] = React.useState(null);

  const onInit = () => {
    fetch("/api/election/results")
    .then(res => res.json())
    .then(res => setResults(res))
    .catch(err => console.log(err));
  }
  React.useEffect(onInit, []);

  return (
    <Grid container>
      <CssBaseline />
      {results && 
        <ResultBoard results={results}/>
      }
    </Grid>
  );
}
