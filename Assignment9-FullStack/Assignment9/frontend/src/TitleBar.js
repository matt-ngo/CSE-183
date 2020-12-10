/*
  SOURCES
  Provided "Assignment 6 - Simplest Solution"
*/
import React from 'react';
import {fade, makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
// Icons
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
// Searchbar
import InputBase from '@material-ui/core/InputBase';
// Compose
import FormDialogCompose from './ComposeDialog';
// Settings
import FormDialogSettings from './SettingsDialog';
import Search from './Search';
// Context
import SharedContext from './SharedContext';


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBar: {
    // position: 'absolute',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      zIndex: theme.zIndex.drawer +300,
    },
    [theme.breakpoints.down('sm')]: {
      // zIndex: theme.zIndex.drawer +300,
    },
  },
  noAppBar: {
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer +300,
    height: '0vh',
    display: 'none',
    // [theme.breakpoints.up('md')]: {
    //   // zIndex: theme.zIndex.drawer +300,
    //   height: '0vh',
    //   display: 'none',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   height: '0vh',
    //   display: 'none',
    // },
  },
  // SEARCHBAR
  search: {
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'backgroundColor': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    'marginRight': theme.spacing(2),
    'marginLeft': 0,
    'width': '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  // Avatar
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    margin: theme.spacing(2),
  },
  sectionDesktop: {
    display: 'flex',
  },
}));

// https://material-ui.com/components/app-bar/

/**
 * @return {*} JSX
 */
function TitleBar() {
  const classes = useStyles();
  const username = JSON.parse(localStorage.getItem('user'));
  const {
    toggleDrawerOpen, mailbox,
    settingsOpen, handleSettingsOpen, handleSettingsClose,
    emailOpen, handleEmailOpen,
    setSelectedEmail,
  } = React.useContext(SharedContext);

  // Compose state
  const [composeOpen, setComposeOpen] = React.useState(false);
  const handleComposeOpen = () => {
    setComposeOpen(true);
  };

  const handleComposeClose = () => {
    setComposeOpen(false);
  };

  const composeContextObj = {
    composeOpen,
    handleComposeClose,
  };
  // settings context
  const [avatarVisible, setAvatarVisible] = React.useState(true);
  const handleAvatarOn = () => {
    setAvatarVisible(true);
  };

  const handleAvatarOff = () => {
    setAvatarVisible(false);
  };
  const settingsContextObj = {
    settingsOpen,
    handleSettingsClose,
    avatarVisible,
    handleAvatarOn, handleAvatarOff,
  };

  // search state
  const [searchOpen, setSearchOpen] = React.useState(false);
  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };


  const searchContextObj = {
    searchOpen,
    handleSearchClose,
    mailbox,
    handleEmailOpen,
    setSelectedEmail,
  };

  // make view responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const appBarHidden = ((composeOpen&&fullScreen)||
                        (settingsOpen&&fullScreen)||
                        (emailOpen&&fullScreen)||
                        searchOpen) ?
                        classes.noAppBar :
                        classes.appBar;

  return (
    <AppBar
      position="fixed"
      // className={classes.appBar}
      className={appBarHidden}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawerOpen}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        {/* Mailbox Indicator */}
        <Typography variant="h6" noWrap>
          {!fullScreen ? 'CSE183 - ' + mailbox : ''}
        </Typography>
        {/* Searchbar */}
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{'aria-label': 'search'}}
            onClick={handleSearchOpen}
          />
        </div>


        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          {/* Compose Icon */}
          <IconButton
            aria-label="compose icon"
            color="inherit"
            onClick={handleComposeOpen}
          >
            <MailIcon />
          </IconButton>
          {/* Dialog for compose */}
          <SharedContext.Provider
            value= {composeContextObj}
          >
            <FormDialogCompose/>
          </SharedContext.Provider>

          {/* Account Settings Icon */}
          <Avatar
            edge="end"
            aria-label="account of current user"
            color="inherit"
            className={classes.small}
            onClick={handleSettingsOpen}
            alt={ username.name.charAt(0) }
            src={ (username.show_avatar === true) ?
              username.avatar :
              'https://undefined'
            }
          >
          </Avatar>
          {/* Settings */}
          <SharedContext.Provider
            value= {settingsContextObj}
          >
            <FormDialogSettings/>
          </SharedContext.Provider>

          {/* Search */}
          <SharedContext.Provider
            value= {searchContextObj}
          >
            <Search className={classes.searchBody}/>
          </SharedContext.Provider>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
