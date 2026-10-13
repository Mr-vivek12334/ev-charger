const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let socketStates = {
  "Socket 1": { active: false, turnOffTime: 0 },
  "Socket 2": { active: false, turnOffTime: 0 },
  "Socket 3": { active: false, turnOffTime: 0 }
};

app.post('/activate-socket', (req, res) => {
  const { socket, durationMins } = req.body;
  if (socketStates[socket]) {
    socketStates[socket].active = true;
    socketStates[socket].turnOffTime = Date.now() + (durationMins * 60 * 1000);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

app.get('/hardware-status', (req, res) => {
  const now = Date.now();
  let esp32Commands = {};
  for (let socket in socketStates) {
    if (socketStates[socket].active && now > socketStates[socket].turnOffTime) {
      socketStates[socket].active = false;
    }
    esp32Commands[socket] = socketStates[socket].active ? "ON" : "OFF";
  }
  res.json(esp32Commands);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Backend running on port ' + listener.address().port);
});
  
