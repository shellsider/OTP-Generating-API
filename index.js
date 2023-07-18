import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const PORT = 8080;
const app = express();
const createdOTPS = [];
const timeOfCreatedOTPS = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const generateOTP = function () {
  let otp = "";
  let tempNum;
  for (let i = 0; i < 6; i++) {
    tempNum = Math.trunc(Math.random() * 9 + 1);
    otp += tempNum;
  }
  return otp;
};

const isPresent = function (recievedOTP, currentTime) {
  for (let i = 0; i < createdOTPS.length; i++) {
    if (
      recievedOTP === createdOTPS[i] &&
      currentTime - Number(timeOfCreatedOTPS[i]) <= 60
    )
      return 1;
  }
  return 0;
};

app.get("/generate", (req, res) => {
  const otp = generateOTP();
  createdOTPS.push(otp);
  timeOfCreatedOTPS.push(Math.trunc(Date.now() / 1000));
  res.send(otp);
});

app.post("/generate", (req, res) => {
  const recievedOTP = {
    otp: req.body.otp,
  };
  const currentTime = Math.trunc(Date.now() / 1000);
  const validityOfPresence = isPresent(recievedOTP.otp, currentTime);
  if (validityOfPresence) {
    res.send("OTP is Valid!");
  } else {
    res.send("OTP is Invalid!");
  }
  console.log(req.body);
});

app.listen(PORT, () => {
  console.log(`Running on PORT: ${PORT}`);
  generateOTP();
});
