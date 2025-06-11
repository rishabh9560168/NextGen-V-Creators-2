/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////






/////////////// Write the MCQ below in the exactly same described format ///////////////


  const myQuestions =  [
    {
      question: "What is the full form of CRO?",
      answers: {
        a: "Cathode Ray Oscillator",
        b: "Cathode Ray Oscilloscope",
        c: "Current Resistance Oscillator",
        d: "Cathode Resistance Oscilloscope"
      },
      explanations: {
        a: "Incorrect full form.",
        b: "Correct. CRO stands for Cathode Ray Oscilloscope.",
        c: "Not a valid expansion.",
        d: "Not the correct term."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "Which device is used to measure voltage, current, and resistance?",
      answers: {
        a: "Oscilloscope",
        b: "Voltmeter",
        c: "Multimeter",
        d: "Ammeter"
      },
      explanations: {
        a: "CRO is mainly used to visualize signals.",
        b: "Only measures voltage.",
        c: "Correct. A multimeter measures voltage, current, and resistance.",
        d: "Only measures current."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "Which component of a CRO deflects the electron beam vertically?",
      answers: {
        a: "Horizontal deflection plates",
        b: "Vertical deflection plates",
        c: "Time base circuit",
        d: "Control grid"
      },
      explanations: {
        a: "These deflect horizontally.",
        b: "Correct. Vertical plates control vertical motion.",
        c: "Controls timing, not beam direction.",
        d: "Controls beam intensity."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "In a CRO, what is displayed on the X-axis?",
      answers: {
        a: "Voltage",
        b: "Frequency",
        c: "Time",
        d: "Current"
      },
      explanations: {
        a: "Voltage is typically on the Y-axis.",
        b: "Frequency is not directly shown.",
        c: "Correct. Time is on the horizontal axis.",
        d: "Not a direct axis parameter."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "Which of the following is NOT a function of a multimeter?",
      answers: {
        a: "Measuring resistance",
        b: "Generating a waveform",
        c: "Measuring DC voltage",
        d: "Measuring AC current"
      },
      explanations: {
        a: "Multimeters measure resistance.",
        b: "Correct. Waveforms are generated by function generators or CROs.",
        c: "Multimeters can measure DC voltage.",
        d: "Many digital multimeters measure AC current."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "What is the typical input resistance of a CRO?",
      answers: {
        a: "10 Ohms",
        b: "1 MΩ",
        c: "1 kΩ",
        d: "100 Ohms"
      },
      explanations: {
        a: "Too low for input resistance.",
        b: "Correct. CRO input impedance is usually about 1 megaohm.",
        c: "Too low for accurate signal capture.",
        d: "Also too low."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "What is the function of the 'time/div' knob on a CRO?",
      answers: {
        a: "Controls vertical gain",
        b: "Sets signal frequency",
        c: "Adjusts time scale of waveform",
        d: "Changes beam intensity"
      },
      explanations: {
        a: "That's the 'volt/div' knob.",
        b: "Frequency is not set by CRO.",
        c: "Correct. It sets the time scale for waveform display.",
        d: "Different control."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "Which mode in a multimeter is used to test continuity?",
      answers: {
        a: "Voltage mode",
        b: "Resistance mode",
        c: "Continuity mode",
        d: "Current mode"
      },
      explanations: {
        a: "Used to measure voltage, not continuity.",
        b: "Measures resistance, but continuity is different.",
        c: "Correct. Most multimeters have a dedicated continuity mode.",
        d: "Measures current."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "Which of the following is displayed on the Y-axis of a CRO screen?",
      answers: {
        a: "Time",
        b: "Voltage",
        c: "Resistance",
        d: "Frequency"
      },
      explanations: {
        a: "Time is displayed on the X-axis.",
        b: "Correct. Voltage is displayed on the Y-axis.",
        c: "Resistance is not displayed.",
        d: "Not a direct CRO output."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "To measure AC voltage in a multimeter, you should select:",
      answers: {
        a: "DCV range",
        b: "ACV range",
        c: "Ohm range",
        d: "Diode mode"
      },
      explanations: {
        a: "DCV measures DC voltage.",
        b: "Correct. ACV range is for AC voltages.",
        c: "Used for resistance.",
        d: "Used to test diodes."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    
  ]
};


    /* To add more MCQ's, copy the below section, starting from open curly braces ( { )
        till closing curly braces comma ( }, )

        and paste it below the curly braces comma ( below correct answer }, ) of above 
        question

    Copy below section

    {
      question: "This is question n?",
      answers: {
        a: "Option 1",
        b: "Option 2",
        c: "Option 3",
        d: "Option 4"
      },
      correctAnswer: "c"
    },

    Copy above section

    */




  ];




/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////


  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();


/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////
