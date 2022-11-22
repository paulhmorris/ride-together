import type { PasswordReset, User } from "@prisma/client";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendPasswordResetEmail(
  token: PasswordReset["token"],
  userId: User["id"]
) {
  const { user, pass } = await createTestAccount();

  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: { user, pass },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Reset your password 🔑",
    html: `
      <p>
        <a href="localhost:3000/password/new/${token}-${userId}">Reset your password</a>
        <br />
        This link will expire in 24 hours.
      </p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
