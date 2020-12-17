const path = require("path");
const Avatar = require("avatar-builder");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const fs = require("fs");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//multer
const storage = multer.diskStorage({
  destination: "tmp",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

//Avatar
const avatar = Avatar.githubBuilder(128);

async function сreateAvatar(name) {
  return await avatar.create(name).then((buffer) =>
    fs.writeFile(`tmp/${name}.png`, buffer, (err) => {
      if (err) throw err;
    })
  );
}
async function imageMinify() {
  const files = await imagemin([`tmp/*.{jpg,png}`], {
    destination: "public/images",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
}

async function removeAvatar(file) {
  return await fs.unlink(`tmp/${file}`, (err) => {
    if (err) throw err;
  });
}

// Meiling
async function sendEmailToVerify(email, verificationToken) {
  const msg = {
    to: `${email}`,
    from: "kiriunina.natalia@gmail.com",
    subject: "Email confirmation",
    text: "Please, confirm your email",
    html: `<a href='http://localhost:${process.env.PORT}/users/auth/verify/${verificationToken}'>Click to verify your email</a>`,
  };
  // const result = await sgMail.send(msg);
  // console.log(msg.html);
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
module.exports = {
  upload,
  сreateAvatar,
  imageMinify,
  removeAvatar,
  sendEmailToVerify,
};
