import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
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
  postName: {
    flex: '1 1 100%',
  },
  boardRoot: {
    flexGrow: 1,
  },
  chip: {
    marginRight: theme.spacing(2),
  },
  candidateName: {
    display: 'flex',
    alignItems: 'center',
  },
  candidateEliminatedIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.error.main,
  },
  candidateWonIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.success.main,
  },
  candidateReElectionIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
  },
  candidateNoneIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
}));

function CandidateResultRow(props) {
  /*
  props = {
    name:
    roll:
    preference1:
    preference2:
    preference3:
  }
  */
  const classes = useStyles();
  return (
    <TableRow key={props.roll}>
      <TableCell component="th" scope="row" className={classes.candidateName}>{props.name}</TableCell>
      <TableCell align="center">{props.roll}</TableCell>
      <TableCell align="center">{props.preference1}</TableCell>
      <TableCell align="center">{props.preference2}</TableCell>
      <TableCell align="center">{props.preference3}</TableCell>
    </TableRow>
  );
}

function CandidateResultsGroup(props) {
  /*
  props = {
    postName:
    candidateCounts:
    postId:
  }
  */

  const classes = useStyles();

  const compareCandidates = (a, b) => {
    // if +ve => b comes before a
    // if -ve => a comes before b
    if(a.preference1 === b.preference1){
      if(a.preference2 === b.preference2)
        return b.preference3-a.preference3;
      else
        return b.preference2-a.preference2;
    }else{
      return b.preference1-a.preference1;
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content" id="panel1a-header">
        <Chip label="Ballot IDs" component="a" href={"/ballotids/"+props.postId} target={"_blank"} clickable className={classes.chip}/>
        <Typography className={classes.postName} variant="h5" id="tableTitle" align="center" component="div">
          {props.postName}
        </Typography>
      </AccordionSummary>
      <TableContainer>
        <Table aria-label="Candidate Results List">
          <TableHead>
            <TableRow>
              <TableCell align="left">Candidate Name</TableCell>
              <TableCell align="center">Roll Number</TableCell>
              <TableCell align="center">Pref. 1</TableCell>
              <TableCell align="center">Pref. 2</TableCell>
              <TableCell align="center">Pref. 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.candidateCounts.sort(compareCandidates).map(candidate =>
              <CandidateResultRow
                name={candidate.name}
                roll={candidate.roll}
                preference1={candidate.preference1}
                preference2={candidate.preference2}
                preference3={candidate.preference3}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Accordion>
  );
}

export default function ResultBoard(props) {
  /*
  props = {
    results: [{
      postId:
      postName:
      candidates: [{
        name:
        roll:
        status: (always "none" for now)
        preference1:
        preference2:
        preference3:
      }]
    }]
  }
  */

  const classes = useStyles();

  return (
    <Grid container className={classes.boardRoot} spacing={2}
      justify="center" alignItems="center">
      {
        props.results.map(post =>
          <Grid item key={post.postId}>
            <CandidateResultsGroup
              postId={post.postId}
              postName={post.postName}
              candidateCounts={post.candidates}/>
          </Grid>
        )
      }
    </Grid>
  )
}
