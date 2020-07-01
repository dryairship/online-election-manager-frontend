import React from 'react';
import Box from '@material-ui/core/Box';
import Login from './components/Login';
import Copyright from './components/Copyright';

function App() {
  return (
    <div 
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Login/>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
}

export default App;
