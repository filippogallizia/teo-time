import { Link } from 'react-router-dom';
import { MEDIUM_MARGIN_BOTTOM } from '../../../../../constants/constant';
import i18n from '../../../../../i18n';
import Routes from '../../../../../routes';

export const AdminNav = () => {
  return (
    <div
      className={`grid grid-flow-row  md:grid-flow-col row-span-3 place-items-center ${MEDIUM_MARGIN_BOTTOM}`}
    >
      <Link
        to={Routes.ADMIN_BOOKING_MANAGER}
        className="px-3 py-2 flex items-center  leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer ">
          {i18n.t('adminPage.nav.bookings')}
        </div>
      </Link>
      <Link
        to={Routes.ADMIN_USERS_TABLE}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.usersInfo')}
        </div>
      </Link>
      <Link
        to={Routes.ADMIN_AVAL_MANAGER}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.avalManage')}
        </div>
      </Link>
      <Link
        to={Routes.FIXED_BKS_MANAGER}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.fixedBksManage')}
        </div>
      </Link>
      <Link
        to={Routes.ADMIN_HOLIDAY_MANAGER}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.holidayManage')}
        </div>
      </Link>
    </div>
  );
};

export default AdminNav;
