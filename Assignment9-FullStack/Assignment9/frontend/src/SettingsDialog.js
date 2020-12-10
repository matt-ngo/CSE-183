/*
  SOURCES:
  https://codesandbox.io/s/18h0z?file=/demo.js:0-1619
*/
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SaveIcon from '@material-ui/icons/Save';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SharedContext from './SharedContext';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
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
  text: {
    paddingLeft: theme.spacing(5),
    paddingTop: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * @return {*} JSX
 */
export default function FormDialog() {
  const classes = useStyles();
  const username = JSON.parse(localStorage.getItem('user'));

  // Import Context Vars
  const {
    settingsOpen,
    handleSettingsClose,
  } = React.useContext(SharedContext);


  // temporary decisions before save
  const [tempCheckVal, setTempCheckVal] = React.useState(username.show_avatar);
  const toggleTempCheckVal = () => {
    setTempCheckVal(!tempCheckVal);
    // console.log(tempCheckVal);
  };

  // confirmation dialog vars
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const handleConfirmOpen = () => {
    setConfirmVisible(true);
  };
  const handleConfirmClose = () => {
    setConfirmVisible(false);
  };

  const handleSave = () => {
    if (tempCheckVal) {
      username.show_avatar = true;
    } else {
      username.show_avatar = false;
    }
    localStorage.setItem('user', JSON.stringify(username));
    // console.log(username);
    setConfirmVisible(false);
    // handleConfirmClose
    handleSettingsClose();
    // console.log(username.show_avatar);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    handleConfirmClose;
    handleSettingsClose();
  };

  // make compose view responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const SaveDialog = () => {
    return (
      // {/* confirmation dialog */}
      <Dialog
        open={confirmVisible}
        onClose={handleConfirmClose}
      >
        <DialogTitle >Save Changes?</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={ handleCancel } color="primary">
          Cancel
          </Button>
          <Button onClick={ handleSave } color="primary">
          Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        className = {classes.compose}
        open={settingsOpen}
        onClose={handleSettingsClose}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
      >
        {/* <form onSubmit={onSubmit}> */}
        <AppBar className={classes.appBar}>
          <Toolbar>
            {/* '<' Back Button */}
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleConfirmOpen}
              aria-label="close"
            >
              {fullScreen ? <ChevronLeftIcon/> : <HighlightOffIcon/>}
            </IconButton>

            <Typography variant="h6" className={classes.title}>
              Settings
            </Typography>

            {/* Save Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="close"
              type="submit"
              onClick={handleSave}
            >
              <SaveIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent className={classes.dialogContent}>
          <ListItem alignItems="flex-start">
            {/* Avatar */}
            <ListItemAvatar>
              <Avatar
                className={classes.large}
                alt={ username.name.charAt(0) }
                src={ (username.show_avatar===true) ? // tempCheckVal
                  username.avatar :
                  'https://undefined'
                }
              >
              </Avatar>
            </ListItemAvatar>
            {/* Text */}
            <ListItemText
              className={classes.text}
              primary={
                <React.Fragment>
                  <Typography >
                    <b>{username.name}</b>
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    className={classes.listItem}
                  >
                    {username.email}
                  </Typography>
                </React.Fragment>
              }
            />

          </ListItem>
          <ListItem alignItems="flex-start">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tempCheckVal}
                    onChange = {toggleTempCheckVal}
                    name="checkedA" />}
                label="Show Profile Picture"
              />
            </FormGroup>
          </ListItem>

        </DialogContent>
        {/* </form> */}
        {confirmVisible?<SaveDialog/>:''}
      </Dialog>
    </div>
  );
}
