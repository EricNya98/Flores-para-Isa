// Web Audio API Procedural Romantic Lullaby Synth
class RomanticSynth {
  private ctx: AudioContext | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private loopInterval: number | null = null;
  private currentNoteIndex = 0;

  // Romantic chord progression & melody notes (frequencies)
  // Cmaj7 -> Fmaj7 -> Am7 -> G6
  private chords = [
    [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
    [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4
    [110.00, 130.81, 164.81, 196.00], // A2, C3, E3, G3
    [98.00, 123.47, 146.83, 196.00],  // G2, B2, D3, G3
  ];

  private melody = [
    329.63, 392.00, 440.00, 523.25, // E4, G4, A4, C5
    587.33, 659.25, 783.99, 880.00, // D5, E5, G5, A5
  ];

  // Soft romantic sequence: beats and melody scale index
  private sequence = [
    { chord: 0, melody: [0, 2, 4, 5] },
    { chord: 1, melody: [1, 3, 5, 6] },
    { chord: 2, melody: [2, 4, 6, 7] },
    { chord: 3, melody: [1, 3, 5, 4] },
  ];

  init() {
    if (this.ctx) return;
    
    // Create Audio Context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Soft volume

    // Reverb/Delay unit for a dreamlike spacey sound
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(0.6, this.ctx.currentTime);

    this.feedbackGain = this.ctx.createGain();
    this.feedbackGain.gain.setValueAtTime(0.4, this.ctx.currentTime); // Gentle feedback

    // Lowpass filter to make it warm and soft (no harsh high frequencies)
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(1000, this.ctx.currentTime);

    // Wire up delay line
    // Synth -> Master -> Out
    // Synth -> Delay -> Filter -> Master
    // Delay -> Filter -> Feedback -> Delay
    this.delayNode.connect(this.filterNode);
    this.filterNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);
    
    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  // Soft pluck sound
  playPluck(freq: number, startTime: number, duration = 1.5, type: OscillatorType = 'triangle') {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm envelope
    gainNode.gain.setValueAtTime(0, startTime);
    // Soft attack
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
    // Smooth decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // Also send to delay line
    if (this.delayNode) {
      gainNode.connect(this.delayNode);
    }

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // Bubble sound for click interactions
  playBubbleClick() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') {
      this.ctx?.resume();
    }
    const now = this.ctx!.currentTime;
    // Play dual high notes for a magical "ding/pop"
    this.playPluck(523.25, now, 0.4, 'sine'); // C5
    this.playPluck(783.99, now + 0.05, 0.5, 'sine'); // G5
  }

  // Soft breaking wax seal sound effect
  playSealBreak() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') {
      this.ctx?.resume();
    }
    const now = this.ctx!.currentTime;
    
    // Low rumble plucks and a magical rising sweep
    this.playPluck(196.00, now, 0.8, 'triangle'); // G3
    this.playPluck(261.63, now + 0.08, 0.9, 'sine'); // C4
    this.playPluck(392.00, now + 0.15, 1.2, 'sine'); // G4
    this.playPluck(523.25, now + 0.22, 1.5, 'sine'); // C5
    this.playPluck(783.99, now + 0.30, 2.0, 'sine'); // G5
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const playNextBeat = () => {
      if (!this.ctx || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      const step = this.sequence[this.currentNoteIndex % this.sequence.length];
      
      // Play a root chord note (bass)
      const chordFreqs = this.chords[step.chord];
      this.playPluck(chordFreqs[0], now, 4.0, 'triangle'); // deep root note
      
      // Stagger chord tones
      this.playPluck(chordFreqs[1], now + 0.15, 3.5, 'triangle');
      this.playPluck(chordFreqs[2], now + 0.30, 3.0, 'triangle');
      this.playPluck(chordFreqs[3], now + 0.45, 2.5, 'triangle');

      // Play soft melodies on top
      step.melody.forEach((melodyIdx, beatIdx) => {
        const noteFreq = this.melody[melodyIdx];
        const beatTime = now + beatIdx * 0.8 + 0.6; // delay melody slightly from root chord
        this.playPluck(noteFreq, beatTime, 1.8, 'sine');
      });

      this.currentNoteIndex++;
      // Loop every 3.6 seconds for the next step of progression
      this.loopInterval = window.setTimeout(playNextBeat, 3600);
    };

    playNextBeat();
  }

  stop() {
    this.isPlaying = false;
    if (this.loopInterval) {
      clearTimeout(this.loopInterval);
      this.loopInterval = null;
    }
  }

  toggle(play: boolean) {
    if (play) {
      this.start();
    } else {
      this.stop();
    }
  }

  setVolume(volume: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(volume * 0.1, this.ctx.currentTime);
    }
  }
}

export const romanticSynth = new RomanticSynth();
