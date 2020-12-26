import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Search from './Search';

function PageRouter() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/app/search" >
          <Search/>
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default PageRouter;
