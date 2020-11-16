import React from 'react';
// import emails from './data/emails.json';
import Drawer from './Drawer';
// import InboxContext from './Context';


/**
 * Simple component with no state.
 *
 * See the basic-react from lecture 11 for an example of adding and
 * reacting to changes in state and lecture 16 for details on Material-UI
 *
 * @return {object} JSX
 */
function App() {
  // create hooks
  // https://www.robinwieruch.de/react-pass-props-to-component
  // https://reactjs.org/docs/hooks-state.html
  const [showInbox, setInbox] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const switchTrash = () => {
    setInbox(false);
    setMobileOpen(false);
  };
  const switchInbox = () => {
    setInbox(true);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      {/* pass in hooks as props */}
      <Drawer
        showInbox={showInbox}
        switchTrash = {switchTrash}
        switchInbox = {switchInbox}
        mobileOpen = {mobileOpen}
        handleDrawerToggle = {handleDrawerToggle}
      />
    </div>
  );
}

export default App;
