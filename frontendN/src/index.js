import './styles.scss';

import { StrictMode } from "react";
import ReactDOM from "react-dom";
import ReactGA4 from "react-ga4";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ApolloProvider } from "@apollo/client";

import { store, persistor } from "./Redux"
import { client } from "./Apollo"
import App from "./App";

// replace console.* for disable log on production
if (process.env.REACT_APP_NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

ReactGA4.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS4)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
