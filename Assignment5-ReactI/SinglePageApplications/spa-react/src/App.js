import React from "react";
import {Route, NavLink, HashRouter} from "react-router-dom";

import Home from "./component/Home";
import Tech from "./component/Tech";
import Help from "./component/Help";

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <h1>CSE183 Fall 2020</h1>
        <ul className="navigation">
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink to="/tech">Tech</NavLink></li>
          <li><NavLink to="/help">Help</NavLink></li>
        </ul>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/tech" component={Tech}/>
          <Route path="/help" component={Help}/>
        </div>
      </HashRouter>
    );
  }
}

export default App;