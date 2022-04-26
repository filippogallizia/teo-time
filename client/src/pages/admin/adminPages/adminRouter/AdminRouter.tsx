import { Redirect, Switch } from 'react-router-dom';
import Routes from '../../../../routes';
import { ProtectedRoute } from '../../../general/GeneralPage';
import UsersTable from '../../components/UsersTable';
import AvalManager from '../availabilitiesManager/AvailabilitiesManager';
import FixedBksManager from '../fixedBookingsManager/FixedBookingsManager';
import HolidaysManager from '../holidaysManager/HolidaysManager';
import ListBookingsManager from '../listBookingsManager/ListBookingsManager';
import AdminNav from './components/Navigator';

const AdminRouter = () => {
  return (
    <div className="flex-1">
      <AdminNav />
      <div>
        <Switch>
          <ProtectedRoute
            path={Routes.ADMIN_BOOKING_MANAGER}
            condition={true}
            altRoute={Routes.HOMEPAGE_BOOKING}
          >
            <ListBookingsManager />
          </ProtectedRoute>
        </Switch>
        <Switch>
          <ProtectedRoute
            path={Routes.ADMIN_USERS_TABLE}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <UsersTable />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.ADMIN_AVAL_MANAGER}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <AvalManager />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.ADMIN_HOLIDAY_MANAGER}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <HolidaysManager />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.FIXED_BKS_MANAGER}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <FixedBksManager />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.ADMIN}
            condition={true}
            altRoute={Routes.LOGIN}
          >
            <Redirect
              to={{
                pathname: Routes.ADMIN_BOOKING_MANAGER,
              }}
            />
          </ProtectedRoute>
        </Switch>
      </div>
    </div>
  );
};

export default AdminRouter;
