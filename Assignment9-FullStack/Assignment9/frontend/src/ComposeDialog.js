/*
  SOURCES:
  https://codesandbox.io/s/18h0z?file=/demo.js:0-1619
  https://codesandbox.io/s/0p6zjoy7x0?file=/index.js
  https://jpuri.github.io/react-draft-wysiwyg/#/demo
*/
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SharedContext from './SharedContext';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slide from '@material-ui/core/Slide';
import axios from 'axios';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * @return {*} JSX
 */
export default function FormDialog() {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('user'));
  const {
    composeOpen,
    handleComposeClose,
  } = React.useContext(SharedContext);
  // new email state var
  const [newEmail, setNewEmail] = React.useState(
      {
        to: {
          name: '',
          email: '',
        },
        from: {
          name: user.name,
          email: user.email,
        },
        subject: '',
        content: '',
      });
  const [editorState, setEditorState] =
    React.useState(EditorState.createEmpty());

  const onEditorStateChange = (event) => {
    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setEditorState(event);
    const email = newEmail;
    email.content = value;
    setNewEmail(email);
  };

  const EditorContainer = () => {
    return (
      <div >
        <Editor
          className={classes.editor}
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          editorStyle={{
            border: '1px solid gray',
            minHeight: '30vh',
          }}
          toolbar={
            {
              inline: {inDropdown: true},
              list: {inDropdown: true},
              textAlign: {inDropdown: true},
              link: {inDropdown: true},
              history: {inDropdown: true},
            }
          }
        />
      </div>
    );
  };

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const email = newEmail;
    if (name === 'to') {
      email.to.name = value;
      email.to.email = value;
    } else {
      email[name] = value;
    }
    setNewEmail(email);
    // console.log(newEmail);
  };


  const onSubmit = (event) => {
    event.preventDefault();
    // Send Post req to toggle star val in db
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = {
      headers: {'Authorization': `Bearer ${user.accessToken}`},
    };
    // const body = {}; JSON.stringify(newEmail);
    const body = newEmail;
    // console.log(body);

    axios.post(`http://localhost:3010/send`, body, headers)
        .then((res) => {
          // console.log(res.status);
          if (res.status != 201) {
            throw res;
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleClose = () => {
    handleComposeClose;
    const editorState =
      EditorState.push(editorState, ContentState.createFromText(''));
    setEditorState(editorState);
  };

  // make compose view responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        className = {classes.compose}
        open={composeOpen}
        onClose={()=>{
          handleClose;
        }}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
      >
        <form onSubmit={onSubmit}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              {/* '<' Back Button */}
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleComposeClose}
                aria-label="close"
              >
                {fullScreen ? <ChevronLeftIcon/> : <HighlightOffIcon/>}
              </IconButton>

              <Typography variant="h6" className={classes.title}>
              New Email
              </Typography>

              {/* -> Send Button */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label="close"
                type="submit"
                onClick={handleComposeClose}
              >
                <ArrowForwardIcon />
              </IconButton>

            </Toolbar>
          </AppBar>

          <DialogContent className={classes.dialogContent}>
            {/* To + Subject Lines */}
            <TextField
              margin="dense"
              id="to-name"
              label="To"
              type="email"
              fullWidth
              onChange={handleInputChange}
              name="to"
              autoComplete="on"
            />
            <TextField
              margin="dense"
              id="subject"
              label="Subject"
              type="text"
              fullWidth
              onChange={handleInputChange}
              name="subject"
            />

            <EditorContainer />

          </DialogContent>

        </form>
      </Dialog>
    </div>
  );
}


