import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';

export default function Navbar({ fixed }: any) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-blue-500 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/homepage"
              className="text-m font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap  text-white"
            >
              OS-TEO-THERAPY
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
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                >
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">booking</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={routes.LOGIN}
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                >
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">log in</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={routes.USER}
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                >
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">user</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
