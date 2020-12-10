/*
  SOURCES:
  https://codesandbox.io/s/18h0z?file=/demo.js:0-1619
*/
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SharedContext from './SharedContext';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import StarIcon from '@material-ui/icons/Star';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';

import axios from 'axios';
// import {EditorState, ContentState} from 'draft-js';
// import {Editor} from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import htmlToDraft from 'html-to-draftjs';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
  },
  email: {
    [theme.breakpoints.up('md')]: {
      maxHeight: 'calc(100% - 64px)',
      maxWidth: '40%',
      marginTop: 'auto',
      marginLeft: 'auto',
    },
  },
  appBar: {
    position: 'relative', // this and paddingtop are interchangeable
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  body: {
    paddingTop: theme.spacing(2),
  },
  editor: {
    minHeight: theme.spacing(12),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  text: {
    paddingLeft: theme.spacing(5),
    paddingTop: theme.spacing(0),
  },
  alignRight: {
    textAlign: 'right',
    paddingBottom: theme.spacing(4),
  },
  content: {
    paddingTop: theme.spacing(5),
  },
  paper: {
    // boxShadow: 'none',
    // overflow: 'hidden',
  },
}));

const formatTime = (received) => {
  const now = new Date();
  const recvTime = new Date();
  recvTime.setTime(Date.parse(received));
  const oneYearAgo = new Date().setFullYear(now.getFullYear() - 1);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);


  const sameDay = (now.getDate() == recvTime.getDate());
  const sameMonth = (now.getMonth() == recvTime.getMonth());
  const sameYear = (now.getFullYear() == recvTime.getFullYear());
  const isWithinYear = (Date.parse(received) >= oneYearAgo.valueOf());

  const hourDiff = ((yesterday - recvTime) / 36e5);
  const wasYesterday = (hourDiff < 24 && hourDiff > 0);

  // time if received today
  if (sameDay && sameMonth && sameYear) {
    let hour = recvTime.getHours();
    let min = recvTime.getMinutes();
    let time = '';
    let ampm = '';

    if (min < 10) {
      min = '0' + min;
    }
    if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM';
    } else {
      ampm = 'AM';
    }
    time = `${hour}:${min} ${ampm}`;
    return time;
    // Yesterday
  } else if (wasYesterday) {
    return ('Yesterday');
  // (Month Day) if in last Year
  } else if (isWithinYear) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[recvTime.getMonth()]} ${recvTime.getDate()}`;
  //  Year only if more than a year ago
  } else {
    return `${recvTime.getFullYear()}`;
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

/**
 * @return {*} JSX
 */
export default function FormDialog() {
  const classes = useStyles();
  const {
    emailOpen,
    handleEmailClose,
    selectedEmail,
    toggleDummy,
  } = React.useContext(SharedContext);


  let email = {
    id: 0,
    mailbox: 'Default Mailbox',
    unread: true,
    starred: false,
    mail: {
      content: 'Default Content',
      from: {name: 'Default', email: 'johndoe@default.com'},
      received: '2020-08-12T01:22:03Z',
      sent: '2020-08-12T01:22:03Z',
      subject: 'This is a Default Subject',
      to: {name: 'Default', email: 'Default'},
    },
  };

  if (selectedEmail.mail != undefined) {
    email = selectedEmail;
  }

  const newid = selectedEmail.id;
  // temporary condition var for toggling star
  const [sem, setSem] = React.useState(email.starred);
  const handleSem = () => {
    setSem(!sem);
  };

  // Stuff for rich text, not working unfortunately
  // // let email = {};
  // if (selectedEmail !== undefined || selectedEmail.size > 0) {
  //   email = selectedEmail;
  //   console.log('HERE');
  // }
  // (selectedEmail == undefined) ?
  // email = defaultEmail :
  // email = selectedEmail;

  // console.log(email);

  // new email state var
  // const [editorState, setEditorState] =
  //   React.useState(EditorState.createEmpty());

  // const onEditorStateChange = (event) => {
  //   const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //   setEditorState(event);
  //   const email = newEmail;
  //   email.content = value;
  //   setNewEmail(email);
  // };

  // const EditorContainer = () => {
  //   const html = email.mail.content;
  //   const contentBlock = htmlToDraft(html);
  //   if (contentBlock) {
  //     const contentState =
  //         ContentState.createFromBlockArray(contentBlock.contentBlocks);
  //     const editorStateContent = EditorState.createWithContent(contentState);
  //     // setEditorState(editorStateContent);
  //     // console.log(editorStateContent);
  //     // setEditorState(undefined);
  //   }
  //   return (
  //     <div >
  //       <Editor
  //         className={classes.editor}
  //         editorState={editorState}
  //         // onEditorStateChange={onEditorStateChange}
  //         editorStyle={{
  //           border: '1px solid gray',
  //           minHeight: '30vh',
  //         }}
  //         readOnly
  //         toolbarHidden
  //       />
  //     </div>
  //   );
  // };

  //   axios.post(`http://localhost:3010/send`, body, headers)
  //       .then((res) => {
  //         console.log(res.status);
  //         if (res.status != 201) {
  //           throw res;
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // };

  const handleStarClick = (email) => {
    // Send Post req to toggle star val in db
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = {
      headers: {'Authorization': `Bearer ${user.accessToken}`},
    };
    // include starred state of email in body
    const body = {};
    body.starred = email.starred ? true : false;

    // wait on the request telling the db to flip the starred value
    axios.post(`http://localhost:3010/starred/${email.id}`, body, headers)
        .then((res) => {
          if (res.status != 200) {
            throw res;
          }
        })
        .catch((err) => {
          console.log(err);
        });

    email.starred = !email.starred;
    toggleDummy();
  };

  const handleEmailUnread = (email) => {
    // console.log(newid);// email.id
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = {
      headers: {'Authorization': `Bearer ${user.accessToken}`},
    };
    const body = {};
    body.unread = email.unread ? true : false;

    // wait on the request telling the db to flip the starred value
    axios.post(`http://localhost:3010/unread/${newid}`, body, headers)
        .then((res) => {
          if (res.status != 200) {
            throw res;
          }
        })
        .catch((err) => {
          console.log(err);
        });

    toggleDummy();
    handleEmailClose();
  };

  const handleEmailCloseRead = (email) => {
    // console.log(selectedEmail);
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = {
      headers: {'Authorization': `Bearer ${user.accessToken}`},
    };
      // include starred state of email in body
    const body = {};
    body.unread = email.unread ? true : false;

    // wait on the request telling the db to flip the starred value
    axios.post(`http://localhost:3010/read/${newid}`, body, headers)
        .then((res) => {
          if (res.status != 200) {
            throw res;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    toggleDummy();
    handleEmailClose();
  };

  // make view responsive
  const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <div className={root}>
      <Dialog
        fullScreen={fullScreen}
        className = {classes.email}
        open={emailOpen}
        onClose={handleEmailClose}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        BackdropProps={{
          classes: {root: classes.root},
        }}
        PaperProps ={{
          classes: {root: classes.paper},
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            {/* '<' Back Button */}
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEmailCloseRead}// onClick={handleEmailClose}
              aria-label="close"
            >
              {fullScreen ? <ChevronLeftIcon/> : <HighlightOffIcon/>}
            </IconButton>

            <Typography variant="h6" className={classes.title}>

            </Typography>

            {/* Mark Unread Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="close"
              type="submit"
              onClick={handleEmailUnread}
            >
              <MailOutlineOutlinedIcon />
            </IconButton>

          </Toolbar>
        </AppBar>

        <DialogContent className={classes.dialogContent}>

          <ListItem alignItems="flex-start">
            <ListItemText>
              <Typography>
                <b>{email.mail.subject}</b> <br/> {email.mailbox}
              </Typography>

            </ListItemText>
          </ListItem>
          <ListItem alignItems="flex-start" ContainerComponent="div">
            {/* Avatar */}
            <ListItemAvatar>
              <Avatar
                className={classes.large}
                src={ (email.avatar == null) ? 'foobar' : email.avatar }
                alt={
                  email.mailbox == 'Sent' || email.mailbox == 'Drafts'?
                  email.mail.to.name :
                  email.mail.from.name
                }
              >
                {/* {email.mail.from.name.charAt(0)} */}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              className={classes.text}
              primary={
                <React.Fragment>
                  <Typography >
                    <b>{email.mail.from.name}</b>
                    {'  -  ' + formatTime(email.mail.received)}
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  <Typography className={classes.listItem} >
                    {email.mail.from.email}
                  </Typography>
                </React.Fragment>
              }
            />

            <ListItemSecondaryAction className={classes.alignRight}>
              <IconButton edge="end" onClick={() => {
                handleStarClick(email);
                handleSem();
                // console.log(sem);
              }}>
                {sem ? <StarIcon />:<StarBorderOutlinedIcon/>}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>

          {/* <EditorContainer /> */}

          <DialogContentText classlist={classes.content}>
            {email.mail.content}
          </DialogContentText>

        </DialogContent>
      </Dialog>
    </div>
  );
}


