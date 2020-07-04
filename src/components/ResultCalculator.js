import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import VoteDecryptor from '../utils/VoteDecryptor';
import Keys from '../utils/Keys';

const useStyles = makeStyles((theme) => ({
    progress: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
      margin: theme.spacing(4),
    },
  }));
  
  
export default function ResultCalculator(props) {
  /*
  props = {
    ceoKey: serialized key,
    onResultReady: function,
    onError: function 
  }
  */

  const classes = useStyles();

  const STATUS_ENUM = Object.freeze({
    NOT_STARTED: 1,
    WAITING_FOR_DATA: 2,
    CALCULATING: 3,
    FINISHED: 4,
  });

  const [fetchedPosts, setFetchedPosts] = React.useState(null);
  const [fetchedVotes, setFetchedVotes] = React.useState(null);
  const [fetchedCandidates, setFetchedCandidates] = React.useState(null);
  const [resultStatus, setResultStatus] = React.useState(STATUS_ENUM.NOT_STARTED);
  const [resultProgress, setResultProgress] = React.useState(null);

  const fetchAndSet = (url, setter) => {
      fetch(url)
      .then(
        result => {
          if(result.status===200)
            result.json().then(jsonResult => setter(jsonResult));
          else
            result.text().then(text => props.onError(text));
        },
        err => props.onError(err),
      )
  }

  React.useEffect(() => {
    fetchAndSet("/ceo/fetchPosts", setFetchedPosts);
    fetchAndSet("/ceo/fetchCandidates", setFetchedCandidates);
    fetchAndSet("/ceo/fetchVotes", setFetchedVotes);
    setResultProgress(1);
    setResultStatus(STATUS_ENUM.WAITING_FOR_DATA);
  }, []);

  const getCategorizedVotesAndCandidates = () => {
    let categories = {};
    fetchedPosts.forEach(post => categories[post.postid] = {votes:[], candidates:[]});
    fetchedVotes.forEach(vote => categories[vote.postid].votes.push(vote.data));
    fetchedCandidates.forEach(candidate => categories[candidate.PostID].candidates.push(candidate));
    return categories;
  }

  const calculateResultsForPost = (candidates, votes, ceoKey) => {
    candidates.forEach(candidate => {
      candidate.UnserializedPrivateKey = Keys.unserializePrivateKey(candidate.PrivateKey);
      candidate.count = 0;
    });
    let strippedVotes = VoteDecryptor.stripVotes(votes, ceoKey);
    let ballotIdMap = {};
    strippedVotes.forEach(vote => {
      candidates.every(candidate => {
        let ballotId = VoteDecryptor.tryDecryption(
          vote,
          candidate.UnserializedPrivateKey
        );
        if(ballotId){
          ballotIdMap[ballotId] = candidate;
          candidate.count += 1;
          return false;
        }
        return true;
      });
    });
    return [ballotIdMap, candidates];
  }

  const calculateAllResults = () => {
    let categorizedData = getCategorizedVotesAndCandidates();
    let ceoKey = Keys.unserializePrivateKey(props.ceoKey);
    let ballotIdMaps = {};
    let candidateCounts = {};
    let numPosts = fetchedPosts.length;
    fetchedPosts.forEach((post, index) => {
      let result = calculateResultsForPost(
        categorizedData[post.postid].candidates,
        categorizedData[post.postid].votes,
        ceoKey,
      );
      ballotIdMaps[post.postid] = result[0];
      candidateCounts[post.postid] = result[1];
      setResultProgress(30+(index+1)*70/numPosts);
    });
    setResultStatus(STATUS_ENUM.FINISHED);
    props.onResultReady({
      posts: fetchedPosts,
      ballotIdMaps: ballotIdMaps,
      candidateCounts: candidateCounts,
    });
    console.log("Sending result");
  }

  const checkAndStartCalculation = () => {
    if (fetchedPosts && fetchedCandidates && fetchedVotes &&
    resultStatus === STATUS_ENUM.WAITING_FOR_DATA) {
      setResultStatus(STATUS_ENUM.CALCULATING);
      setResultProgress(30);
      calculateAllResults();
    }
  }

  React.useEffect(checkAndStartCalculation,
    [fetchedCandidates, fetchedPosts, fetchedVotes, resultStatus]);

  return (
    <div className={classes.progress}>
      <CircularProgress color="primary" variant="static" value={resultProgress}/>
    </div>
  );
}