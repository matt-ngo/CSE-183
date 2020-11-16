import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import emails from './data/emails.json';

// SOURCES
// https://material-ui.com/components/cards/

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    left: '0',
    bottom: '0',
    height: '50vh',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      // sm
      position: 'absolute',
      height: '100vh',
    },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: -12,
  },
  leftToolbar: {
    marginRight: 'auto',
    marginLeft: 0,
  },
  cardActionArea: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
  },
}));

/**
 * @param {props} props
 * @return {card}
 */
function SimpleCard(props) {
  const classes = useStyles();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const emailArr = [];
  emailArr.push(emails);
  const innerArr = emailArr[0];
  let selectedEmail = {};
  for (let i = 0; i < innerArr.length; i++) {
    if (innerArr[i].id == props.emailID) {
      selectedEmail = innerArr[i];
    }
  }
  const date = new Date(selectedEmail.received);

  return (
    <Card className={classes.root}>
      {/* APPBAR */}
      <CardActions className={classes.cardActionArea}>
        <AppBar
          position="relative"
          className={classes.appBar}
          // style={{background: '#f44336'}}
        >
          {/* className={classes.rightToolbar} */}
          <Toolbar >
            <Typography variant="h6" className={classes.leftToolbar}>
              {selectedEmail.subject}
            </Typography>
            <IconButton
              color="inherit"
              edge="start"
              className={classes.navIconHide, classes.rightToolbar}
              onClick={() => {
                props.closeEmail();
              }}
            >
              <ClearIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </CardActions>
      {/* CARD CONTENT */}
      <CardContent>
        <Typography
          variant="body1"
          gutterBottom
        >
          From: {selectedEmail.from} ({selectedEmail.email})
          <br />
          To: App User (user@app.com)
          <br />
          Subject: {selectedEmail.subject}
          <br />
          Received:{' '}
          {String(months[date.getMonth()]) +
            ' ' +
            String(date.getDate()) +
            ', ' +
            String(date.getFullYear()) +
            ' @ ' +
            String(
                date.getHours() +
                ':' +
                (date.getMinutes() < 10 ? '0' : '') +
                date.getMinutes(),
            )}
          <br />
          <br />
        </Typography>
        <Typography variant="body1" component="p">
          {selectedEmail.content}
        </Typography>
      </CardContent>
    </Card>
  );
}

SimpleCard.propTypes = {
  emailID: PropTypes.number,
  closeEmail: PropTypes.func,
  changeEmailID: PropTypes.func,
};

export default SimpleCard;
