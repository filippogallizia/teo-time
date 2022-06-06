import { EmailData } from '@sendgrid/helpers/classes/email-address';
import sgMail from '@sendgrid/mail';

class EmailService {
  async sendEmail(emailBody?: any): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await sgMail.send(emailBody);
    } catch (e) {
      console.log(e, 'errorFromEmailService');
    }
  }

  changePassword(emailAddress: string, OTP: string) {
    const emailBody = {
      to: [emailAddress],
      from: process.env.ADMIN_EMAIL, // Use the email address or domain you verified above
      subject: 'teo-time',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<a href=${URL}?resetPasswordToken=${OTP}>reset your password here</a>`,
    };
    return emailBody;
  }

  getConfirmationEmailBody(emailAddress: string, bookDate?: string) {
    const email = {
      to: [emailAddress],
      cc: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL as EmailData, // Use the email address or domain you verified above
      subject: 'teo-time',
      text: 'and easy to do anywhere, even with Node.js',
      html: `
      <div style="padding: 10px; font-size: 1.1rem;">
      <p>
          Il tuo appuntamento e' stato registrato con successo!
      </p>
      <p>
        Questi sono i dettagli:
      </p>
      <p>
        Evento: <span>Trattamento osteopatico</span>
      </p>
      <p>
        Data: <span>${bookDate}</span
        >
      </p>
      <p>
        Cordiali Saluti,
      </p>
      <p>
        Osteotherapy
      </p>
    </div>
    `,
    };
    return email;
  }

  getDeleteEmailBody(emailAddress: string, bookDate?: string) {
    const email = {
      to: [emailAddress],
      cc: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL as EmailData, // Use the email address or domain you verified above
      subject: 'teo-time',
      text: 'and easy to do anywhere, even with Node.js',
      html: `
      <div style="padding: 10px; font-size: 1.1rem;">
      <p>
          Il tuo appuntamento del giorno ${bookDate} e' stato cancellato con successo, per qualsiasi chiarimento risponda a questa email.
      </p>
      <p>
        Cordiali Saluti,
      </p>
      <p>
        Osteotherapy
      </p>
    </div>
    `,
    };
    return email;
  }
}

export default new EmailService();
