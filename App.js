import React from 'react';

import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-client-preset';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { server } from './app/config/server';
import RootStack from './app/config/router';
import SplashScreen from "react-native-splash-screen";

const httpLink = new HttpLink({uri: `http://${server.url}/${server.graphqlEndpoint}`});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
    return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);


const cache = new InMemoryCache();

const client = new ApolloClient({
    link: httpLinkWithAuthToken,
    cache: cache,
});

class App extends React.Component {
    componentDidMount() {
        SplashScreen.hide();
    }

  render() {
    return (
        <ApolloProvider client={client}>
          <RootStack />
        </ApolloProvider>
    );
  }
}

export default App;
