import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function ConfirmVotes(props) {
  /*
    props: {
      open: boolean,
      onClose: function
      posts: array
      candidates: map (postid->preferences)
    }
  */

  const handleAgree = () => props.onClose(true);
  const handleDisagree = () => props.onClose(false);

  return (
    props.open &&
      (<Dialog
        open={props.open}
        onClose={handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm your vote(s)"}</DialogTitle>
        <DialogContent>
          <List component="nav">
            Please verify that the choices below are correct.<br/>
            IMPORTANT: You will not be able to change your vote after you click on 'Confirm'.<br/><br/>
            {props.posts && props.candidates &&
              props.posts.map(post => (
                <ListItem key={post.postId} dense={true}>
                  <ListItemText disableTypography={true}
                    primary={post.postName+": "}
                    secondary={props.candidates[post.postId] && props.candidates[post.postId].length > 0 ?
                    <ol>
                      {props.candidates[post.postId].map(candidate =>
                        <li key={candidate.roll}>{candidate.name+" ("+candidate.roll+")"}</li>
                      )}
                    </ol>
                    :
                    <p>NOTA</p>
                  }/>
                </ListItem>
              ))
            }
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            Go Back
          </Button>
          <Button onClick={handleAgree} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}
