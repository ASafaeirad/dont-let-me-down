const util = require('util');
const path = require('path');
const cron = require('cron');
const Player = require('play-sound');
const { argv } = require('yargs');
var { speaker } = require('win-audio');

var { dev: isDev = false, v: minVol = 100, audio: audioName = 'click' } = argv;
var playerPath = path.normalize('C:\\Program Files (x86)\\FormatFactory\\FFModules\\Encoder\\mplayer.exe');

const player = new Player({ player: playerPath });

new cron.CronJob({
  cronTime: '*/5 * * * *',
  start: true,
  onTick() {
    tick();
  },
  runOnInit: isDev
});

function tick() {
  var isMuted = speaker.isMuted();
  var currentVol = speaker.get();
  var vol = currentVol < minVol ? minVol : currentVol;

  isMuted && speaker.unmute();
  speaker.set(vol);

  playMP3(audioName).then(() => {
    isMuted && speaker.mute();
    speaker.set(currentVol);
  });
}

function playMP3(fileName) {
  var fileNameMp3 = `${fileName}.mp3`;
  var filePath = path.join(__dirname, 'sounds', fileNameMp3);
  return new Promise((resolve, reject) => player.play(filePath, resolve));
}
