/*
  SOURCES
  Provided "Assignment 6 - Simplest Solution"
  https://bit.ly/3ghM6WB
  https://bit.ly/3ovnb52
*/

import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// ROUTING
import axios from 'axios';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
// CONTEXT
import SharedContext from './SharedContext';
// COMPONENTS
import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';
import Login from './Login';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

/**
 * Main page root render-er
 * @return {object} JSX
 */
function App() {
  const classes = useStyles();
  const [mailbox, setMailbox] = React.useState('Inbox');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  // Settings state
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };
  // Email viewer state
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [selectedEmail, setSelectedEmail] = React.useState({});
  const handleEmailOpen = () => {
    setEmailOpen(true);
  };

  const handleEmailClose = () => {
    setEmailOpen(false);
  };


  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Authentication
  // verify user JWT when loading main page (async)
  // fetch verification details from db, then update loggedIn state
  // loading toggled to force re render
  // https://bit.ly/3ovnb52
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = JSON.parse(user);
    axios.post('http://localhost:3010/verify', token)
        .then((res) => {
          setLoggedIn(res.data.verified);
          setLoading(false);
        });
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  // Check authenticated/ logged in state,
  // if loggedin, route to
  const AuthenticatedRoute = ({...props}) => (
    loggedIn ?
    <Route {...props} /> : // route to main page
    <Redirect to='/login' /> // redir back to login
  );

  // Main Page Content
  const emails = (
    <div className={classes.root}>
      <CssBaseline/>
      <MailboxDrawer/>
      <TitleBar/>
      <Content/>
    </div>
  );


  // encapsulate all relevant context vals
  const contextObj = {
    mailbox, setMailbox,
    drawerOpen, setDrawerOpen,
    toggleDrawerOpen,
    loggedIn, setLoggedIn,
    settingsOpen, handleSettingsOpen, handleSettingsClose,
    emailOpen, handleEmailOpen, handleEmailClose,
    selectedEmail, setSelectedEmail,
  };

  return (
    <SharedContext.Provider
      value= {contextObj}
    >
      <BrowserRouter>
        {/* <Switch> looks through children <Route>s and
        renders the first one matching the current URL */}
        <Switch>
          <AuthenticatedRoute path='/' exact>
            {emails}
          </AuthenticatedRoute>
          <Route path='/login'>
            <Login/>
          </Route>
        </Switch>
      </BrowserRouter>
    </SharedContext.Provider>
  );
}

export default App;
