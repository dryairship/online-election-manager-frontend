import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import About from './components/About';
import LRVTabbedPane from './components/LRVTabbedPane';
import Home from './components/Home';
import Results from './components/Results';
import Fab from '@material-ui/core/Fab';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';


const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    }
  },
}));

function App() {
  const classes = useStyles();

  const [user, setUser] = useState(null);
  const [showingResults, setShowingResults] = useState(false);
  const [resultsAvailable, setResultsAvailable] = useState(false);

  const onLogin = newUser => setUser(newUser);

  const onShowResults = () => setShowingResults(true);

  const onInit = () => {
    fetch("/api/election/getElectionState")
    .then(res => res.text())
    .then(state => setResultsAvailable(state === "ResultsCalculated"))
  }
  React.useEffect(onInit, []);

  return (
    <div style={{
      width: '80%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: '50px auto',
    }}>
      {resultsAvailable && !showingResults &&
        <Fab variant="extended" className={classes.fab} onClick={onShowResults}>
          <AssignmentTurnedInIcon className={classes.extendedIcon} />
          <Typography>
            View Results
          </Typography>
        </Fab>
      }
      {showingResults &&
        <Results/>
      }
      {!showingResults && user &&
        <Home user={user} onShowResults={onShowResults}/>
      }
      {!showingResults && !user &&
        <LRVTabbedPane onLogin={onLogin}/>
      }
      <Box mt={8}>
        <About />
      </Box>
    </div>
  );
}

export default App;
