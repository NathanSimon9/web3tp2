

console.log('🔊 Initialisation de Tone.js...');

// ==================== VARIABLES GLOBALES ====================
let audioInitialized = false;
let isMuted = false;

// Synthétiseurs
let clickSynth = null;
let scanSynth = null;
let alertSynth = null;
let ambientSynth = null;
let switchSynth = null;

// ==================== INITIALISATION AUDIO ====================
async function initAudio() {
  if (audioInitialized) return;
  
  try {
    await Tone.start();
    console.log('✅ Tone.js Audio Context démarré');
    
    // Synthé pour les clics
    clickSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    clickSynth.volume.value = -15;

    // Synthé pour les scans
    scanSynth = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.1,
        release: 0.5
      }
    }).toDestination();
    scanSynth.volume.value = -20;

    // Synthé pour les alertes
    alertSynth = new Tone.AMSynth({
      harmonicity: 2,
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.3
      }
    }).toDestination();
    alertSynth.volume.value = -18;

    // Synthé pour les switch/toggle
    switchSynth = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.7
    }).toDestination();
    switchSynth.volume.value = -12;

    // Ambiance futuriste (drone)
    ambientSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.8,
        release: 3
      }
    }).toDestination();
    ambientSynth.volume.value = -30;

    audioInitialized = true;
    console.log('✅ Synthétiseurs Tone.js créés');
    
    // Jouer un son de démarrage
    playStartupSound();
    
  } catch (error) {
    console.warn('⚠️ Impossible d\'initialiser Tone.js:', error);
  }
}

// ==================== SON DE DÉMARRAGE ====================
function playStartupSound() {
  if (!audioInitialized || isMuted) return;
  
  const now = Tone.now();
  
  // Séquence de notes montantes
  clickSynth.triggerAttackRelease('C4', '16n', now);
  clickSynth.triggerAttackRelease('E4', '16n', now + 0.1);
  clickSynth.triggerAttackRelease('G4', '16n', now + 0.2);
  clickSynth.triggerAttackRelease('C5', '8n', now + 0.3);
}

// ==================== SONS D'INTERFACE ====================
window.playUISound = function(type) {
  if (!audioInitialized || isMuted) return;
  
  const now = Tone.now();
  
  switch(type) {
    case 'click':
      clickSynth.triggerAttackRelease('C5', '32n', now);
      break;
      
    case 'hover':
      clickSynth.triggerAttackRelease('G5', '64n', now);
      break;
      
    case 'scan':
      scanSynth.triggerAttackRelease('A3', '4n', now);
      setTimeout(() => {
        scanSynth.triggerAttackRelease('E4', '8n');
      }, 200);
      break;
      
    case 'alert':
      alertSynth.triggerAttackRelease('F4', '8n', now);
      alertSynth.triggerAttackRelease('F4', '8n', now + 0.15);
      break;
      
    case 'switch':
      switchSynth.triggerAttack('C4', now);
      break;
      
    case 'refresh':
      clickSynth.triggerAttackRelease('E5', '16n', now);
      clickSynth.triggerAttackRelease('G5', '16n', now + 0.05);
      clickSynth.triggerAttackRelease('E5', '16n', now + 0.1);
      break;
      
    case 'success':
      clickSynth.triggerAttackRelease('C5', '16n', now);
      clickSynth.triggerAttackRelease('E5', '16n', now + 0.1);
      clickSynth.triggerAttackRelease('G5', '8n', now + 0.2);
      break;
      
    case 'error':
      alertSynth.triggerAttackRelease('E3', '8n', now);
      alertSynth.triggerAttackRelease('C3', '8n', now + 0.15);
      break;
      
    case 'notification':
      scanSynth.triggerAttackRelease('G4', '16n', now);
      break;
  }
};

// ==================== AMBIANCE ====================
let ambientLoop = null;

function startAmbient() {
  if (!audioInitialized || isMuted || ambientLoop) return;
  
  // Créer une boucle d'ambiance subtile
  ambientLoop = new Tone.Loop((time) => {
    const notes = ['C2', 'G2', 'C3'];
    const note = notes[Math.floor(Math.random() * notes.length)];
    ambientSynth.triggerAttackRelease(note, '2n', time);
  }, '4n');
  
  ambientLoop.start(0);
  Tone.Transport.start();
}

function stopAmbient() {
  if (ambientLoop) {
    ambientLoop.stop();
    ambientLoop.dispose();
    ambientLoop = null;
    Tone.Transport.stop();
  }
}

// ==================== TOGGLE MUTE ====================
function toggleMute() {
  isMuted = !isMuted;
  
  const soundIcon = document.getElementById('soundIcon');
  const soundBtn = document.getElementById('soundToggle');
  
  if (isMuted) {
    soundIcon.className = 'bi bi-volume-mute-fill';
    soundBtn.classList.add('muted');
    stopAmbient();
    Tone.Destination.mute = true;
  } else {
    soundIcon.className = 'bi bi-volume-up-fill';
    soundBtn.classList.remove('muted');
    Tone.Destination.mute = false;
    // Note: ambient désactivé par défaut pour ne pas être intrusif
  }
  
  console.log('🔊 Son:', isMuted ? 'OFF' : 'ON');
}

// ==================== ÉVÉNEMENTS SONORES AUTO ====================
function setupAutoSounds() {
  // Sons au clic sur les boutons
  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playUISound('click');
    });
  });
  
  // Sons au hover sur les cartes
  document.querySelectorAll('.piece-card, .target-item, .data-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      playUISound('hover');
    });
  });
  
  // Sons sur les changements de vue
  document.querySelectorAll('input[name="viewToggle"]').forEach(input => {
    input.addEventListener('change', () => {
      playUISound('switch');
    });
  });
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Bouton de son
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Initialiser audio au premier clic
      if (!audioInitialized) {
        await initAudio();
      }
      
      toggleMute();
    });
  }
  
  // Initialiser audio au premier clic sur la page
  const initOnInteraction = async () => {
    if (!audioInitialized) {
      await initAudio();
      setupAutoSounds();
    }
    document.removeEventListener('click', initOnInteraction);
  };
  
  document.addEventListener('click', initOnInteraction);
  
  console.log('✅ Module Tone.js prêt (cliquez pour activer le son)');
});

// ==================== EXPORT ====================
window.toggleMute = toggleMute;
window.playUISound = window.playUISound || function() {};
