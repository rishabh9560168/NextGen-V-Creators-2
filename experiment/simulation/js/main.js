class ProfessionalVirtualLab {
  constructor() {
    this.currentTab = 'cro';
    this.croRunning = false;
    this.multimeterHold = false;
    this.animationId = null;
    this.currentStep = 0;
    this.maxSteps = 8;
    
    // Enhanced CRO settings
    this.croSettings = {
      waveform: 'sine',
      frequency: 50,
      amplitude: 5,
      timebase: 10,
      voltdiv: 2
    };
    
    // Multimeter settings
    this.multimeterSettings = {
      mode: 'voltage',
      range: 'auto',
      inputValue: 0,
      autoRange: true
    };
    
    // Step-by-step instructions
    this.instructions = [
      {
        title: "Welcome to Professional Virtual Electronics Laboratory",
        content: "This advanced simulation provides realistic representations of professional test equipment. You'll learn to operate a Digital Storage Oscilloscope and a True RMS Digital Multimeter.",
        action: "Begin by selecting an instrument tab above."
      },
      {
        title: "Digital Oscilloscope Overview",
        content: "The oscilloscope displays electrical signals as waveforms. Key components include the display screen, timebase controls, voltage controls, and signal generator.",
        action: "Click on 'Digital Oscilloscope' tab to examine the instrument."
      },
      {
        title: "Signal Generation and Waveform Selection",
        content: "Use the waveform selector to choose between sine, square, triangle, and sawtooth waves. The signal generator simulates various electrical signals for testing.",
        action: "Try changing the waveform type and observe the differences."
      },
      {
        title: "Frequency and Amplitude Control",
        content: "Adjust frequency using the rotary knob or fine-tune buttons. Frequency determines how fast the signal oscillates. Amplitude controls the signal's peak voltage.",
        action: "Experiment with different frequency and amplitude values."
      },
      {
        title: "Timebase and Voltage Scale",
        content: "Timebase (Time/Div) controls horizontal scaling - how much time each grid division represents. Volt/Div controls vertical scaling for voltage measurements.",
        action: "Adjust these controls to optimize waveform display."
      },
      {
        title: "Running Oscilloscope Measurements",
        content: "Click RUN to start continuous waveform capture. Use AUTOSET for automatic optimal settings. The display shows real-time measurements.",
        action: "Start the oscilloscope and observe the live waveform."
      },
      {
        title: "Digital Multimeter Operation",
        content: "Switch to the multimeter tab. This instrument measures DC voltage, current, resistance, capacitance, and frequency with high precision.",
        action: "Click on 'Digital Multimeter' tab to examine this instrument."
      },
      {
        title: "Multimeter Measurements and Controls",
        content: "Use the rotary selector to choose measurement type. Enter simulation values and click MEASURE. The LCD shows primary reading, secondary info, and analog bargraph.",
        action: "Practice different measurement types with various input values."
      }
    ];
    
    // Initialize everything
    this.initializeEventListeners();
    this.initializeCRO();
    this.initializeMultimeter();
    this.initializeInstructions();
    this.speak("Welcome to Professional Virtual Electronics Laboratory");
  }
  
  // Enhanced voice synthesis
  speak(text) {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Add slight delay to ensure cancellation
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }
  
  // Initialize step-by-step instructions
  initializeInstructions() {
    this.updateInstructionDisplay();
    
    document.getElementById('prevStep').addEventListener('click', () => {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.updateInstructionDisplay();
        this.speak(this.instructions[this.currentStep].content);
      }
    });
    
    document.getElementById('nextStep').addEventListener('click', () => {
      if (this.currentStep < this.maxSteps - 1) {
        this.currentStep++;
        this.updateInstructionDisplay();
        this.speak(this.instructions[this.currentStep].content);
      }
    });
  }
  
  updateInstructionDisplay() {
    const instruction = this.instructions[this.currentStep];
    const instructionElement = document.getElementById('currentInstruction');
    const counterElement = document.getElementById('stepCounter');
    const progressElement = document.getElementById('instructionProgress');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    // Update content
    instructionElement.innerHTML = `
      <strong>${instruction.title}</strong><br>
      ${instruction.content}<br>
      <em style="color: #22d3ee; margin-top: 10px; display: block;">${instruction.action}</em>
    `;
    
    // Update counter
    counterElement.textContent = `Step ${this.currentStep + 1} of ${this.maxSteps}`;
    
    // Update progress bar
    const progressPercent = ((this.currentStep + 1) / this.maxSteps) * 100;
    progressElement.style.width = `${progressPercent}%`;
    
    // Update button states
    prevBtn.disabled = this.currentStep === 0;
    nextBtn.disabled = this.currentStep === this.maxSteps - 1;
  }
  
  initializeEventListeners() {
    // Tab switching with enhanced feedback
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
    
    // Enhanced tap button handlers
    document.querySelectorAll('.tap-btn, .fine-btn, .precision-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const control = e.target.dataset.control;
        const action = e.target.dataset.action;
        if (control && action) {
          this.handleTapButton(control, action);
        }
      });
    });
    
    // Rotary knob interactions
    document.querySelectorAll('.rotary-knob').forEach(knob => {
      this.initializeRotaryKnob(knob);
    });
    
    // CRO control event listeners
    this.initializeCROControls();
    
    // Multimeter control event listeners
    this.initializeMultimeterControls();
    
    // Selector dial for multimeter
    this.initializeSelectorDial();
  }
  
  initializeRotaryKnob(knobElement) {
    const control = knobElement.dataset.control;
    const rangeInput = knobElement.querySelector('.hidden-range');
    const indicator = knobElement.querySelector('.knob-indicator');
    
    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0;
    
    const updateKnobRotation = (angle) => {
      // Constrain rotation to meaningful range
      const constrainedAngle = Math.max(-150, Math.min(150, angle));
      indicator.style.transform = `translateX(-50%) rotate(${constrainedAngle}deg)`;
      
      // Convert angle to value
      const value = this.angleToValue(constrainedAngle, rangeInput);
      rangeInput.value = value;
      
      // Trigger input event
      const event = new Event('input', { bubbles: true });
      rangeInput.dispatchEvent(event);
    };
    
    knobElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      startAngle = this.getAngle(e, knobElement);
      knobElement.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const currentAngle = this.getAngle(e, knobElement);
      const deltaAngle = currentAngle - startAngle;
      currentRotation += deltaAngle;
      
      updateKnobRotation(currentRotation);
      startAngle = currentAngle;
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        knobElement.style.cursor = 'pointer';
      }
    });
  }
  
  getAngle(event, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }
  
  angleToValue(angle, rangeInput) {
    const min = parseInt(rangeInput.min);
    const max = parseInt(rangeInput.max);
    const normalizedAngle = (angle + 150) / 300; // Convert -150 to 150 range to 0-1
    return Math.round(min + (normalizedAngle * (max - min)));
  }
  
  initializeCROControls() {
    // Waveform selector
    document.getElementById('waveform').addEventListener('change', (e) => {
      this.croSettings.waveform = e.target.value;
      this.speak(`Waveform changed to ${e.target.value} wave`);
      this.updateCRODisplay();
    });
    
    // Frequency control
    document.getElementById('frequency').addEventListener('input', (e) => {
      this.croSettings.frequency = parseInt(e.target.value);
      document.getElementById('frequencyValue').textContent = `${e.target.value} Hz`;
      document.getElementById('freqReadout').textContent = `${e.target.value} Hz`;
      this.updateCRODisplay();
    });
    
    // Amplitude control
    document.getElementById('amplitude').addEventListener('input', (e) => {
      this.croSettings.amplitude = parseInt(e.target.value);
      document.getElementById('amplitudeValue').textContent = `${e.target.value}.0 V`;
      document.getElementById('ch1Voltage').textContent = `${e.target.value}.0V`;
      this.updateCRODisplay();
    });
    
    // Timebase control
    document.getElementById('timebase').addEventListener('input', (e) => {
      this.croSettings.timebase = parseInt(e.target.value);
      document.getElementById('timebaseValue').textContent = `${e.target.value} ms`;
      document.getElementById('timeReadout').textContent = `${e.target.value}.0ms`;
      this.updateCRODisplay();
    });
    
    // Volt/Div control
    document.getElementById('voltdiv').addEventListener('input', (e) => {
      this.croSettings.voltdiv = parseInt(e.target.value);
      document.getElementById('voltdivValue').textContent = `${e.target.value}.0 V`;
      this.updateCRODisplay();
    });
    
    // Control buttons
    document.getElementById('startStop').addEventListener('click', () => {
      this.toggleCRO();
    });
    
    document.getElementById('croReset').addEventListener('click', () => {
      this.resetCRO();
    });
    
    document.getElementById('autosetCRO').addEventListener('click', () => {
      this.autosetCRO();
    });
  }
  
  initializeMultimeterControls() {
    // Input value control
    document.getElementById('inputValue').addEventListener('input', (e) => {
      this.multimeterSettings.inputValue = parseFloat(e.target.value) || 0;
    });
    
    // Control buttons
    document.getElementById('measure').addEventListener('click', () => {
      this.performMeasurement();
    });
    
    document.getElementById('hold').addEventListener('click', () => {
      this.toggleHold();
    });
    
    document.getElementById('multimeterReset').addEventListener('click', () => {
      this.resetMultimeter();
    });
    
    document.getElementById('autoRange').addEventListener('click', () => {
      this.toggleAutoRange();
    });
  }
  
  initializeSelectorDial() {
    const dial = document.querySelector('.selector-dial');
    const pointer = document.querySelector('.selector-pointer');
    const positions = document.querySelectorAll('.position');
    
    positions.forEach((position, index) => {
      position.addEventListener('click', () => {
        const mode = position.dataset.mode;
        this.multimeterSettings.mode = mode;
        
        // Rotate pointer to position
        const angle = (index * 72) - 90; // 72 degrees per position, start at top
        pointer.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        
        // Update indicators
        this.updateModeIndicators(mode);
        this.speak(`Measurement mode changed to ${mode}`);
      });
    });
  }
  
  updateModeIndicators(mode) {
    // Reset all indicators
    document.querySelectorAll('.indicator').forEach(ind => {
      ind.classList.remove('active');
    });
    
    // Activate relevant indicators based on mode
    if (mode === 'voltage') {
      document.getElementById('dcIndicator').classList.add('active');
    } else if (mode === 'current') {
      document.getElementById('dcIndicator').classList.add('active');
    }
    
    if (this.multimeterSettings.autoRange) {
      document.getElementById('autoIndicator').classList.add('active');
    }
    
    if (this.multimeterHold) {
      document.getElementById('holdIndicator').classList.add('active');
    }
  }
  
  handleTapButton(control, action) {
    const element = document.getElementById(control);
    if (!element) return;
    
    let currentValue, newValue, min, max, step;
    
    if (control === 'inputValue') {
      currentValue = parseFloat(element.value) || 0;
      step = 0.001;
      min = -1000;
      max = 1000;
    } else {
      currentValue = parseInt(element.value);
      min = parseInt(element.min);
      max = parseInt(element.max);
      step = 1;
      
      // Adjust step size for frequency
      if (control === 'frequency') {
        step = currentValue > 100 ? 10 : (currentValue > 10 ? 5 : 1);
      }
    }
    
    if (action === 'increase') {
      newValue = Math.min(currentValue + step, max);
    } else {
      newValue = Math.max(currentValue - step, min);
    }
    
    // Update value and trigger events
    element.value = newValue;
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
    
    // Enhanced audio feedback
    const formattedValue = control === 'inputValue' ? 
      newValue.toFixed(3) : newValue.toString();
    this.speak(`${control.replace(/([A-Z])/g, ' $1').toLowerCase()} ${action}d to ${formattedValue}`);
  }
  
  switchTab(tab) {
    // Update tab triggers
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
      trigger.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update tab panels with animation
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');
    
    this.currentTab = tab;
    
    // Enhanced voice feedback
    if (tab === 'cro') {
      this.speak("Switched to Digital Storage Oscilloscope. This instrument displays electrical signals as waveforms on screen.");
      // Update instruction step if relevant
      if (this.currentStep === 1) {
        this.currentStep = 2;
        this.updateInstructionDisplay();
      }
    } else {
      this.speak("Switched to True RMS Digital Multimeter. This instrument provides precise measurements of electrical parameters.");
      // Update instruction step if relevant
      if (this.currentStep === 6) {
        this.currentStep = 7;
        this.updateInstructionDisplay();
      }
    }
  }
  
  initializeCRO() {
    this.canvas = document.getElementById('croCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas resolution for crisp display
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * 2;
    this.canvas.height = rect.height * 2;
    this.ctx.scale(2, 2);
    
    this.drawGrid();
    this.updateCRODisplay();
  }
  
  drawGrid() {
    const { width, height } = this.canvas;
    const displayWidth = width / 2;
    const displayHeight = height / 2;
    
    this.ctx.clearRect(0, 0, displayWidth, displayHeight);
    
    // Enhanced grid with professional appearance
    this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
    this.ctx.lineWidth = 0.5;
    
    // Major grid lines
    const majorSpacingX = displayWidth / 10;
    const majorSpacingY = displayHeight / 8;
    
    for (let i = 0; i <= 10; i++) {
      const x = i * majorSpacingX;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, displayHeight);
      this.ctx.stroke();
    }
    
    for (let i = 0; i <= 8; i++) {
      const y = i * majorSpacingY;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(displayWidth, y);
      this.ctx.stroke();
    }
    
    // Minor grid lines
    this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
    this.ctx.lineWidth = 0.25;
    
    const minorSpacingX = majorSpacingX / 5;
    const minorSpacingY = majorSpacingY / 5;
    
    for (let i = 0; i <= 50; i++) {
      const x = i * minorSpacingX;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, displayHeight);
      this.ctx.stroke();
    }
    
    for (let i = 0; i <= 40; i++) {
      const y = i * minorSpacingY;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(displayWidth, y);
      this.ctx.stroke();
    }
    
    // Center lines (enhanced)
    this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.8)';
    this.ctx.lineWidth = 1;
    
    // Vertical center
    this.ctx.beginPath();
    this.ctx.moveTo(displayWidth / 2, 0);
    this.ctx.lineTo(displayWidth / 2, displayHeight);
    this.ctx.stroke();
    
    // Horizontal center
    this.ctx.beginPath();
    this.ctx.moveTo(0, displayHeight / 2);
    this.ctx.lineTo(displayWidth, displayHeight / 2);
    this.ctx.stroke();
  }
  
  updateCRODisplay() {
    if (this.croRunning) return; // Don't interfere with running animation
    
    const { width, height } = this.canvas;
    const displayWidth = width / 2;
    const displayHeight = height / 2;
    
    this.drawGrid();
    this.drawStaticWaveform(displayWidth, displayHeight);
  }
  
  drawStaticWaveform(width, height) {
    const { waveform, frequency, amplitude, timebase, voltdiv } = this.croSettings;
    
    // Enhanced waveform drawing
    this.ctx.strokeStyle = '#00ff41';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#00ff41';
    this.ctx.shadowBlur = 4;
    
    this.ctx.beginPath();
    
    const centerY = height / 2;
    const timeScale = timebase / 1000;
    const verticalScale = (height / 8) / voltdiv;
    const pixelsPerSecond = width / (timeScale * 10);
    
    for (let x = 0; x < width; x++) {
      const time = (x - width/2) / pixelsPerSecond;
      let y;
      
      switch (waveform) {
        case 'sine':
          y = centerY - amplitude * Math.sin(2 * Math.PI * frequency * time) * verticalScale;
          break;
        case 'square':
          y = centerY - amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * time)) * verticalScale;
          break;
        case 'triangle':
          const trianglePhase = (2 * Math.PI * frequency * time) % (2 * Math.PI);
          y = centerY - amplitude * (2 * Math.abs(2 * (trianglePhase / (2 * Math.PI)) - 1) - 1) * verticalScale;
          break;
        case 'sawtooth':
          const sawtoothPhase = (2 * Math.PI * frequency * time) % (2 * Math.PI);
          y = centerY - amplitude * (2 * (sawtoothPhase / (2 * Math.PI)) - 1) * verticalScale;
          break;
        default:
          y = centerY;
      }
      
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }
  
  drawAnimatedWaveform() {
    if (!this.croRunning) return;
    
    const { width, height } = this.canvas;
    const displayWidth = width / 2;
    const displayHeight = height / 2;
    
    this.drawGrid();
    
    const { waveform, frequency, amplitude, timebase, voltdiv } = this.croSettings;
    const time = Date.now() * 0.001;
    
    // Enhanced animated waveform
    this.ctx.strokeStyle = '#00ff41';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = '#00ff41';
    this.ctx.shadowBlur = 6;
    
    this.ctx.beginPath();
    
    const centerY = displayHeight / 2;
    const timeScale = timebase / 1000;
    const verticalScale = (displayHeight / 8) / voltdiv;
    const pixelsPerSecond = displayWidth / (timeScale * 10);
    
    for (let x = 0; x < displayWidth; x++) {
      const t = (x - displayWidth/2) / pixelsPerSecond + time;
      let y;
      
      switch (waveform) {
        case 'sine':
          y = centerY - amplitude * Math.sin(2 * Math.PI * frequency * t) * verticalScale;
          break;
        case 'square':
          y = centerY - amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * t)) * verticalScale;
          break;
        case 'triangle':
          const trianglePhase = (2 * Math.PI * frequency * t) % (2 * Math.PI);
          y = centerY - amplitude * (2 * Math.abs(2 * (trianglePhase / (2 * Math.PI)) - 1) - 1) * verticalScale;
          break;
        case 'sawtooth':
          const sawtoothPhase = (2 * Math.PI * frequency * t) % (2 * Math.PI);
          y = centerY - amplitude * (2 * (sawtoothPhase / (2 * Math.PI)) - 1) * verticalScale;
          break;
        default:
          y = centerY;
      }
      
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    
    this.animationId = requestAnimationFrame(() => this.drawAnimatedWaveform());
  }
  
  toggleCRO() {
    const button = document.getElementById('startStop');
    
    if (this.croRunning) {
      this.croRunning = false;
      button.textContent = 'RUN';
      button.classList.remove('stop');
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.speak("Oscilloscope stopped. Display frozen.");
      this.updateCRODisplay();
    } else {
      this.croRunning = true;
      button.textContent = 'STOP';
      button.classList.add('stop');
      this.drawAnimatedWaveform();
      this.speak("Oscilloscope running. Live waveform capture enabled.");
    }
  }
  
  autosetCRO() {
    // Intelligent autoset based on current signal
    const optimalTimebase = Math.max(1, Math.floor(1000 / (this.croSettings.frequency * 2)));
    const optimalVoltdiv = Math.max(1, Math.ceil(this.croSettings.amplitude / 3));
    
    // Update settings
    this.croSettings.timebase = optimalTimebase;
    this.croSettings.voltdiv = optimalVoltdiv;
    
    // Update UI
    document.getElementById('timebase').value = optimalTimebase;
    document.getElementById('voltdiv').value = optimalVoltdiv;
    document.getElementById('timebaseValue').textContent = `${optimalTimebase} ms`;
    document.getElementById('voltdivValue').textContent = `${optimalVoltdiv}.0 V`;
    document.getElementById('timeReadout').textContent = `${optimalTimebase}.0ms`;
    
    this.updateCRODisplay();
    this.speak(`Autoset complete. Optimized timebase to ${optimalTimebase} milliseconds and voltage scale to ${optimalVoltdiv} volts per division.`);
  }
  
  resetCRO() {
    this.croRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Reset to defaults
    this.croSettings = {
      waveform: 'sine',
      frequency: 50,
      amplitude: 5,
      timebase: 10,
      voltdiv: 2
    };
    
    // Update all controls
    document.getElementById('waveform').value = 'sine';
    document.getElementById('frequency').value = 50;
    document.getElementById('amplitude').value = 5;
    document.getElementById('timebase').value = 10;
    document.getElementById('voltdiv').value = 2;
    
    // Update displays
    document.getElementById('frequencyValue').textContent = '50 Hz';
    document.getElementById('amplitudeValue').textContent = '5.0 V';
    document.getElementById('timebaseValue').textContent = '10 ms';
    document.getElementById('voltdivValue').textContent = '2.0 V';
    document.getElementById('freqReadout').textContent = '50 Hz';
    document.getElementById('ch1Voltage').textContent = '5.0V';
    document.getElementById('timeReadout').textContent = '10.0ms';
    
    // Reset button
    const button = document.getElementById('startStop');
    button.textContent = 'RUN';
    button.classList.remove('stop');
    
    this.updateCRODisplay();
    this.speak("Oscilloscope reset to factory defaults");
  }
  
  initializeMultimeter() {
    this.updateMultimeterDisplay(0, 'V', 'voltage');
    this.updateModeIndicators('voltage');
  }
  
  updateMultimeterDisplay(value, unit, mode) {
    const sign = value >= 0 ? '+' : '-';
    const absValue = Math.abs(value);
    
    // Format value based on magnitude for realistic display
    let displayValue;
    if (absValue < 0.001 && absValue > 0) {
      displayValue = (absValue * 1000).toFixed(1);
      unit = unit === 'V' ? 'mV' : (unit === 'A' ? 'mA' : unit);
    } else if (absValue < 1 && absValue >= 0.001) {
      displayValue = absValue.toFixed(3);
    } else if (absValue < 10) {
      displayValue = absValue.toFixed(2);
    } else if (absValue < 100) {
      displayValue = absValue.toFixed(1);
    } else {
      displayValue = absValue.toFixed(0);
    }
    
    document.getElementById('measurementSign').textContent = sign;
    document.getElementById('measurementValue').textContent = displayValue;
    document.getElementById('measurementUnit').textContent = unit;
    
    // Update range display
    const range = this.multimeterSettings.autoRange ? 'AUTO' : this.multimeterSettings.range;
    document.getElementById('rangeDisplay').textContent = range;
    
    // Update analog bargraph (0-100% based on range)
    const maxRange = this.getMaxRangeValue(mode);
    const percentage = Math.min((absValue / maxRange) * 100, 100);
    document.getElementById('analogBargraph').style.width = `${percentage}%`;
  }
  
  getMaxRangeValue(mode) {
    switch (mode) {
      case 'voltage': return 1000;
      case 'current': return 10;
      case 'resistance': return 10000;
      case 'capacitance': return 1000;
      case 'frequency': return 1000;
      default: return 100;
    }
  }
  
  performMeasurement() {
    if (this.multimeterHold) {
      this.speak("Measurement is on hold. Release hold to take new measurements.");
      return;
    }
    
    const inputValue = this.multimeterSettings.inputValue;
    const mode = this.multimeterSettings.mode;
    
    // Add realistic measurement variation (±0.1% + 1 digit)
    const baseAccuracy = inputValue * 0.001;
    const digitAccuracy = 0.001;
    const variation = (Math.random() - 0.5) * 2 * (baseAccuracy + digitAccuracy);
    const measuredValue = inputValue + variation;
    
    let unit, modeDescription;
    
    switch (mode) {
      case 'voltage':
        unit = 'V';
        modeDescription = 'DC voltage';
        break;
      case 'current':
        unit = 'A';
        modeDescription = 'DC current';
        break;
      case 'resistance':
        unit = 'Ω';
        modeDescription = 'resistance';
        break;
      case 'capacitance':
        unit = 'F';
        modeDescription = 'capacitance';
        break;
      case 'frequency':
        unit = 'Hz';
        modeDescription = 'frequency';
        break;
      default:
        unit = 'V';
        modeDescription = 'voltage';
    }
    
    this.updateMultimeterDisplay(measuredValue, unit, mode);
    
    // Enhanced voice feedback
    const formattedValue = Math.abs(measuredValue);
    const readableValue = formattedValue < 0.001 ? 
      `${(formattedValue * 1000).toFixed(1)} milli` :
      formattedValue.toFixed(3);
    
    this.speak(`${modeDescription} measurement: ${readableValue} ${unit === 'V' && formattedValue < 0.001 ? 'millivolts' : (unit === 'A' && formattedValue < 0.001 ? 'milliamps' : this.getUnitDescription(unit))}`);
  }
  
  getUnitDescription(unit) {
    const descriptions = {
      'V': 'volts',
      'A': 'amperes', 
      'Ω': 'ohms',
      'F': 'farads',
      'Hz': 'hertz'
    };
    return descriptions[unit] || unit;
  }
  
  toggleHold() {
    const button = document.getElementById('hold');
    const indicator = document.getElementById('holdIndicator');
    
    this.multimeterHold = !this.multimeterHold;
    
    if (this.multimeterHold) {
      button.textContent = 'RELEASE';
      button.classList.add('stop');
      indicator.classList.add('active');
      this.speak("Measurement hold activated. Display frozen.");
    } else {
      button.textContent = 'HOLD';
      button.classList.remove('stop');
      indicator.classList.remove('active');
      this.speak("Hold released. Ready for new measurements.");
    }
  }
  
  toggleAutoRange() {
    const button = document.getElementById('autoRange');
    const indicator = document.getElementById('autoIndicator');
    
    this.multimeterSettings.autoRange = !this.multimeterSettings.autoRange;
    
    if (this.multimeterSettings.autoRange) {
      button.textContent = 'MANUAL RANGE';
      indicator.classList.add('active');
      this.speak("Auto ranging enabled. Optimal range selected automatically.");
    } else {
      button.textContent = 'AUTO RANGE';
      indicator.classList.remove('active');
      this.speak("Manual ranging enabled. Select range manually.");
    }
    
    // Update display
    this.performMeasurement();
  }
  
  resetMultimeter() {
    this.multimeterHold = false;
    this.multimeterSettings = {
      mode: 'voltage',
      range: 'auto',
      inputValue: 0,
      autoRange: true
    };
    
    // Reset UI
    document.getElementById('inputValue').value = 0;
    document.getElementById('hold').textContent = 'HOLD';
    document.getElementById('hold').classList.remove('stop');
    document.getElementById('autoRange').textContent = 'AUTO RANGE';
    
    // Reset selector dial to voltage position
    const pointer = document.querySelector('.selector-pointer');
    pointer.style.transform = 'translateX(-50%) rotate(-90deg)';
    
    // Reset display
    this.updateMultimeterDisplay(0, 'V', 'voltage');
    this.updateModeIndicators('voltage');
    
    this.speak("Digital multimeter reset to factory defaults. Ready for voltage measurements.");
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProfessionalVirtualLab();
});
