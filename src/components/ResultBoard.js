import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  cCard: {
    minWidth: 275,
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  postName: {
    flex: '1 1 100%',
  },
  boardRoot: {
    flexGrow: 1,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function BallotIdRow(props) {
  /*
  props = {
    ballotId: 
    name:
    roll:
  }
  */
  return (
    <TableRow key={props.ballotId}>
      <TableCell component="th" scope="row" align="center">{props.ballotId}</TableCell>
      <TableCell align="center">{props.name}</TableCell>
      <TableCell align="center">{props.roll}</TableCell>
    </TableRow>
  );
}

function CandidateResultRow(props) {
  /*
  props = {
    name:
    roll:
    count:
  }
  */
  return (
    <TableRow key={props.roll}>
      <TableCell component="th" scope="row" align="center">{props.name}</TableCell>
      <TableCell align="center">{props.roll}</TableCell>
      <TableCell align="center">{props.count}</TableCell>
    </TableRow>
  );
}

function BallotIdGroup(props) {
  /*
  props = {
    postName:
    ballotIdMap:
  }
  */

  const classes = useStyles();

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.postName} variant="h5" id="tableTitle" align="center" component="div">
          {props.postName}
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table aria-label="Ballot Id List">
          <TableHead>
            <TableRow>
              <TableCell align="center">Ballot ID</TableCell>
              <TableCell align="center">Candidate Name</TableCell>
              <TableCell align="center">Roll Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.keys(props.ballotIdMap).map(ballotId => 
                <BallotIdRow ballotId={ballotId} 
                  name={props.ballotIdMap[ballotId].Name}
                  roll={props.ballotIdMap[ballotId].Roll}/>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function CandidateResultsGroup(props) {
  /*
  props = {
    postName:
    candidateCounts:
  }
  */

  const classes = useStyles();

  const compareCandidates = (a, b) => {
    return b.count - a.count;
  }

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.postName} variant="h5" id="tableTitle" align="center" component="div">
          {props.postName}
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table aria-label="Candidate Results List">
          <TableHead>
            <TableRow>
              <TableCell align="center">Candidate Name</TableCell>
              <TableCell align="center">Roll Number</TableCell>
              <TableCell align="center">Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.candidateCounts.sort(compareCandidates).map(candidate => {
                console.log(candidate);
                return <CandidateResultRow name={candidate.Name} 
                  roll={candidate.Roll}
                  count={candidate.count}/>
              }
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function ResultBoard(props) {
  /*
  props = {
    result: {
      posts: fetchedPosts,
      ballotIdMaps: ballotIdMaps,
      candidateCounts: candidateCounts,
    }
  }
  */

  const classes = useStyles();

  return (
    <Grid container className={classes.boardRoot} spacing={2}
      direction="column" justify="center" alignItems="center">
      {
        props.result.posts.map(post => 
          <Grid item xs={12}>
            <CandidateResultsGroup key={post.postname}
              postName={post.postname} 
              candidateCounts={props.result.candidateCounts[post.postid]}/>
          </Grid>
        )
      }
      {
        props.result.posts.map(post => 
          <Grid item xs={12}>
            <BallotIdGroup key={post.postname}
              postName={post.postname} 
              ballotIdMap={props.result.ballotIdMaps[post.postid]}/>
          </Grid>
        )
      }
    </Grid>
  )
}