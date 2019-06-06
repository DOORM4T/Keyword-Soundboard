const sounds = [
  {
    name: 'explosion.wav',
    triggers: ['FIREBALL', 'KABOOM', 'BOOM', 'EXPLOSION']
  },
  { name: 'fart.mp3', triggers: ['FART', 'FLATULENCE'] },
  { name: 'shriek.mp3', triggers: ['SHRIEK', 'SCREAM'] }
];

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

// recognition.start();

let toggle = false;
document.body.addEventListener('keyup', e => {
  // Toggle on key [`] up
  if (e.which === 192 || e.keyCode === 192) {
    toggle = !toggle;
    if (toggle) {
      console.log('Listening...');
      recognition.start();
    } else {
      console.log('Stopped');
      recognition.stop();
    }
  }
});

recognition.onresult = event => {
  console.log(Array.from(event.results)[0][0].transcript);
  let result = Array.from(event.results)[0][0].transcript.toUpperCase();
  let wordArray = result.split(' ');

  // Filtered source objects. Sorted based on which sequence keywords are stated.
  let filteredSourceObjects = [];

  wordArray.forEach(word => {
    sounds.forEach(sound => {
      sound.triggers.forEach(trigger => {
        if (trigger === word) {
          console.log(`Trigger Word: ${trigger}`);
          filteredSourceObjects.push(sound);
        }
      });
    });
  });

  console.log(filteredSourceObjects);

  let sourceNames = filteredSourceObjects.map(obj => `sounds/${obj.name}`);

  let sound = new Howl({
    src: sourceNames
  });

  console.log(sound);
  if (result.includes('QUICK')) {
    sound.rate(4.0);
  } else if (result.includes('SLOW')) {
    sound.rate(0.5);
  } else sound.rate(1);

  if (result.includes('LOUD')) {
    sound.volume(1.0);
  } else if (result.includes('SOFT')) {
    sound.volume(0.1);
  } else sound.volume(0.5);

  sound.play();
};

recognition.onend = function() {
  if (toggle) recognition.start();
};
