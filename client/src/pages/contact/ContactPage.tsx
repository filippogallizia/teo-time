import { Link } from 'react-router-dom';
import i18n from '../../i18n';
import {
  ITALIC,
  PARAGRAPH_MEDIUM,
  SECONDARY_LINK,
  TITLE,
} from '../../constants/constant';
import { AiFillCopy } from 'react-icons/ai';

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center gap-8 justify-center">
      <p className={TITLE}>{i18n.t('contactPage.title')}</p>
      <div
        className={`grid grid-cols-1 gap-8 justify-items-start ${PARAGRAPH_MEDIUM}`}
      >
        <div className="flex gap-8 items-center justify-between">
          <p>
            <span className={`mr-2 ${ITALIC}`}>Email:</span>{' '}
            {i18n.t('contactPage.body.email')}
          </p>
          <div
            onClick={async () => {
              await navigator.clipboard.writeText(
                i18n.t('contactPage.body.email')
              );
            }}
          >
            <AiFillCopy />
          </div>
        </div>
        <div className="flex gap-4">
          <p className={`${ITALIC}`}>{i18n.t('contactPage.body.address')}</p>
          <Link
            to={{
              pathname:
                'https://www.google.com/maps/place/Via+Osti,+20122+Milano+MI,+Italy/@45.4589123,9.189785,17z/data=!3m1!4b1!4m5!3m4!1s0x4786c6a83f082c6b:0xc2864de44532ba97!8m2!3d45.4589123!4d9.1919737',
            }}
            target="_blank"
          >
            <p className={SECONDARY_LINK}>via osti</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
