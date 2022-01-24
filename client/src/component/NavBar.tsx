import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import routes from '../routes';
import { toast } from 'react-toastify';
import i18n from '../i18n';
import 'react-toastify/dist/ReactToastify.css';
import hamburgerIcon from '../shared/icons/hamburgerIcon.svg';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import { GrUserAdmin } from 'react-icons/gr';
import { BiLogIn, BiLogOut } from 'react-icons/bi';
import SessionService from '../services/SessionService';

function useOutsideAlerter(ref: any, fn: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        fn(false);
      }
    }

    // Bind the event listener
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fn, ref]);
}

function OutsideAlerter(props: any) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.setNavbarOpen);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default function Navbar({ fixed }: { fixed?: any }) {
  const history = useHistory();
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const user = SessionService.getUser();
  const token = SessionService.getToken();

  return (
    <OutsideAlerter setNavbarOpen={setNavbarOpen}>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 md:shadow-md">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/homepage"
              className="text-m font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap"
            >
              <span className="tracking-wider">OS-</span>
              <span className="text-yellow-500 tracking-wider">TEO</span>
              <span className="tracking-wider">-THERAPY</span>
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <img src={hamburgerIcon} alt="menu-icon" />
            </button>
          </div>
          <div
            className={
              'lg:flex flex-grow items-center' +
              (navbarOpen ? ' flex' : ' hidden')
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link
                  to={routes.HOMEPAGE_BOOKING}
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug"
                >
                  <div className="flex  border-b-4 border-transparent hover:border-yellow-500">
                    <AiOutlineCalendar className="md:hidden mr-2" />
                    <div>{i18n.t('nav.bookings')}</div>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={routes.LOGIN}
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  "
                >
                  <div className="flex border-b-4 border-transparent hover:border-yellow-500">
                    <BiLogIn className="md:hidden mr-2" />
                    <div>{i18n.t('nav.logIn')}</div>
                  </div>
                </Link>
              </li>
              {token && (
                <li className="nav-item">
                  <Link
                    to={routes.USER}
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  "
                  >
                    <div className="flex border-b-4 border-transparent hover:border-yellow-500">
                      <AiOutlineUser className="md:hidden mr-2" />
                      <p>{i18n.t('nav.user')}</p>
                    </div>
                  </Link>
                </li>
              )}
              {user && user.role === 'admin' && (
                <li className="nav-item">
                  <Link
                    to={routes.ADMIN}
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug "
                  >
                    <div className="flex  border-b-4 border-transparent hover:border-yellow-500">
                      <GrUserAdmin className="md:hidden mr-2" />
                      <div>{i18n.t('nav.admin')}</div>
                    </div>
                  </Link>
                </li>
              )}
              {token && (
                <li className="nav-item">
                  <div className=" cursor-pointer">
                    <div
                      onClick={() => {
                        localStorage.clear();
                        SessionService.logOut();
                        history.push(routes.LOGIN);
                        toast.success(i18n.t('toastMessages.other.logOut'));
                      }}
                      className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75"
                    >
                      <div className="flex  border-b-4 border-transparent hover:border-yellow-500">
                        <BiLogOut className="md:hidden mr-2" />
                        <div>{i18n.t('nav.logOut')}</div>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="w-full md:hidden">
          <div className="border-2 border-gray-900 bg-gray-900"></div>
          <div className="border-4 border-yellow-500 bg-yellow-500"></div>
        </div>
      </nav>
    </OutsideAlerter>
  );
}
