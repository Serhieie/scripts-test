// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const { MT_PASS } = process.env;

// const nodemailerConfig = {
//   host: "smtp.meta.ua",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "Bohdanserhieiev@meta.ua",
//     pass: MT_PASS,
//   },
// };
// const transport = nodemailer.createTransport(nodemailerConfig);

// const sendEmailMeta = async (data) => {
//   const email = { ...data, from: "Bohdanserhieiev@meta.ua" };
//   await transport.sendMail(email);
//   return true;
// };

// module.exports = sendEmailMeta;
