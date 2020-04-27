/// The application component which
// includes the entire application
import App from "./App";

//#region *** *** React Imports *** ***

import React from "react";
/// render component from react dom for
// rendering the virtual dom components
import { render } from "react-dom";
/// BrowserRouter component is used to create a
// virtual dom to wrap around the application
import { BrowserRouter } from "react-router-dom";

//#endregion

//#region *** *** Redux Imports *** ***

/// Provider component is used to connect react to redux store
import { Provider } from "react-redux";
/// Used to add middle-ware to redux and create redux store
import { createStore, applyMiddleware } from "redux";
// Used to add developer tool functionalities for debugging
import { composeWithDevTools } from "redux-devtools-extension";
// used to add async functionality
import thunk from "redux-thunk";

/// Import the redux reducers
import AllReducers from "./Redux";
/// Create store to be exported
const ReduxStore = createStore(
  AllReducers,
  composeWithDevTools(applyMiddleware(thunk))
);

//#endregion

// the base URL for the virtual dom
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

/// The main render method to add redux for state management,
/// create react virtual dom and include the parent component
// of the application which will be added to the index.html rootDiv element
render(
  <Provider store={ReduxStore}>
    <BrowserRouter basename={baseUrl}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("rootDiv")
);
