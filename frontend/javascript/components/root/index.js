/* @flow */

import React from 'react';
import { Match, HashRouter as Router } from 'react-router';
import Header from './header';
import Wellcome from './wellcome';
import Auth from '../auth';
import Rx from 'rxjs/Rx';
import { connect } from 'react-redux';
import graphql from '../../utils/graphql';
//Types
import type { ViewerT, StateT } from '../../reducers';

class App extends React.Component {
  load$: rx$SubscribtionT;
  state: {viewer?: ViewerT}

  constructor(props): void {
    super(props);
    this.state = {};
  }

  componentWillMount(): void {
    graphql({query: `{
        viewer {
          id,
          email
        }
      }`
    }).subscribe((data) => {
      //TODO: dispatch
      this.setState({viewer: data});
    });    
  }

  componentWillUnmount(): void {
    this.load$.unsubscribe();
  }

  render(): ReactElement<any> {
    return (
      <Router>
        <div className="letsplay">
          <Header isLoggedIn={!!this.state.viewer} />

          <div className="root-container">
            <Match exactly pattern="/" component={Wellcome} />
            <Match pattern="/auth" component={Auth} />
          </div>
        </div>
      </Router>
    );
  }
}


function mapStateToProps(state: StateT) {
  return {
    viewer: state.viewer
  }; 
}


function mapDispatchToProps(dispatch) {
  return {
    dispatchLogin: (data: {username: string; password: string;}): void => (
      dispatch({action: 'LOGIN_REQUEST', data})
    ),
    dispatchLogout: (): void => (
      dispatch({action: 'LOGOUT_REQUEST'})
    )
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
