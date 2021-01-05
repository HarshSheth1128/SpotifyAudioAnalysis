import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth';

const PrivateRoute = ({children, ...rest}) => {
  const {isAuth} = useAuth();
  return (
  <Route {...rest}>
    {
    (isAuth === true)
    ? {...children}
    : <Redirect to="/"/>
    }
  </Route>
  )
};

export default PrivateRoute;
