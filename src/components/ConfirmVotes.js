import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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
      candidates: map
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
          <DialogContentText id="alert-dialog-description">
            <List component="nav" aria-label="mailbox folders">
              Please verify that the choices below are correct:<br/><br/>
              {props.posts && props.candidates && 
                props.posts.map(post => (
                  <ListItem>
                    <ListItemText primary={post.PostName+": "}/>
                    <ListItemText primary={props.candidates[post.PostID].Name} secondary={props.candidates[post.PostID].Roll}/>
                  </ListItem>
                ))
              }
              <br/>You will not be able to change your vote after you click on 'Confirm'.
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAgree} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}