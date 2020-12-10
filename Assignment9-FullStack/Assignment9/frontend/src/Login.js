/*
  SOURCES
  Provided "23. Authentication"
  https://bit.ly/3gqj5Za
*/
import React from 'react';
import {useHistory, Redirect} from 'react-router-dom';
import SharedContext from './SharedContext';

import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
/**
 *
 * @return {object} JSX
 */
function Login() {
  const classes = useStyles();
  const {loggedIn, setLoggedIn} = React.useContext(SharedContext);
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useHistory();


  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3010/authenticate', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((json) => {
          localStorage.setItem('user', JSON.stringify(json));
          setLoggedIn(true);
          history.push('/');
        })
        .catch((err) => {
          alert('Error logging in, please try again');
        });
  };

  // Route the user to the main email page if they logged in
  if (loggedIn) {
    return (<Redirect to='/' />);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AppBar>
        <Toolbar>
        </Toolbar>
      </AppBar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={onSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            type="email"
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            value="Submit"
          >Sign In</Button>
        </form>
        <Typography
          className={classes.caption}
          component="caption"
          color='textSecondary'>
          <br></br>
          Login Info: <br></br>
          Username: ------------- Password: <br></br>
          user1@ucsc.edu ----- webapps1 <br></br>
          user2@ucsc.edu ----- webapps2 <br></br>
          user3@ucsc.edu ----- webapps3

        </Typography>
      </div>

    </Container>
  );
}

export default Login;
