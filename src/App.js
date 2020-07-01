import React from 'react';
import Box from '@material-ui/core/Box';
import Copyright from './components/Copyright';
import LRVTabbedPane from './components/LRVTabbedPane';

function App() {
  return (
    <div 
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <LRVTabbedPane/>
      <Box mt={8}>
        <Copyright />
      </Box>
    </div>
  );
}

export default App;
