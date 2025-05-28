//Your JavaScript goes in here
class VirtualLab {
  constructor() {
    this.currentTab = 'cro';
    this.croRunning = false;
    this.multimeterHold = false;
    this.animationId = null;
    
    // CRO settings
    this.croSettings = {
      waveform: 'sine',
      frequency: 50,
      amplitude: 5,
      timebase: 10,
      voltdiv: 2
    };
    
    // Initialize
    this.initializeEventListeners();
    this.initializeCRO();
    this.initializeMultimeter();
    this.speak("Welcome to Virtual Lab Simulator");
  }
  
  // Voice synthesis utility
  speak(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  
  initializeEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
    
    // Tap buttons
    document.querySelectorAll('.tap-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const control = e.target.dataset.control;
        const action = e.target.dataset.action;
        this.handleTapButton(control, action);
      });
    });
    
    // CRO controls
    document.getElementById('waveform').addEventListener('change', (e) => {
      this.croSettings.waveform = e.target.value;
      this.speak(`Waveform changed to ${e.target.value}`);
    });
    
    document.getElementById('frequency').addEventListener('input', (e) => {
      this.croSettings.frequency = parseInt(e.target.value);
      document.getElementById('frequencyValue').textContent = `${e.target.value} Hz`;
    });
    
    document.getElementById('amplitude').addEventListener('input', (e) => {
      this.croSettings.amplitude = parseInt(e.target.value);
      document.getElementById('amplitudeValue').textContent = `${e.target.value} V`;
    });
    
    document.getElementById('timebase').addEventListener('input', (e) => {
      this.croSettings.timebase = parseInt(e.target.value);
      document.getElementById('timebaseValue').textContent = `${e.target.value} ms`;
    });
    
    document.getElementById('voltdiv').addEventListener('input', (e) => {
      this.croSettings.voltdiv = parseInt(e.target.value);
      document.getElementById('voltdivValue').textContent = `${e.target.value} V`;
    });
    
    document.getElementById('startStop').addEventListener('click', () => {
      this.toggleCRO();
    });
    
    document.getElementById('croReset').addEventListener('click', () => {
      this.resetCRO();
    });
    
    // Multimeter controls
    document.getElementById('measure').addEventListener('click', () => {
      this.performMeasurement();
    });
    
    document.getElementById('multimeterReset').addEventListener('click', () => {
      this.resetMultimeter();
    });
    
    document.getElementById('hold').addEventListener('click', () => {
      this.toggleHold();
    });
  }
  
  handleTapButton(control, action) {
    const element = document.getElementById(control);
    let currentValue, newValue, min, max, step;
    
    if (control === 'inputValue') {
      // Handle number input for multimeter
      currentValue = parseFloat(element.value) || 0;
      step = 0.1;
      min = -1000;
      max = 1000;
    } else {
      // Handle range inputs for CRO
      currentValue = parseInt(element.value);
      min = parseInt(element.min);
      max = parseInt(element.max);
      step = 1;
      
      // Adjust step size based on control type
      if (control === 'frequency') {
        step = currentValue > 100 ? 10 : 1;
      }
    }
    
    if (action === 'increase') {
      newValue = Math.min(currentValue + step, max);
    } else {
      newValue = Math.max(currentValue - step, min);
    }
    
    // Update the input value
    element.value = newValue;
    
    // Trigger change event to update displays and settings
    const event = new Event('input', { bubbles: true });
    element.dispatchEvent(event);
    
    // Provide audio feedback
    this.speak(`${control} ${action}d to ${newValue}`);
  }
  
  switchTab(tab) {
    // Update tab triggers
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
      trigger.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(tab).classList.add('active');
    
    this.currentTab = tab;
    
    if (tab === 'cro') {
      this.speak("You switched to CRO Simulator");
    } else {
      this.speak("You switched to Multimeter Simulator");
    }
  }
  
  initializeCRO() {
    this.canvas = document.getElementById('croCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.drawGrid();
  }
  
  drawGrid() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    
    // Set grid style
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    this.ctx.lineWidth = 1;
    
    // Draw vertical lines
    const verticalSpacing = width / 20;
    for (let i = 0; i <= 20; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * verticalSpacing, 0);
      this.ctx.lineTo(i * verticalSpacing, height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    const horizontalSpacing = height / 12;
    for (let i = 0; i <= 12; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * horizontalSpacing);
      this.ctx.lineTo(width, i * horizontalSpacing);
      this.ctx.stroke();
    }
    
    // Draw center lines
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
    this.ctx.lineWidth = 2;
    
    // Vertical center line
    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, 0);
    this.ctx.lineTo(width / 2, height);
    this.ctx.stroke();
    
    // Horizontal center line
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
  }
  
  drawWaveform() {
    if (!this.croRunning) return;
    
    const { width, height } = this.canvas;
    const { waveform, frequency, amplitude, timebase, voltdiv } = this.croSettings;
    
    this.drawGrid();
    
    // Set waveform style
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    const timeScale = timebase / 1000; // Convert ms to seconds
    const voltScale = voltdiv;
    const centerY = height / 2;
    const centerX = width / 2;
    
    let prevX = 0;
    let prevY = centerY;
    
    for (let x = 0; x < width; x++) {
      const time = (x - centerX) * timeScale * 0.01;
      let y;
      
      switch (waveform) {
        case 'sine':
          y = centerY - (amplitude * Math.sin(2 * Math.PI * frequency * time + Date.now() * 0.005)) * (height / (voltScale * 8));
          break;
        case 'square':
          y = centerY - (amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * time + Date.now() * 0.005))) * (height / (voltScale * 8));
          break;
        case 'triangle':
          const trianglePhase = (2 * Math.PI * frequency * time + Date.now() * 0.005) % (2 * Math.PI);
          y = centerY - (amplitude * (2 * Math.abs(2 * (trianglePhase / (2 * Math.PI)) - 1) - 1)) * (height / (voltScale * 8));
          break;
        case 'sawtooth':
          const sawtoothPhase = (2 * Math.PI * frequency * time + Date.now() * 0.005) % (2 * Math.PI);
          y = centerY - (amplitude * (2 * (sawtoothPhase / (2 * Math.PI)) - 1)) * (height / (voltScale * 8));
          break;
        default:
          y = centerY;
      }
      
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      prevX = x;
      prevY = y;
    }
    
    this.ctx.stroke();
    
    this.animationId = requestAnimationFrame(() => this.drawWaveform());
  }
  
  toggleCRO() {
    const button = document.getElementById('startStop');
    
    if (this.croRunning) {
      this.croRunning = false;
      button.textContent = 'Start';
      button.classList.remove('stop');
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.speak("CRO stopped");
    } else {
      this.croRunning = true;
      button.textContent = 'Stop';
      button.classList.add('stop');
      this.drawWaveform();
      this.speak("CRO started");
    }
  }
  
  resetCRO() {
    this.croRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Reset controls
    document.getElementById('waveform').value = 'sine';
    document.getElementById('frequency').value = 50;
    document.getElementById('amplitude').value = 5;
    document.getElementById('timebase').value = 10;
    document.getElementById('voltdiv').value = 2;
    
    // Update displays
    document.getElementById('frequencyValue').textContent = '50 Hz';
    document.getElementById('amplitudeValue').textContent = '5 V';
    document.getElementById('timebaseValue').textContent = '10 ms';
    document.getElementById('voltdivValue').textContent = '2 V';
    
    // Reset settings
    this.croSettings = {
      waveform: 'sine',
      frequency: 50,
      amplitude: 5,
      timebase: 10,
      voltdiv: 2
    };
    
    // Reset button
    const button = document.getElementById('startStop');
    button.textContent = 'Start';
    button.classList.remove('stop');
    
    this.drawGrid();
    this.speak("CRO reset to default settings");
  }
  
  initializeMultimeter() {
    this.updateMultimeterDisplay('000.0', 'V');
  }
  
  updateMultimeterDisplay(value, unit) {
    document.getElementById('measurementValue').textContent = value;
    document.getElementById('measurementUnit').textContent = unit;
  }
  
  performMeasurement() {
    if (this.multimeterHold) return;
    
    const measurementType = document.getElementById('measurementType').value;
    const inputValue = parseFloat(document.getElementById('inputValue').value) || 0;
    const range = document.getElementById('range').value;
    
    let displayValue;
    let unit;
    
    // Simulate measurement with some random variation
    const variation = (Math.random() - 0.5) * 0.1;
    const measuredValue = inputValue + variation;
    
    switch (measurementType) {
      case 'voltage':
        displayValue = measuredValue.toFixed(2);
        unit = 'V';
        this.speak(`Voltage measurement: ${displayValue} volts`);
        break;
      case 'current':
        displayValue = (measuredValue / 1000).toFixed(3);
        unit = 'A';
        this.speak(`Current measurement: ${displayValue} amperes`);
        break;
      case 'resistance':
        displayValue = measuredValue.toFixed(1);
        unit = 'Ω';
        this.speak(`Resistance measurement: ${displayValue} ohms`);
        break;
      case 'capacitance':
        displayValue = (measuredValue * 1000).toFixed(1);
        unit = 'μF';
        this.speak(`Capacitance measurement: ${displayValue} microfarads`);
        break;
      default:
        displayValue = '000.0';
        unit = 'V';
    }
    
    this.updateMultimeterDisplay(displayValue, unit);
  }
  
  resetMultimeter() {
    this.multimeterHold = false;
    
    // Reset controls
    document.getElementById('measurementType').value = 'voltage';
    document.getElementById('inputValue').value = 0;
    document.getElementById('range').value = 'auto';
    
    // Reset display
    this.updateMultimeterDisplay('000.0', 'V');
    
    // Reset hold button
    const holdButton = document.getElementById('hold');
    holdButton.textContent = 'Hold';
    holdButton.classList.remove('stop');
    
    this.speak("Multimeter reset to default settings");
  }
  
  toggleHold() {
    const button = document.getElementById('hold');
    
    if (this.multimeterHold) {
      this.multimeterHold = false;
      button.textContent = 'Hold';
      button.classList.remove('stop');
      this.speak("Hold released");
    } else {
      this.multimeterHold = true;
      button.textContent = 'Release';
      button.classList.add('stop');
      this.speak("Measurement on hold");
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VirtualLab();
});

