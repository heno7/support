const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");
const User = require("./database/models/User");

function getTime() {
  const now = new Date();
  return [now.getFullYear(), now.getMonth(), now.getDate()];
}

async function record(waterData) {
  const [deviceId, hotVol, hotTemp, coldVol] = waterData;
  const user = await User.findOne({ deviceId: deviceId });
  if (!user) return;
  if (!user.water) user.water = {};
  const [year, month, date] = getTime();
  if (!user.water[`${year}_${month}_${date}`]) {
    user.water[`${year}_${month}_${date}`] = {};
  }

  user.water[`${year}_${month}_${date}`][Date.now()] = {
    hot: {
      volumn: hotVol,
      temp: hotTemp,
    },
    cold: {
      volumn: coldVol,
    },
  };
  user.markModified("water");
  await user.save();
}

module.exports = function initMQQT() {
  client.on("connect", function () {
    client.subscribe("hust/water", function (err) {
      if (!err) {
        console.log("Connected to Broker!");
      }
    });
  });

  client.on("message", function (topic, message) {
    // message is Buffer
    // console.log(message.toString());
    // client.end();
    const waterData = message.toString().split(",");
    if (waterData.length != 4) return;
    record(waterData);
    console.log(waterData);
  });
};
