const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);

class ClassSgMail {
  constructor(email, OTP) {
    this.msg = {
      to: email,
      from: process.env.EMAIL, // Use the email address or domain you verified above
      subject: 'teo-time',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<a href=http://0.0.0.0:5000/?otp=${OTP}>LOG IN HERE</a>`,
    };
  }
  sendMessage(res) {
    const sendAsync = async () => {
      const response = await sgMail
        .send(this.msg)
        .then(
          () => {
            res.send({ message: 'check your email!' });
          },
          (error) => {
            console.log(error.toString());
          }
        )
        .catch((e) => {
          res.status(500).send(`this error occured ${e.message}`);
        });
      return response;
    };
    sendAsync();
  }
}

module.exports = ClassSgMail;
