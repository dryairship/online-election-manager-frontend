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

const RESULT_STATUS_ENUM = Object.freeze({
  NOT_STARTED: 1,
  WAITING_FOR_DATA: 2,
  CALCULATING: 3,
  FINISHED: 4,
});

const CANDIDATE_STATUS_ENUM = Object.freeze({
  WON: "won",
  ELIMINATED: "eliminated",
  REELECTION: "reelection",
  DEFEATED: "defeated",
  NONE: "none",
});

export {CANDIDATE_STATUS_ENUM};

export default function ResultCalculator(props) {
  /*
  props = {
    ceoKey: serialized key,
    onResultReady: function,
    onError: function 
  }
  */

  const classes = useStyles();

  const [fetchedPosts, setFetchedPosts] = React.useState(null);
  const [fetchedVotes, setFetchedVotes] = React.useState(null);
  const [fetchedCandidates, setFetchedCandidates] = React.useState(null);
  const [resultStatus, setResultStatus] = React.useState(RESULT_STATUS_ENUM.NOT_STARTED);

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

  const onInit = () => {
    fetchAndSet("/ceo/fetchPosts", setFetchedPosts);
    fetchAndSet("/ceo/fetchCandidates", setFetchedCandidates);
    fetchAndSet("/ceo/fetchVotes", setFetchedVotes);
    setResultStatus(RESULT_STATUS_ENUM.WAITING_FOR_DATA);
  }

  React.useEffect(onInit, []);

  const getCategorizedVotesAndCandidates = () => {
    let categories = {};
    fetchedPosts.forEach(post => categories[post.postid] = {votes:[], candidates:[]});
    fetchedVotes.forEach(vote => categories[vote.postid].votes.push(vote.data));
    fetchedCandidates.forEach(candidate => categories[candidate.PostID].candidates.push(candidate));
    return categories;
  }

  const addStatusToCandidates = (candidates, numVotes) => {
    let maxCount = 0, minCount = 10000000;
    candidates.forEach(candidate => {
      maxCount = Math.max(maxCount, candidate.count);
      minCount = Math.min(minCount, candidate.count);
    });
    if(2*maxCount > numVotes) {
      candidates.forEach(candidate => {
        if(candidate.count === maxCount)
          candidate.status = CANDIDATE_STATUS_ENUM.WON;
        else
          candidate.status = CANDIDATE_STATUS_ENUM.DEFEATED;
      });
    } else {
      candidates.forEach(candidate => {
        if(candidate.count === minCount)
          candidate.status = CANDIDATE_STATUS_ENUM.ELIMINATED;
        else
          candidate.status = CANDIDATE_STATUS_ENUM.REELECTION;
      });
    }
    return candidates;
  }

  const calculateResultsForPost = (candidates, votes) => {
    candidates.forEach(candidate => {
      candidate.UnserializedPrivateKey = Keys.unserializePrivateKey(candidate.PrivateKey);
      candidate.count = 0;
    });
    let strippedVotes = VoteDecryptor.stripVotes(votes, props.ceoKey, props.ceoPassword);
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

  const isPostResolved = candidateCounts => {
    return candidateCounts.some(candidate => candidate.status === CANDIDATE_STATUS_ENUM.WON);
  }

  const calculateAllResults = () => {
    let categorizedData = getCategorizedVotesAndCandidates();
    let ballotIdMaps = {};
    let candidateCounts = {};
    let posts = fetchedPosts;
    posts.forEach((post, index) => {
      let result = calculateResultsForPost(
        categorizedData[post.postid].candidates,
        categorizedData[post.postid].votes,
      );
      ballotIdMaps[post.postid] = result[0];
      candidateCounts[post.postid] = addStatusToCandidates(result[1], categorizedData[post.postid].votes.length);
      posts[index].resolved = isPostResolved(candidateCounts[post.postid]);
    });
    setResultStatus(RESULT_STATUS_ENUM.FINISHED);
    props.onResultReady({
      posts: fetchedPosts,
      ballotIdMaps: ballotIdMaps,
      candidateCounts: candidateCounts,
    });
  }

  const checkAndStartCalculation = () => {
    if (fetchedPosts && fetchedCandidates && fetchedVotes &&
    resultStatus === RESULT_STATUS_ENUM.WAITING_FOR_DATA) {
      setResultStatus(RESULT_STATUS_ENUM.CALCULATING);
      calculateAllResults();
    }
  }

  React.useEffect(checkAndStartCalculation,
    [fetchedCandidates, fetchedPosts, fetchedVotes, resultStatus]);

  return (
    <div className={classes.progress}>
      <CircularProgress color="primary"/>
    </div>
  );
}
