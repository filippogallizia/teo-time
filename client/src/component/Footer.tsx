import React from 'react';
import { Link } from 'react-router-dom';
import i18n from '../i18n';
import routes from '../routes';
import InstagramLogo from '../shared/icons/instagram.svg';
import { SECONDARY_LINK } from '../constants/constant';

const Footer = () => {
  return (
    <div className="grid grid-cols-3 justify-items-center items-center w-screen h-10 gap-2 bg-gray-200 ">
      <Link to={routes.CONTACT}>
        <span className={`${SECONDARY_LINK}`}>{i18n.t('footer.contact')}</span>
      </Link>
      <Link to={routes.PRIVACY_POLICY}>
        <p>Privacy policy</p>
      </Link>
      <Link
        to={{ pathname: 'https://www.instagram.com/bulgheronimatteo/?hl=en' }}
        target="_blank"
      >
        <img src={InstagramLogo} alt="instagram-log" />
      </Link>
    </div>
  );
};

export default Footer;
