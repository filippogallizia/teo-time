import sgMail from '@sendgrid/mail';

import { URL_CLIENT } from '../constants/constants';

process.env.SENDGRID_API_KEY_2 &&
  sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);

//TODO -> improve email texts.

export const changePwdEmail = (userEmail: string, OTP: string) => {
  const email = {
    to: [userEmail],
    from: process.env.ADMIN_EMAIL ?? 'info@osteotherapy.it', // Use the email address or domain you verified above
    subject: 'teo-time',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<a href=${URL_CLIENT}/password/reset?resetPasswordToken=${OTP}>Clicca qua per cambiare la password.</a>`,
  };
  return email;
};

export const successBkgEmail = (userEmail: string, bookDate?: string) => {
  const email = {
    to: [userEmail],
    cc: process.env.ADMIN_EMAIL,
    from: process.env.ADMIN_EMAIL, // Use the email address or domain you verified above
    subject: 'teo-time',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
    <div style="padding: 10px; font-size: 1.1rem;">
    <h3>
        Il tuo appuntamento e' stato registrato con successo.
    </h3>
    <p style="margin-bottom: 10px;">
      Questi sono i dettagli:
    </p>
    <p>
      Evento: <span style="font-weight: bold;">Trattamento osteopatico</span>
    </p>
    <p>
      Data:
      <span style="font-weight: bold;">
        ${bookDate}</span
      >
    </p>
  </div>
  `,
  };
  return email;
};

export const sendEmail = async (email: any) => {
  return await sgMail
    .send(email)
    .then(
      () => {
        console.log('success');
      },
      (e: any) => {
        console.log(e.response.body.errors, 'errorSendEmail');
        throw e;
      }
    )
    .catch((e: any) => {
      console.log(e.response.body.errors, 'errorSendEmail');
      throw e;
    });
};
