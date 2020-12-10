/*
  SOURCES
  Provided "Assignment 6 - Simplest Solution"
  https://stackoverflow.com/questions/58713970/how-to-map-list-and-passing-material-ui-icons-in-it
*/
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
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

import SharedContext from './SharedContext';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  root: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(8),
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


const getEmails = (setEmails, searchQuery, history) => { // setLoggedIn
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return;
  }
  const headers = {
    headers: {'Authorization': `Bearer ${user.accessToken}`},
  };
  axios.get(`http://localhost:3010/emails/search/${user.email}/${searchQuery}`, headers)
      .then((res) => {
        if (res.statusText != 'OK') {
          console.log('Response !ok');
          history.push('/login');
        }
        return res.data;
      }, (err) => {
        console.log(err);
        setEmails([]);
      })
      .then((emails) => {
        setEmails(emails);
      });
};

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
    searchQuery,
    handleEmailOpen,
    setSelectedEmail,
  } = React.useContext(SharedContext);
  // New state vars
  // array of emails that gets updated during fetch
  const [emails, setEmails] = React.useState([]);
  const [dummy, setDummy] = React.useState(false);

  // re render page on every fetch to the email list + every modification to
  // emails array
  React.useEffect(() => {
    getEmails(setEmails, searchQuery, history); // , setLoggedIn);
  }, [searchQuery, emails]); // emails

  const handleEmailClick = (email, index) => {
    setSelectedEmail(email);
    // console.log(email);
    if (email.unread == true) {
      // console.log(selectedEmail);
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = {
        headers: {'Authorization': `Bearer ${user.accessToken}`},
      };
      // include starred state of email in body
      const body = {};
      body.unread = email.unread ? true : false;

      // wait on the request telling the db to flip the starred value
      axios.post(`http://localhost:3010/read/${email.id}`, body, headers)
          .then((res) => {
            if (res.status != 200) {
              throw res;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      setEmails(emails);
      setDummy(!dummy);
    }
  };

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

    // console.log(index, emails[index].starred);
    emails[index].starred = !emails[index].starred;
    setEmails(emails);
  };

  const classes = useStyles();
  return (
    <List className={classes.root}>
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

    </List>
  );
}

export default Content;
