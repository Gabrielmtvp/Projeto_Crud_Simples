import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro';


ReactDOM.render(
  (<Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="/autor" component={AutorBox} />
      <Route path="/livro" component={LivroBox} />
    </Route>
  </Router>),
  document.getElementById('root')
);
