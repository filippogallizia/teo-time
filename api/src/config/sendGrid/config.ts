const sgMail = require('@sendgrid/mail');

export const changePwdEmail = (userEmail: string, OTP: string) => {
  const email = {
    to: [userEmail],
    from: process.env.ADMIN_EMAIL, // Use the email address or domain you verified above
    subject: 'teo-time',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<a href=${URL}?resetPasswordToken=${OTP}>reset your password here</a>`,
  };
  return email;
};

export const successBkgEmail = (userEmail: string, bookDate?: string) => {
  const email = {
    to: [userEmail],
    //cc: process.env.ADMIN_EMAIL,
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
  await sgMail
    .send(email)
    .then(
      () => {
        console.log('success');
      },
      (e: any) => {
        console.log(e.response.body.errors, 'error');
      }
    )
    .catch((e: any) => {
      console.log(e, 'errorr');
    });
};
