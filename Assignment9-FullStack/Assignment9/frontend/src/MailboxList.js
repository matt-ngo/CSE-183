/*
  SOURCES
  Provided "Assignment 6 - Simplest Solution"
*/
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
// ICONS
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DraftsIcon from '@material-ui/icons/Drafts';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import SettingsIcon from '@material-ui/icons/Settings';
// Settings
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import SharedContext from './SharedContext';
import axios from 'axios';


const builtInBoxes = [
  {name: 'Starred', icon: <StarIcon/>},
  {name: 'Sent', icon: <SendIcon/>},
  {name: 'Drafts', icon: <DraftsIcon/>},
  {name: 'Trash', icon: <DeleteIcon/>},
];

const createdBoxes = [
  {name: 'Spam', icon: <ArrowForwardIcon/>},
];

let unread = [];

const getUnreadCounts = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return;
  }

  const headers = {
    headers: {'Authorization': `Bearer ${user.accessToken}`},
  };

  axios.get(`http://localhost:3010/countUnread/${user.email}`, headers)
      .then((res) => {
        if (res.statusText != 'OK') {
          console.log('Response not ok');
        }
        unread = res.data;
      }, (err) => {
        console.log(err);
      });
};

/**
 * @return {object} JSX
 */
function MailboxList() {
  const {
    mailbox, selectMailbox, handleSettingsOpen, // settingsOpen,
  } = React.useContext(SharedContext);

  const [open, setOpen] = React.useState(false);
  let input = '';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    createdBoxes.push({name: input, icon: <ArrowForwardIcon/>});
    // const user = JSON.parse(localStorage.getItem('user'));
    // const headers = {
    //   headers: {'Authorization': `Bearer ${user.accessToken}`},
    // };
    // const body = {};
    // body.name = input;

    // axios.post(`http://localhost:3010/newMailbox/${user.email}`, body, headers)
    //     .then((res) => {
    //       if (res.status != 200) {
    //         throw res;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const textInput = event.target.value;
    input = textInput;
  };

  // re render page on every fetch to the email list + every modification to
  // emails array
  React.useEffect(() => {
    getUnreadCounts();
  }, [open]); // emails emailOpen


  const SaveDialog = () => {
    return (
      // {/* confirmation dialog */}
      <Dialog open={open} onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Enter new mailbox name:
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Mailbox Name"
            type="email"
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <Toolbar>CSE183 Mail</Toolbar>
      <List
        aria-labelledby="nested-list-subheader"
        // subheader={
        //   <ListSubheader component="div" id="nested-list-subheader">
        //   CSE183 Mail
        //   </ListSubheader>
        // }
      >
        {/* Inbox */}
        <ListItem button
          key="Inbox"
          disabled={mailbox == 'Inbox'}
          selected={mailbox == 'Inbox'}
          onClick={() => selectMailbox('Inbox')}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          <ListItemSecondaryAction>
            <p>{unread[0] == 0 ? '' : unread[0]}</p>
          </ListItemSecondaryAction>
        </ListItem>

        <Divider /> {/* -----------------------*/}
        {/* Built-in Mailboxes */}
        {builtInBoxes.map((box, index) => (
          <ListItem button
            key={box.name}
            disabled={mailbox == box.name}
            selected={mailbox == box.name}
            onClick={() => selectMailbox(box.name)}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
            <ListItemSecondaryAction>
              <p>{unread[index+1] == 0 ? '' : unread[index+1]}</p>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <Divider /> {/* -----------------------*/}
        {/* Created Mailboxes */}
        {createdBoxes.map((box) => (
          <ListItem button
            key={box.name}
            disabled={mailbox == box.name}
            selected={mailbox == box.name}
            onClick={() => selectMailbox(box.name)}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
            <ListItemSecondaryAction>
              {/* <p>{unread == 0 ? '' : unread}</p> */}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <Divider /> {/* -----------------------*/}
        {/* New Mailbox */}
        <ListItem button
          key="New Mailbox"
          onClick={handleClickOpen}
        >
          <ListItemIcon>
            <ControlPointIcon />
          </ListItemIcon>
          <ListItemText primary="New Mailbox" />
        </ListItem>
        <Divider /> {/* -----------------------*/}
        {/* Settings */}
        <ListItem button
          key="Settings"
          onClick={handleSettingsOpen}
        >
          <ListItemIcon >
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <SaveDialog/>
    </div>
  );
}

export default MailboxList;
