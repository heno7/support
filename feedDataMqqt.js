const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", function () {
  client.subscribe("presence", function (err) {
    if (!err) {
      client.publish("hust/water", "0x1a2c,499,50,123");
    }
  });
});

// client.on("message", function (topic, message) {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });
