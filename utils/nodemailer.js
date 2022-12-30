const nodemailer = require('nodemailer')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = async function nodeMailer (user, email, verifyCode) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  })
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: '[雲林小農市集] 重設密碼',
      html:
      `<p>Hi, ${user.name}</p>
      <p>請回到網站後於驗證碼欄位輸入<b>${verifyCode}</b>，並完成填寫表格資訊，就可以成功重設密碼囉。</p>
      <p>若有任何問題歡迎透過再回覆此封 Email 或是透過官方 Line 與我們聯繫喔。</p>
      `
    })
    console.log(`重設密碼信件發送成功： ${info.response}`)
  } catch (err) {
    console.log(`重設密碼信件發送失敗： ${err}`)
  }
}
