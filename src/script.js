const sounds = [
  {
    name: 'explosion.mp3',
    triggers: ['FIREBALL', 'KABOOM', 'BOOM', 'EXPLOSION']
  },
  { name: 'fart.mp3', triggers: ['FART', 'FLATULENCE', 'WUMBO'] },
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
  let result = Array.from(event.results)[0][0];
  let transcript = result.transcript.toUpperCase();
  console.table([
    `Transcript: ${transcript}`,
    `Confidence: ${result.confidence}`
  ]);
  let wordArray = transcript.split(' ');

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

  let sourceNames = filteredSourceObjects.map(obj => `src/sounds/${obj.name}`);

  // List of sounds to play
  let playList = sourceNames.map(source => new Howl({ src: [source] }));

  // Play the playlist
  playList.forEach((sound, index) => {
    if (transcript.includes('QUICK')) {
      sound.rate(4.0);
    } else if (transcript.includes('SLOW')) {
      sound.rate(0.5);
    } else sound.rate(1);

    if (transcript.includes('LOUD')) {
      sound.volume(1);
    } else if (transcript.includes('SOFT')) {
      sound.volume(0.1);
    } else sound.volume(0.5);
    console.log(`Playing Sound #${index}`);
    sound.play();
  });
};

recognition.onend = function() {
  if (toggle) recognition.start();
};
