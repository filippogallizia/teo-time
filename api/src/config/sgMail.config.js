const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);

class ClassSgMail {
  constructor(email, message) {
    this.msg = {
      to: email,
      from: process.env.EMAIL, // Use the email address or domain you verified above
      subject: 'teo-time',
      text: 'and easy to do anywhere, even with Node.js',
      html: message,
    };
  }
  sendMessage(res) {
    const sendAsync = async () => {
      const response = await sgMail
        .send(this.msg)
        .then(
          () => {
            res.send({ message: 'succesfull sent' });
          },
          (error) => {
            console.log(error.toString());
          }
        )
        .catch((e) => {
          res.status(500).send(`this error occured ${e}`);
        });
      return response;
    };
    sendAsync();
  }
}

module.exports = ClassSgMail;
