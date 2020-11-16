import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Mail from './Mail';

const drawerWidth = 240;

// SOURCES
// https://codesandbox.io/s/material-demo-forked-r7q51?file=/demo.js:0-6387
// https://material-ui.com/components/app-bar/
// https://github.com/shakeelkoper/material-ui-react-clipped-responsive-drawer

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      // sm
      width: drawerWidth,
      flexShrink: 0,
      height: 90,
    },
  },
  appBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 1400,
    [theme.breakpoints.up('md')]: {
      zIndex: 1400,
    },
  },
  noAppBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 1400,
    [theme.breakpoints.up('md')]: {
      zIndex: 1400,
    },
    [theme.breakpoints.down('xs')]: {
      // sm
      height: '0vh',
      display: 'none',
    },
  },
  //
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      // sm
      display: 'none',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    //
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },
}));

/**
 * @param {props} props
 * @return {drawer}
 */
function ResponsiveDrawer(props) {
  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();

  const [drawerEmailOpen, drawerEmailStatus] = React.useState(false);
  const setDrawerEmail = (cond) => {
    drawerEmailStatus(cond);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button key="Inbox" onClick={props.switchInbox}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>

        <ListItem button key="Trash" onClick={props.switchTrash}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const appBarClass = drawerEmailOpen ? classes.noAppBar : classes.appBar;
  console.log('AB CLASS', appBarClass);
  // const toolBarClass = props.showEmail ? classes.appBar2:classes.appBar;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={appBarClass}
        // style={{background: '#d32f2f'}}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap onClick={props.handleDrawerToggle}
          >
            CSE183 Mail - {props.showInbox ? 'Inbox' : 'Trash'}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* MOBILE */}
        {/* smUp */}
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={props.mobileOpen}
            onClose={props.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {/* xsDown */}
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Mail
          showInbox={props.showInbox}
          drawerEmailOpen={drawerEmailOpen}
          setDrawerEmail={setDrawerEmail}
        />
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
  // add hook/props to proptypes
  showInbox: PropTypes.bool,
  switchTrash: PropTypes.func,
  switchInbox: PropTypes.func,
  mobileOpen: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

export default ResponsiveDrawer;
