import { EmailData } from '@sendgrid/helpers/classes/email-address';
import sgMail from '@sendgrid/mail';

console.log(process.env.ADMIN_EMAIL, 'process.env.ADMIN_EMAIL');
class EmailService {
  async sendEmail(emailAddress: string, bookDate?: string): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await sgMail.send(
        this.createBodyConfirmBkg(emailAddress, bookDate)
      );
    } catch (e) {
      throw e;
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

  createBodyConfirmBkg(emailAddress: string, bookDate?: string) {
    const email = {
      to: [emailAddress],
      //cc: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL as EmailData, // Use the email address or domain you verified above
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
  }
}

export default new EmailService();
