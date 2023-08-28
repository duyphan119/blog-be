const nodemailer = require("nodemailer");
const Subscriber = require("../models/subscriber.model");

const sendMail = async (blog) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const subscribers = await Subscriber.find();
  return transporter.sendMail({
    from: `"ITS" <${process.env.EMAIL}>`,
    to: subscribers.map((subscriber) => subscriber.email).join(", "),
    subject: `Bài đăng mới trên blog ITS`,
    html: `<p>Xin chào</p><p>Tôi hy vọng bạn đang có một ngày tuyệt vời.</p><p>Tôi viết email này để thông báo cho bạn về bài đăng mới nhất trên blog của tôi: <a href="http://localhost:3000/blogs/${blog.slug}" target="_blank">${blog.title}</a>.</p><p>Cảm ơn bạn đã đọc!</p><p>Trân trọng,</p><p>ITS</p>`,
    text: `Xin chào Tôi hy vọng bạn đang có một ngày tuyệt vời. Tôi viết email này để thông báo cho bạn về bài đăng mới nhất trên blog của tôi: ${blog.title}. Cảm ơn bạn đã đọc! Trân trọng, ITS`,
  });
};

module.exports = sendMail;
