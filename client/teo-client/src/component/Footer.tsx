import React from 'react';
import { Link } from 'react-router-dom';
import i18n from '../i18n';
import routes from '../routes';
import InstagramLogo from '../shared/icons/instagram.svg';
import { SECONDARY_LINK } from '../shared/locales/constant';

const Footer = () => {
  return (
    <div className="grid grid-cols-2 justify-items-center items-center w-screen h-10 gap-4 bg-gray-200 text-white">
      <Link
        to={routes.CONTACT}
        // className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white "
      >
        <span className={`${SECONDARY_LINK}`}>{i18n.t('footer.contact')}</span>
      </Link>
      <Link
        to={{ pathname: 'https://www.instagram.com/bulgheronimatteo/?hl=en' }}
        target="_blank"
      >
        <img src={InstagramLogo} alt="instagram-log" />
        {/* <p className="font-serif">Instagram</p> */}
      </Link>
    </div>
  );
};

export default Footer;
