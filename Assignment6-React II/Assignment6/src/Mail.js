import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import emails from './data/emails.json';
import {makeStyles} from '@material-ui/core/styles';
import Card from './Card';
import Typography from '@material-ui/core/Typography';

// SOURCES
// https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
// https://stackoverflow.com/questions/11771400/how-to-get-the-number-of-days-between-two-dates

const useStyles = makeStyles((theme) => ({
  short: {
    margin: '0 0 1vh 0',
    [theme.breakpoints.down('xs')]: {
      height: 0,
    },
  },
  long: {
    height: '100vh-64px',
  },
}));

/**
 * @param {props} props
 * @return {drawer}
 */
function Mail(props) {
  const classes = useStyles();

  const [showEmail, setShowEmail] = React.useState(false);
  const [emailID, setEmailID] = React.useState(0);

  const closeEmail = () => {
    setShowEmail(false);
    props.setDrawerEmail(false);
  };
  const openEmail = () => {
    setShowEmail(true);
    props.setDrawerEmail(true);
  };
  const changeEmailID = (x) => {
    setEmailID(x);
  };

  const getTime = (received) => {
    const date = new Date(received);
    const today = new Date();
    const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));

    // time if received today
    if (
      date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
    ) {
      return String(
          date.getHours() +
          ':' +
          (date.getMinutes() < 10 ? '0' : '') +
          date.getMinutes(),
      );
      // (Month Day) if in last Year
    } else if (diffDays <= 364) {
      return getMonthName(date.getMonth()) + ' ' + String(date.getDate());
      //  Year only if more than a year ago
    } else {
      return String(date.getFullYear());
    }
  };

  const getMailbox = () => {
    const emailArr = [];

    emailArr.push(emails);

    const sorted = emailArr[0].sort(function(a, b) {
      return new Date(b.received) - new Date(a.received);
    });

    const show = props.showInbox;

    const table = [];

    for (let i = 0; i < sorted.length; i++) {
      if ((show && !sorted[i].trash) || (!show && sorted[i].trash)) {
        const row = [];
        const time = getTime(sorted[i].received);
        row.push(
            <TableCell>
              <Typography variant="subtitle1">
                {sorted[i].from}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary" >
                {sorted[i].subject}
              </Typography>
            </TableCell>,
        );
        // row.push(<TableCell align="right">{sorted[i].subject}</TableCell>);
        row.push(
            <TableCell align="center">
              <Typography variant="button">
                {time}
              </Typography>
            </TableCell>);
        const jsonid = sorted[i].id;
        table.push(
            <TableRow
              id={jsonid}
              onClick={() => {
                openEmail();
                changeEmailID(jsonid);
              }}
            >
              {row}
            </TableRow>,
        );
      }
    }

    const tSize = showEmail ? classes.short : classes.long;
    return (
      <TableContainer component={Paper} className={tSize}>
        <Table aria-label="simple table">
          <TableBody>{table}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getMonthName = (num) => {
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
    return months[num];
  };
  // --

  const card = showEmail ? (
    <Card
      emailID={emailID}
      closeEmail={closeEmail}
      changeEmailID={changeEmailID}
    />
  ) : null;

  return (
    <div id="mail">
      {getMailbox()}
      {card}
    </div>
  );
}

Mail.propTypes = {
  showInbox: PropTypes.bool,
  showEmail: PropTypes.bool,
  closeEmail: PropTypes.func,
  openEmail: PropTypes.func,

  drawerEmailOpen: PropTypes.bool,
  setDrawerEmail: PropTypes.func,
};

export default Mail;
