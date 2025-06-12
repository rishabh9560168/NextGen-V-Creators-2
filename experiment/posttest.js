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


  const myQuestions  = [
    {
      question: "Which part of the CRO controls the brightness of the trace?",
      answers: {
        a: "Focus knob",
        b: "Time/div knob",
        c: "Intensity knob",
        d: "Trigger level"
      },
      explanations: {
        a: "Focus sharpens the trace, not brightness.",
        b: "Controls time base.",
        c: "Correct. Intensity knob controls brightness.",
        d: "Sets trigger threshold, unrelated to brightness."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "To observe a sine wave using a CRO, which probe connection is appropriate?",
      answers: {
        a: "Channel 2 input",
        b: "XY mode input",
        c: "Channel 1 with ground reference",
        d: "Trigger input"
      },
      explanations: {
        a: "Channel 2 is fine but Channel 1 is typically used for basic signals.",
        b: "XY mode is used for Lissajous patterns.",
        c: "Correct. Channel 1 with proper grounding is standard.",
        d: "Trigger input is not for signal measurement."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "What does the 'Volt/div' control on the CRO adjust?",
      answers: {
        a: "Time per division",
        b: "Signal phase",
        c: "Amplitude scale per division",
        d: "Signal frequency"
      },
      explanations: {
        a: "Controlled by time/div.",
        b: "Not adjustable directly.",
        c: "Correct. Volt/div adjusts vertical scaling.",
        d: "Not directly settable via this knob."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "When the multimeter reads 'OL' in resistance mode, it means:",
      answers: {
        a: "Open Loop – high resistance",
        b: "Overload – too much current",
        c: "Output Low",
        d: "Over Limiting frequency"
      },
      explanations: {
        a: "Correct. 'OL' indicates resistance is too high (open circuit).",
        b: "Not related to resistance mode.",
        c: "Not relevant.",
        d: "Doesn’t apply to resistance measurement."
      },
      correctAnswer: "a",
      difficulty: "beginner"
    },
    {
      question: "What should be done before switching multimeter functions?",
      answers: {
        a: "Keep probes connected to the circuit",
        b: "Switch off the power supply",
        c: "Rotate the dial quickly",
        d: "Disconnect probes from multimeter"
      },
      explanations: {
        a: "Could be dangerous.",
        b: "Correct. It prevents damage to meter.",
        c: "Can cause wear or error.",
        d: "Not necessary if switching properly."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "The trigger function in a CRO is used to:",
      answers: {
        a: "Increase signal amplitude",
        b: "Hold waveform stable on the screen",
        c: "Adjust vertical gain",
        d: "Switch input channels"
      },
      explanations: {
        a: "Amplitude is not controlled by trigger.",
        b: "Correct. Trigger stabilizes repeating waveforms.",
        c: "Handled by volt/div knob.",
        d: "Done via channel selector."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "Which reading range should be selected initially in a multimeter?",
      answers: {
        a: "Lowest range",
        b: "Highest range",
        c: "Exact range",
        d: "Resistance range"
      },
      explanations: {
        a: "Risk of damaging the meter.",
        b: "Correct. Always begin with highest range to prevent overload.",
        c: "Can be selected later.",
        d: "Depends on what is being measured."
      },
      correctAnswer: "b",
      difficulty: "beginner"
    },
    {
      question: "Which type of waveform appears as a straight horizontal line in CRO?",
      answers: {
        a: "DC signal",
        b: "AC sine wave",
        c: "Triangle wave",
        d: "Pulse signal"
      },
      explanations: {
        a: "Correct. A DC voltage shows as a straight line.",
        b: "Shows as wave.",
        c: "Sloped pattern.",
        d: "Shows as spikes."
      },
      correctAnswer: "a",
      difficulty: "beginner"
    },
    {
      question: "Which of the following units is used to express resistance measured by multimeter?",
      answers: {
        a: "Volts",
        b: "Amps",
        c: "Ohms",
        d: "Watts"
      },
      explanations: {
        a: "Used for voltage.",
        b: "Used for current.",
        c: "Correct. Ohm is the unit of resistance.",
        d: "Used for power."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    },
    {
      question: "What does a stable waveform on the CRO screen indicate?",
      answers: {
        a: "No triggering",
        b: "High frequency noise",
        c: "Properly triggered and synchronized signal",
        d: "Overloaded signal"
      },
      explanations: {
        a: "Would result in unstable or moving display.",
        b: "Would appear as fuzz or distortion.",
        c: "Correct. Stable waveform = synchronized trigger.",
        d: "Would show clipping or distortion."
      },
      correctAnswer: "c",
      difficulty: "beginner"
    }
  ];

    ///// To add more questions, copy the section below 
    									                  ///// this line


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
