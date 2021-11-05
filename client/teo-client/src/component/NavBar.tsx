import React, { useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import routes from '../routes';
import { toast } from 'react-toastify';
import i18n from '../i18n';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from './UserContext';

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
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
  const { user, setUser, token, setToken } = useContext(UserContext);

  return (
    <OutsideAlerter setNavbarOpen={setNavbarOpen}>
      <div className="mb-10">
        <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 shadow-md mb-3">
          <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
              <Link
                to="/homepage"
                className="text-m font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white"
              >
                <span className="tracking-wider">OS-</span>
                <span className="text-yellow-500 tracking-wider">TEO</span>
                <span className="tracking-wider">-THERAPY</span>
              </Link>
              <button
                className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                - - -
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
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white border-b-4  border-transparent hover:border-yellow-500 "
                  >
                    <span className="ml-2">booking</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={routes.LOGIN}
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white border-b-4  border-transparent hover:border-yellow-500 "
                  >
                    <span className="ml-2">log in</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    onClick={() => {
                      if (!token) {
                        toast(i18n.t('toastMessages.errors.notAuthorized'));
                      }
                    }}
                    to={routes.USER}
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white border-b-4  border-transparent hover:border-yellow-500 "
                  >
                    <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                    <span className="ml-2">user</span>
                  </Link>
                </li>
                {user && user.role === 'admin' && (
                  <li className="nav-item">
                    <Link
                      to={routes.ADMIN}
                      className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white border-b-4  border-transparent hover:border-yellow-500"
                    >
                      <span className="ml-2">admin</span>
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <div className="text-white border-b-4 cursor-pointer  border-transparent hover:border-yellow-500">
                    <div
                      onClick={() => {
                        localStorage.clear();
                        setUser(null);
                        setToken(null);
                        history.push(routes.LOGIN);
                        toast(i18n.t('toastMessages.other.logOut'));
                      }}
                      className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    >
                      <span className="ml-2">log out</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </OutsideAlerter>
  );
}
