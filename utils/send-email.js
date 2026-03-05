const nodemailer = require("nodemailer")
const ErrorHandler = require("../errors/error")

const send_email =  async (code, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ahmadjonqsh@gmail.com",
        pass: process.env.GOOGLE_PASS
      }
    })

    await transporter.sendMail({
      subject: "One time Password",
      from: "ahmadjonqsh@gmail.com",
      to: email,
      html: `
      <!DOCTYPE html>
      <html lang="uz">
      <body style="background:#f4f4f4;font-family:Segoe UI">
      
      <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
      
      <table width="600" style="background:#fff;border-radius:12px;padding:30px;text-align:center">
      
      <h2>Salom!</h2>
      
      <p>Hisobingizni tasdiqlash uchun quyidagi koddan foydalaning:</p>
      
      <div style="
        font-size:32px;
        letter-spacing:6px;
        font-weight:bold;
        background:#f1f1ff;
        color:#6C63FF;
        padding:15px 30px;
        display:inline-block;
        border-radius:8px;
        margin:20px 0;
      ">
        ${code}
      </div>
      
      <p style="color:#777;font-size:14px">
      Agar bu amalni siz bajarmagan bo‘lsangiz, iltimos e’tibor bermang.
      </p>
      
      </table>
      
      </td></tr>
      </table>
      
      </body>
      </html>
      `
    })
  } catch (error) {
    throw ErrorHandler.InternalServerError(error.message)
  }
}

module.exports = send_email