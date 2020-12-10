/*
  SOURCES
  Provided "Assignment 6 - Simplest Solution"
  https://stackoverflow.com/questions/58713970/how-to-map-list-and-passing-material-ui-icons-in-it
*/
import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import StarIcon from '@material-ui/icons/Star';
import EmailDialog from './EmailDialog';


import useMediaQuery from '@material-ui/core/useMediaQuery';
import SharedContext from './SharedContext';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  paper: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  listItem: {
    maxWidth: 500,
  },
  mailboxTitle: {
    'padding-left': theme.spacing(2),
  },
  alignRight: {
    textAlign: 'right',
  },
}));


const getEmails = (setEmails, mailbox, history, setLoggedIn) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return;
  }
  const headers = {
    headers: {'Authorization': `Bearer ${user.accessToken}`},
  };
  axios.get(`http://localhost:3010/emails/${user.email}/${mailbox}`, headers)
      .then((res) => {
        if (res.statusText != 'OK') {
          console.log('Response !ok');
          history.push('/login');
        }
        return res.data;
      }, (err) => {
        console.log(err);
        history.push('/login');
        setLoggedIn(false);
        setEmails([]);
      })
      .then((emails) => {
        setEmails(emails);
      });
};

/**
 * @return {str} correctly formatted time
 * @param {*} received ISO formatted time string
 */
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

/**
 * @return {object} JSX
 */
function Content() {
  const history = useHistory();
  // Import relevant context vars
  const {
    mailbox, setLoggedIn,
    emailOpen, handleEmailClose, handleEmailOpen,
    selectedEmail, setSelectedEmail,
  } = React.useContext(SharedContext);

  // array of emails that gets updated during fetch
  const [emails, setEmails] = React.useState([]);
  const [dummy, setDummy] = React.useState(false);

  const toggleDummy = () =>{
    setDummy(!dummy);
  };

  const setRead = (id) =>{
    emails[id].unread = true;
  };


  // const [selectedEmail, setSelectedEmail] = React.useState(0);
  // id: 0,
  //   mailbox: 'Dummy',
  //   unread: true,
  //   starred: false,
  //   mail: {
  //     content: '',
  //     from: {name: '', email: ''},
  //     received: '',
  //     sent: '',
  //     subject: '',
  //     to: {name: '', email: ''},
  //   },
  // });


  const handleEmailClick = (email, index) => {
    setSelectedEmail(email);
    // console.log(email);
    if (email.unread == true) {
      setDummy(!dummy);
    }
  };

  // const handleEmailClick = (email, index) => {
  //   setSelectedEmail(email);
  //   // console.log(email);
  //   if (email.unread == true) {
  //     // console.log(selectedEmail);
  //     const user = JSON.parse(localStorage.getItem('user'));
  //     const headers = {
  //       headers: {'Authorization': `Bearer ${user.accessToken}`},
  //     };
  //     // include starred state of email in body
  //     const body = {};
  //     body.unread = email.unread ? true : false;

  //     // wait on the request telling the db to flip the starred value
  //     axios.post(`http://localhost:3010/read/${email.id}`, body, headers)
  //         .then((res) => {
  //           if (res.status != 200) {
  //             throw res;
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     setEmails(emails);
  //     setDummy(!dummy);
  //   }
  // };


  const emailContextObj = {
    emailOpen,
    handleEmailClose,
    selectedEmail,
    setRead,
    toggleDummy,
  };


  // re render page on every fetch to the email list + every modification to
  // emails array
  React.useEffect(() => {
    getEmails(setEmails, mailbox, history, setLoggedIn);
    // console.log('EVENT');
  }, [dummy, emailOpen]); // emails

  const unreadMailText = (email) => {
    return (
      <ListItemText
      // Bold text, render if Unread
        primary={
          <React.Fragment>
            <Typography >
              {email.mailbox == 'Sent' || email.mailbox == 'Drafts' ?
              <b>To: {email.mail.to.name}</b> :
              <b>{email.mail.from.name}</b>}
            </Typography>
            <Typography>
              {<b>{email.mail.subject}</b>}
            </Typography>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Typography
              noWrap
              className={classes.listItem}
              // only to fix dom descendant warning
              // component={'span'}

            >
              {email.mail.content}
            </Typography>
          </React.Fragment>
        }
      />);
  };

  const readMailText = (email) => {
    return (
      <ListItemText
        secondary={
          <React.Fragment>
            <Typography>
              {email.mailbox == 'Sent' || email.mailbox == 'Drafts' ?
            `To: ${email.mail.to.name}` :
            email.mail.from.name}
            </Typography>
            <Typography>
              {email.unread ? '' : email.mail.subject}
            </Typography>
            <Typography noWrap className={classes.listItem}>
              {email.mail.content}
            </Typography>
          </React.Fragment>
        }
      />);
  };

  const handleStarClick = (email, index) => {
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

    emails[index].starred = !emails[index].starred;
    setEmails(emails);
    setDummy(!dummy);
  };

  // make view responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  return (
    <List className={classes.root}>
      {/* Mailbox Name */}
      <div className={classes.toolbar}/>
      <Typography
        variant="h6"
        className={classes.mailboxTitle}
        // only to fix dom descendant warning
        // component={'span'}
      >
        {/* {mailbox} */}
        {fullScreen ? mailbox :''}
      </Typography>
      {/* Map JSX onto arr of emails returned from useEffect */}
      {emails.map((email, index) => {
        return (
          <ListItem
            alignItems="flex-start"
            key={email.id}
            button
            onClick={() => {
              setSelectedEmail(email);
              handleEmailClick(email, index);
              handleEmailOpen();
            } }
          >
            {/* Avatar */}
            <ListItemAvatar>
              <Avatar
                src={ (email.avatar == null) ? 'foobar' : email.avatar }
                alt={
                  email.mailbox == 'Sent' || email.mailbox == 'Drafts'?
                  email.mail.to.name :
                  email.mail.from.name
                }
              >
              </Avatar>
            </ListItemAvatar>
            {/* Text Content */}
            {email.unread ? unreadMailText(email) : readMailText(email)}
            {/* Time */}
            <ListItemSecondaryAction className={classes.alignRight}>
              <Typography edge="end">
                {formatTime(email.mail.received)}
              </Typography>
              {/* Star */}
              <IconButton edge="end" onClick={() => {
                handleStarClick(email, index);
              }}>
                {emails[index].starred ? <StarIcon />:<StarBorderOutlinedIcon/>}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      <SharedContext.Provider
        value= {emailContextObj}
      >
        <EmailDialog/>
      </SharedContext.Provider>

    </List>
  );
}

export default Content;
