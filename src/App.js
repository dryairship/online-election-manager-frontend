import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Copyright from './components/Copyright';
import LRVTabbedPane from './components/LRVTabbedPane';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);
  const onLogin = newUser => setUser(newUser);

  return (
    <div style={{
      width: '80%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: '50px auto',
    }}>
      {user
        ? <Home user={user}/>
        : <LRVTabbedPane onLogin={onLogin}/>
      }
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
}

export default App;
