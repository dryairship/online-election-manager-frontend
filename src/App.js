import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Copyright from './components/Copyright';
import LRVTabbedPane from './components/LRVTabbedPane';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);
  const onLogin = newUser => setUser(newUser);

  return (
    <div 
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
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
