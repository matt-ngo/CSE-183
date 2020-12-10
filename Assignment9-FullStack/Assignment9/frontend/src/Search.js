import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SharedContext from './SharedContext';
import {fade, makeStyles} from '@material-ui/core/styles';
import SearchContent from './SearchContent';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  listItem: {
    maxWidth: 500,
  },
  dialogContent: {
    margin: 'auto',
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
  searchBody: {

    [theme.breakpoints.up('md')]: {
      zIndex: theme.zIndex.drawer +300,
      width: 'calc(100% - 240px)',
      marginLeft: 'auto',
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      zIndex: theme.zIndex.drawer +300,
      width: '100%',
    },
  },
  paper: {
    boxShadow: 'none',
    // overflow: 'hidden',
  },
}));

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

/**
 * @return {*} JSX
 */
export default function FullScreenDialog() {
  const classes = useStyles();
  // Import Context Vars
  const {
    searchOpen,
    handleSearchClose,
    handleEmailOpen,
    setSelectedEmail,
  } = React.useContext(SharedContext);

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleInputChange = (event) => {
    const {value} = event.target;
    setSearchQuery(value);
    // console.log(searchQuery);
  };

  const handleClear = (event) => {
    setSearchQuery('');
    // console.log(searchQuery);
  };

  const contextObj = {
    searchQuery,
    handleEmailOpen,
    setSelectedEmail,
  };

  // make compose view responsive
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={true}
        className = {classes.searchBody}
        open={searchOpen}
        onClose={handleSearchClose}
        aria-labelledby="form-dialog-title"
        // TransitionComponent={Transition}
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
              onClick={handleSearchClose}
              aria-label="close"
            >
              <ChevronLeftIcon/>
            </IconButton>

            {/* Searchbar */}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                autoFocus
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{'aria-label': 'search'}}
                onChange={handleInputChange}
                value = {searchQuery}
              />
            </div>

            {/* Clear Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="close"
              type="submit"
              onClick={handleClear}
            >
              <HighlightOffIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <SharedContext.Provider
          value= {contextObj}
        >
          <SearchContent/>
        </SharedContext.Provider>
      </Dialog>
    </div>
  );
}
