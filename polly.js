"use strict";
let AWS = require('aws-sdk');
let Speaker = require('speaker');
let Stream = require('stream');
let Fs = require('fs')
let PollyMolly = require('pollymolly')
const homedir = require('os').homedir();

let Polly = new AWS.Polly({
  region: 'eu-west-1',
  accessKeyId: 'AKIAI6KGKCMFWX7SMZIA',
  secretAccessKey: 'jQCpysXncoHNsVnbJdwOskUjrkuX7/5O72gVdwxi'
});

let getPlayer = function () {
  return new Speaker({
    channels: 1,
    bitDepth: 16,
    sampleRate: 16000
  });
}

let speak = function (data) {

  let params = {OutputFormat: 'pcm', TextType: 'ssml'}

  params.VoiceId = data.voiceId;
  if (!data.whispered)
    data.whispered = false;

  if (!data.breakTime)
    data.breakTime = '0s';

  let flag = false;

  if (data.rate <= "0%") {
    if (!data.duration)
      data.duration = 'medium';

    if (!data.volume)
      data.volume = 'medium';

    if (!data.frequency)
      data.frequency = 'medium';
  } else {
    flag = true;
  }

  let words = data.text.toString().split(" ");
  let Text = null;
  for (let i = 0; i < words.length; i++) {
    if (Text === null) {
      if (!flag) {
        Text = ' <amazon:auto-breaths volume = "' + data.volume + '" frequency = "' + data.frequency + '" duration = "' + data.duration + '"> ' + words[i];
      } else {
        Text = ' <prosody rate = "' + data.rate + '"> ' + words[i];
      }
    } else {
      Text += ' <break time = "' + data.breakTime + '"/> ' + words[i];
    }
  }
  console.log("text", Text);

  if (!flag) {
    Text += ' </amazon:auto-breaths>'
  } else {
    Text += ' </prosody>'
  }

  if (data.whispered.toString() === 'true') {
    Text = ' <amazon:effect name = "whispered"> ' + Text + '</amazon:effect>';
  }

  console.log("1text", Text);
  params.Text = PollyMolly.text2ssml(Text);
  console.log("text", params.Text);

  Polly.synthesizeSpeech(params, function (err, res) {
    if (err) {
      console.log('err', err)
    } else if (res && res.AudioStream instanceof Buffer) {
      var bufferStream = new Stream.PassThrough()
      bufferStream.end(res.AudioStream)
      bufferStream.pipe(getPlayer());

      var param1 = {OutputFormat: 'mp3', TextType: 'ssml'}
      param1.Text = params.Text;
      param1.VoiceId = data.voiceId;

      /*Polly.synthesizeSpeech(param1, function (err, res) {
        if (err) {
          console.log('err', err)
        } else if (res && res.AudioStream instanceof Buffer) {
          let filePath = './outputMp3/speech' + new Date() + '.mp3';
          console.log("file", filePath)
          Fs.writeFile(filePath, res.AudioStream, function (err) {
            if (err) {
              return console.log(err)
            }
            console.log("The file was saved!")
          })
        }
      })*/
    }
  })
}

let download = function (data) {
  var param1 = {OutputFormat: 'mp3', TextType: 'ssml'}
  console.log("home",homedir);

  param1.VoiceId = data.voiceId;

  if (!data.fileName) {
    data.fileName = 'VoiceDownload' + new Date() + '.mp3';
  }

  if (!data.path) {
    data.path = homedir + '/Downloads/' + data.fileName;
  }

  if (!data.whispered)
    data.whispered = false;

  if (!data.breakTime)
    data.breakTime = '0s';

  let flag = false;

  if (data.rate <= "0%") {
    if (!data.duration)
      data.duration = 'medium';

    if (!data.volume)
      data.volume = 'medium';

    if (!data.frequency)
      data.frequency = 'medium';
  } else {
    flag = true;
  }

  let words = data.text.toString().split(" ");
  let Text = null;
  for (let i = 0; i < words.length; i++) {
    if (Text === null) {
      if (!flag) {
        Text = ' <amazon:auto-breaths volume = "' + data.volume + '" frequency = "' + data.frequency + '" duration = "' + data.duration + '"> ' + words[i];
      } else {
        Text = ' <prosody rate = "' + data.rate + '"> ' + words[i];
      }
    } else {
      Text += ' <break time = "' + data.breakTime + '"/> ' + words[i];
    }
  }
  console.log("text", Text);

  if (!flag) {
    Text += ' </amazon:auto-breaths>'
  } else {
    Text += ' </prosody>'
  }

  if (data.whispered.toString() === 'true') {
    Text = ' <amazon:effect name = "whispered"> ' + Text + '</amazon:effect>';
  }

  console.log("1text", Text);
  param1.Text = PollyMolly.text2ssml(Text);
  console.log("text", param1.Text);

  Polly.synthesizeSpeech(param1, function (err, res) {
    if (err) {
      console.log('err', err)
    } else if (res && res.AudioStream instanceof Buffer) {
      let filePath = data.path
      console.log("file", filePath)
      Fs.writeFile(filePath, res.AudioStream, function (err) {
        if (err) {
          return console.log(err)
        }
        console.log("The file was saved!")
      })
    }
  })
}

module.exports = {Speak: speak, Download: download};
