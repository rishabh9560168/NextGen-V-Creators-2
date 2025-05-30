
// Global Variables
let currentStep = 0;
let isRunning = false;
let waveformAnimation = null;
let multimeterMode = 'voltage';
let currentLanguage = 'en';

// State Management
const state = {
  frequency: 50,
  amplitude: 5,
  timebase: 10,
  voltdiv: 2,
  waveform: 'sine',
  multimeterValue: 0,
  multimeterMode: 'voltage',
  isHold: false
};

// Language Translations
const translations = {
  en: {
    mainTitle: "Professional Virtual Electronics Laboratory",
    langLabel: "Language:",
    instructionTitle: "Step-by-Step Instructions",
    prevText: "Previous",
    nextText: "Next",
    statusReady: "READY",
    multimeterReady: "READY",
    freqLabel: "FREQ",
    timeLabel: "TIME",
    signalGenTitle: "Signal Generator",
    waveformLabel: "Waveform",
    sineWave: "Sine Wave",
    squareWave: "Square Wave",
    triangleWave: "Triangle Wave",
    sawtoothWave: "Sawtooth Wave",
    frequencyLabel: "Frequency",
    amplitudeLabel: "Amplitude",
    timebaseTitle: "Timebase",
    timeDivLabel: "Time/Div",
    voltDivLabel: "Volt/Div",
    operationTitle: "Operation",
    inputLabel: "Input Value (for simulation)",
    instructions: [
      "Welcome to the Professional Virtual Electronics Laboratory. Select an instrument to begin your simulation.",
      "Select the Digital Oscilloscope tab to start with signal generation and waveform analysis.",
      "Choose a waveform type from the dropdown menu (Sine, Square, Triangle, or Sawtooth).",
      "Adjust the frequency using the rotary knob or +/- buttons. Observe how it affects the waveform.",
      "Modify the amplitude to see signal strength changes on the display.",
      "Use timebase controls to adjust the time scale and voltage division settings.",
      "Switch to the Digital Multimeter tab to measure electrical parameters.",
      "Practice with different measurement modes and input values to understand instrument behavior."
    ]
  },
  hi: {
    mainTitle: "व्यावसायिक आभासी इलेक्ट्रॉनिक्स प्रयोगशाला",
    langLabel: "भाषा:",
    instructionTitle: "चरणबद्ध निर्देश",
    prevText: "पिछला",
    nextText: "अगला",
    statusReady: "तैयार",
    multimeterReady: "तैयार",
    freqLabel: "आवृत्ति",
    timeLabel: "समय",
    signalGenTitle: "सिग्नल जेनरेटर",
    waveformLabel: "तरंग रूप",
    sineWave: "साइन तरंग",
    squareWave: "वर्गाकार तरंग",
    triangleWave: "त्रिकोणीय तरंग",
    sawtoothWave: "आरी दांत तरंग",
    frequencyLabel: "आवृत्ति",
    amplitudeLabel: "आयाम",
    timebaseTitle: "समय आधार",
    timeDivLabel: "समय/विभाजन",
    voltDivLabel: "वोल्ट/विभाजन",
    operationTitle: "संचालन",
    inputLabel: "इनपुट मान (सिमुलेशन के लिए)",
    instructions: [
      "व्यावसायिक आभासी इलेक्ट्रॉनिक्स प्रयोगशाला में आपका स्वागत है। सिमुलेशन शुरू करने के लिए एक उपकरण चुनें।",
      "सिग्नल जेनरेशन और तरंग विश्लेषण शुरू करने के लिए डिजिटल ऑसिलोस्कोप टैब चुनें।",
      "ड्रॉपडाउन मेनू से तरंग प्रकार चुनें (साइन, वर्गाकार, त्रिकोणीय, या आरी दांत)।",
      "रोटरी नॉब या +/- बटन का उपयोग करके आवृत्ति समायोजित करें। देखें कि यह तरंग को कैसे प्रभावित करता है।",
      "डिस्प्ले पर सिग्नल की शक्ति में बदलाव देखने के लिए आयाम को संशोधित करें।",
      "समय स्केल और वोल्टेज डिवीजन सेटिंग्स को समायोजित करने के लिए टाइमबेस नियंत्रण का उपयोग करें।",
      "विद्युत पैरामीटर मापने के लिए डिजिटल मल्टीमीटर टैब पर स्विच करें।",
      "उपकरण व्यवहार को समझने के लिए विभिन्न माप मोड और इनपुट मानों का अभ्यास करें।"
    ]
  }
};

// Canvas Drawing Functions
function drawGrid(ctx, canvas) {
  const gridSize = 25;
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw center axes
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
  ctx.lineWidth = 2;
  
  // Center vertical line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  
  // Center horizontal line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function generateWaveform(type, amplitude, frequency, phase = 0) {
  const points = [];
  const sampleRate = 800; // Points across canvas width
  
  for (let i = 0; i < sampleRate; i++) {
    const t = (i / sampleRate) * 4 * Math.PI; // 4 cycles across screen
    const normalizedFreq = frequency / 50; // Normalize to base frequency
    let y;
    
    switch (type) {
      case 'sine':
        y = Math.sin(t * normalizedFreq + phase);
        break;
      case 'square':
        y = Math.sign(Math.sin(t * normalizedFreq + phase));
        break;
      case 'triangle':
        y = (2 / Math.PI) * Math.asin(Math.sin(t * normalizedFreq + phase));
        break;
      case 'sawtooth':
        y = 2 * ((t * normalizedFreq + phase) / (2 * Math.PI) - Math.floor((t * normalizedFreq + phase) / (2 * Math.PI) + 0.5));
        break;
      default:
        y = Math.sin(t * normalizedFreq + phase);
    }
    
    points.push({
      x: i,
      y: y * amplitude * (state.voltdiv * 10) // Scale by voltage division
    });
  }
  
  return points;
}

function drawWaveform(ctx, canvas, points) {
  if (points.length === 0) return;
  
  ctx.strokeStyle = '#00ff41';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00ff41';
  ctx.shadowBlur = 8;
  
  ctx.beginPath();
  
  for (let i = 0; i < points.length; i++) {
    const x = (points[i].x / 800) * canvas.width;
    const y = canvas.height / 2 - points[i].y;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function updateOscilloscope() {
  const canvas = document.getElementById('croCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  drawGrid(ctx, canvas);
  
  if (isRunning) {
    // Generate and draw waveform
    const phase = Date.now() * 0.01 * (state.frequency / 50);
    const points = generateWaveform(state.waveform, state.amplitude, state.frequency, phase);
    drawWaveform(ctx, canvas, points);
    
    // Update readouts
    updateReadouts();
  }
}

function updateReadouts() {
  const ch1Voltage = document.getElementById('ch1Voltage');
  const freqReadout = document.getElementById('freqReadout');
  const timeReadout = document.getElementById('timeReadout');
  
  if (ch1Voltage) ch1Voltage.textContent = `${state.amplitude.toFixed(1)}V`;
  if (freqReadout) freqReadout.textContent = `${state.frequency.toFixed(1)}Hz`;
  if (timeReadout) timeReadout.textContent = `${state.timebase.toFixed(1)}ms`;
}

// Multimeter Functions
function updateMultimeterDisplay() {
  const measurementValue = document.getElementById('measurementValue');
  const measurementUnit = document.getElementById('measurementUnit');
  const measurementSign = document.getElementById('measurementSign');
  const bargraph = document.getElementById('analogBargraph');
  
  if (!measurementValue || state.isHold) return;
  
  let value = state.multimeterValue;
  let unit = 'V';
  
  switch (state.multimeterMode) {
    case 'voltage':
      unit = 'V';
      break;
    case 'current':
      unit = 'A';
      value = value / 1000; // Convert to milliamps
      break;
    case 'resistance':
      unit = 'Ω';
      value = Math.abs(value) * 1000; // Convert to resistance
      break;
    case 'capacitance':
      unit = 'μF';
      value = Math.abs(value) * 10; // Convert to microfarads
      break;
    case 'frequency':
      unit = 'Hz';
      value = Math.abs(value) * 100; // Convert to frequency
      break;
  }
  
  measurementValue.textContent = Math.abs(value).toFixed(3);
  measurementUnit.textContent = unit;
  measurementSign.textContent = value >= 0 ? '+' : '-';
  
  // Update bargraph
  const percentage = Math.min(Math.abs(value) / 10 * 100, 100);
  bargraph.style.width = `${percentage}%`;
}

function switchMeasurementMode(mode) {
  state.multimeterMode = mode;
  
  // Update mode indicators
  document.querySelectorAll('.indicator').forEach(indicator => {
    indicator.classList.remove('active');
  });
  
  // Update active indicators based on mode
  const dcIndicator = document.getElementById('dcIndicator');
  const acIndicator = document.getElementById('acIndicator');
  
  if (mode === 'voltage' || mode === 'current') {
    dcIndicator.classList.add('active');
  }
  
  updateMultimeterDisplay();
}

// Control Functions
function updateKnobDisplay(control, value) {
  const display = document.getElementById(`${control}Value`);
  const indicator = document.querySelector(`[data-control="${control}"] .knob-indicator`);
  
  if (display) {
    let displayValue = value;
    let unit = '';
    
    switch (control) {
      case 'frequency':
        unit = ' Hz';
        break;
      case 'amplitude':
        unit = ' V';
        break;
      case 'timebase':
        unit = ' ms';
        break;
      case 'voltdiv':
        unit = ' V';
        break;
    }
    
    display.textContent = `${displayValue}${unit}`;
  }
  
  if (indicator) {
    // Rotate indicator based on value
    const minVal = control === 'frequency' ? 1 : 1;
    const maxVal = control === 'frequency' ? 1000 : (control === 'timebase' ? 100 : (control === 'amplitude' ? 10 : 5));
    const percentage = (value - minVal) / (maxVal - minVal);
    const rotation = percentage * 270 - 135; // -135 to +135 degrees
    indicator.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
  }
}

function adjustValue(control, action) {
  const input = document.getElementById(control);
  if (!input) return;
  
  let currentValue = parseFloat(input.value);
  let step = 1;
  
  switch (control) {
    case 'frequency':
      step = 5;
      break;
    case 'amplitude':
      step = 0.5;
      break;
    case 'timebase':
      step = 1;
      break;
    case 'voltdiv':
      step = 0.5;
      break;
    case 'inputValue':
      step = 0.1;
      break;
  }
  
  if (action === 'increase') {
    currentValue += step;
  } else {
    currentValue -= step;
  }
  
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  currentValue = Math.max(min, Math.min(max, currentValue));
  
  input.value = currentValue;
  input.dispatchEvent(new Event('input'));
}

// Animation Functions
function startAnimation() {
  if (waveformAnimation) {
    cancelAnimationFrame(waveformAnimation);
  }
  
  function animate() {
    updateOscilloscope();
    if (isRunning) {
      waveformAnimation = requestAnimationFrame(animate);
    }
  }
  
  animate();
}

function stopAnimation() {
  if (waveformAnimation) {
    cancelAnimationFrame(waveformAnimation);
    waveformAnimation = null;
  }
}

// Language Functions
function updateLanguage(lang) {
  currentLanguage = lang;
  const t = translations[lang];
  
  // Update text elements
  Object.keys(t).forEach(key => {
    const element = document.getElementById(key);
    if (element && typeof t[key] === 'string') {
      element.textContent = t[key];
    }
  });
  
  // Update current instruction
  updateCurrentInstruction();
}

function updateCurrentInstruction() {
  const instructionElement = document.getElementById('currentInstruction');
  if (instructionElement) {
    const instructions = translations[currentLanguage].instructions;
    instructionElement.textContent = instructions[currentStep] || instructions[0];
  }
}

function updateProgressBar() {
  const progressBar = document.getElementById('instructionProgress');
  const stepCounter = document.getElementById('stepCounter');
  
  if (progressBar && stepCounter) {
    const totalSteps = translations[currentLanguage].instructions.length;
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    stepCounter.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
  }
}

// Tab Functions
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-trigger').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');
  
  // Start appropriate simulation
  if (tabName === 'cro' && isRunning) {
    startAnimation();
  }
}

// Event Listeners
function initializeEventListeners() {
  // Language selector
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      updateLanguage(e.target.value);
    });
  }
  
  // Instruction navigation
  const prevStep = document.getElementById('prevStep');
  const nextStep = document.getElementById('nextStep');
  
  if (prevStep) {
    prevStep.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateCurrentInstruction();
        updateProgressBar();
      }
    });
  }
  
  if (nextStep) {
    nextStep.addEventListener('click', () => {
      const maxSteps = translations[currentLanguage].instructions.length - 1;
      if (currentStep < maxSteps) {
        currentStep++;
        updateCurrentInstruction();
        updateProgressBar();
      }
    });
  }
  
  // Tab switching
  document.querySelectorAll('.tab-trigger').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });
  
  // Oscilloscope controls
  const startStopBtn = document.getElementById('startStop');
  if (startStopBtn) {
    startStopBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      startStopBtn.textContent = isRunning ? 'STOP' : 'RUN';
      startStopBtn.classList.toggle('stop', isRunning);
      
      if (isRunning) {
        startAnimation();
      } else {
        stopAnimation();
      }
    });
  }
  
  const resetBtn = document.getElementById('croReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset to default values
      state.frequency = 50;
      state.amplitude = 5;
      state.timebase = 10;
      state.voltdiv = 2;
      state.waveform = 'sine';
      
      // Update UI
      document.getElementById('frequency').value = state.frequency;
      document.getElementById('amplitude').value = state.amplitude;
      document.getElementById('timebase').value = state.timebase;
      document.getElementById('voltdiv').value = state.voltdiv;
      document.getElementById('waveform').value = state.waveform;
      
      // Update displays
      updateKnobDisplay('frequency', state.frequency);
      updateKnobDisplay('amplitude', state.amplitude);
      updateKnobDisplay('timebase', state.timebase);
      updateKnobDisplay('voltdiv', state.voltdiv);
      
      updateOscilloscope();
    });
  }
  
  // Control inputs
  ['frequency', 'amplitude', 'timebase', 'voltdiv'].forEach(control => {
    const input = document.getElementById(control);
    if (input) {
      input.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        state[control] = value;
        updateKnobDisplay(control, value);
        updateOscilloscope();
      });
    }
  });
  
  const waveformSelect = document.getElementById('waveform');
  if (waveformSelect) {
    waveformSelect.addEventListener('change', (e) => {
      state.waveform = e.target.value;
      updateOscilloscope();
    });
  }
  
  // Fine adjustment buttons
  document.querySelectorAll('.fine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const control = btn.dataset.control;
      const action = btn.dataset.action;
      adjustValue(control, action);
    });
  });
  
  // Multimeter controls
  const measureBtn = document.getElementById('measure');
  if (measureBtn) {
    measureBtn.addEventListener('click', () => {
      // Simulate measurement
      state.multimeterValue = (Math.random() - 0.5) * 10;
      updateMultimeterDisplay();
    });
  }
  
  const holdBtn = document.getElementById('hold');
  if (holdBtn) {
    holdBtn.addEventListener('click', () => {
      state.isHold = !state.isHold;
      holdBtn.textContent = state.isHold ? 'RELEASE' : 'HOLD';
      
      const holdIndicator = document.getElementById('holdIndicator');
      if (holdIndicator) {
        holdIndicator.classList.toggle('active', state.isHold);
      }
    });
  }
  
  const multimeterResetBtn = document.getElementById('multimeterReset');
  if (multimeterResetBtn) {
    multimeterResetBtn.addEventListener('click', () => {
      state.multimeterValue = 0;
      state.isHold = false;
      updateMultimeterDisplay();
      
      const holdBtn = document.getElementById('hold');
      if (holdBtn) holdBtn.textContent = 'HOLD';
      
      const holdIndicator = document.getElementById('holdIndicator');
      if (holdIndicator) holdIndicator.classList.remove('active');
    });
  }
  
  // Multimeter mode selection
  document.querySelectorAll('.position').forEach(position => {
    position.addEventListener('click', () => {
      const mode = position.dataset.mode;
      switchMeasurementMode(mode);
    });
  });
  
  // Input value controls
  const inputValue = document.getElementById('inputValue');
  if (inputValue) {
    inputValue.addEventListener('input', (e) => {
      state.multimeterValue = parseFloat(e.target.value) || 0;
      updateMultimeterDisplay();
    });
  }
  
  document.querySelectorAll('.precision-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const control = btn.dataset.control;
      const action = btn.dataset.action;
      adjustValue(control, action);
    });
  });
  
  // Rotary knob interactions
  document.querySelectorAll('.rotary-knob').forEach(knob => {
    let isDragging = false;
    let startY = 0;
    let startValue = 0;
    
    knob.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      const control = knob.dataset.control;
      const input = document.getElementById(control);
      startValue = parseFloat(input.value);
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaY = startY - e.clientY; // Inverted for natural feel
      const control = knob.dataset.control;
      const input = document.getElementById(control);
      
      let sensitivity = 1;
      switch (control) {
        case 'frequency':
          sensitivity = 2;
          break;
        case 'amplitude':
          sensitivity = 0.05;
          break;
        case 'timebase':
          sensitivity = 0.5;
          break;
        case 'voltdiv':
          sensitivity = 0.02;
          break;
      }
      
      const newValue = startValue + deltaY * sensitivity;
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      const clampedValue = Math.max(min, Math.min(max, newValue));
      
      input.value = clampedValue;
      input.dispatchEvent(new Event('input'));
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });
}

// Initialization
function initialize() {
  console.log('Initializing Virtual Electronics Laboratory...');
  
  // Set initial language
  updateLanguage('en');
  
  // Initialize controls
  updateKnobDisplay('frequency', state.frequency);
  updateKnobDisplay('amplitude', state.amplitude);
  updateKnobDisplay('timebase', state.timebase);
  updateKnobDisplay('voltdiv', state.voltdiv);
    // Initialize displays
  updateOscilloscope();
  updateMultimeterDisplay();
  updateProgressBar();
  
  // Setup event listeners
  initializeEventListeners();
  
  console.log('Virtual Electronics Laboratory initialized successfully');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);

// Handle window resize
window.addEventListener('resize', () => {
  // Redraw oscilloscope if running
  if (isRunning) {
    updateOscilloscope();
  }
});

// Export for global access
window.VirtualLab = {
  state,
  updateOscilloscope,
  updateMultimeterDisplay,
  switchTab,
  adjustValue
};
