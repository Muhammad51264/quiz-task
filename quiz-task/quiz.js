let startButton = document.querySelector(".btn-start");
let quizContainer = document.querySelector(".quiz-container");
let navigationButtons = document.getElementsByClassName("btn-navigation");
let instructionContainer = document.querySelector(
  ".quiz-instructions-container"
);

const quiz = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Madrid", "Paris"],
    answer: 3, // Index of the correct answer (Paris)
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1, // Index of the correct answer (Mars)
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: 1, // Index of the correct answer (Blue Whale)
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: 1, // Index of the correct answer (Carbon Dioxide)
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: [
      "William Shakespeare",
      "Charles Dickens",
      "Jane Austen",
      "Leo Tolstoy",
    ],
    answer: 0, // Index of the correct answer (William Shakespeare)
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Cu"],
    answer: 0, // Index of the correct answer (Au)
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "South Korea", "Vietnam"],
    answer: 1, // Index of the correct answer (Japan)
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
    answer: 2, // Index of the correct answer (Skin)
  },
  {
    question: "Which gas is responsible for the green color of plants?",
    options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Chlorophyll"],
    answer: 3, // Index of the correct answer (Chlorophyll)
  },
  {
    question: "Who painted the 'Mona Lisa'?",
    options: [
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Vincent van Gogh",
      "Michelangelo",
    ],
    answer: 1, // Index of the correct answer (Leonardo da Vinci)
  },
];

const correctAnswers = quiz.map(
  (question) => (question = question.options[question.answer])
);

let userAnswers = [];


/**
 * Dynamically updates the text content and position of navigation buttons in a quiz application.
 *
 * @param {number} questionIndex - The index of the current question in the quiz.
 * @returns {void}
 */
const changeNavigationButtons = (questionIndex) => {
  const windowWidth = window.innerWidth > 550;
  navigationButtons[0].textContent = windowWidth ? "Previous" : "<";
  navigationButtons[0].style.position = windowWidth ? "static" : "absolute";

  questionIndex === 9
    ? (navigationButtons[1].textContent = windowWidth ? "Finish" : ">>")
    : (navigationButtons[1].textContent = windowWidth ? "Next" : ">");

  navigationButtons[1].style.position = windowWidth ? "static" : "absolute";
};

let popupWindow = document.querySelector(".finish-message-container");

const getMessage = (message, isTwoOptions = true) => `<div class="finish-alert">
${message}
<div>
    <button id="true-button" class="alert-button yes-answer">Ok</button>
    ${
      isTwoOptions
        ? `<button id="false-button" class="alert-button no-answer">No</button>`
        : ""
    }
</div>
</div>`;

/**
 * Displays a validation message in a popup window and executes a callback function when the "OK" button is clicked.
 *
 * @param {string} message - The validation message to display.
 * @param {Function} func - The callback function to execute when the "OK" button is clicked.
 * @returns {void}
 */
function validationBox(message,func) {
  popupWindow.innerHTML = getMessage(message, false);
  popupWindow.style.display = "flex";

  document.getElementById("true-button").addEventListener("click", function () {
    func()
    popupWindow.style.display = "none";
  });
}

/**
 * Displays a confirmation message with "Yes" and "No" options in a popup window and executes a callback function
 * when the "Yes" button is clicked.
 *
 * @param {string} message - The confirmation message to display.
 * @param {Function} func - The callback function to execute when the "Yes" button is clicked.
 * @returns {void}
 */
function confirmBox(message, func) {
  popupWindow.innerHTML = `<div class="finish-alert">
                            ${message}
                            <div>
                                <button id="true-button" class="alert-button yes-answer">Yes</button> <!-- Set Id for both buttons -->
                                <button id="false-button" class="alert-button no-answer">No</button>
                            </div>
                        </div>`;
  popupWindow.style.display = "flex";

  document.getElementById("true-button").addEventListener("click", function () {
    func();
    popupWindow.style.display = "none";
  });

  document
    .getElementById("false-button")
    .addEventListener("click", function () {
      popupWindow.style.display = "none";
    });
}

/**
 * Starts a countdown timer for a quiz with a specified duration and updates the timer display.
 *
 * @returns {void}
 */
let quizTime = 60 * 10; // Quiz duration in seconds

function startTimerProcess() {
  /**
   * Handles the timer countdown and updates the timer display.
   */
  function timer() {
    let timerContainer = document.querySelector(".timer-container");
    
    if (quizTime > 0) {
      quizTime--;
      let min = Math.floor(quizTime / 60);
      let seconds = quizTime % 60;
      let timerMessage = `${min.toString()}:${seconds.toString().padStart(2, "0")}`;
      
      try {
        timerContainer.innerHTML = timerMessage;
      } catch (e) {
        clearInterval(timerInterval);
      }
    } else {
      clearInterval(timerInterval);
      finishQuiz(); // Finish the quiz when the timer reaches zero
    }
  }

  // Start the timer countdown and update it every second (1000 milliseconds).
  const timerInterval = setInterval(timer, 1000);
}


/**
 * Displays the question and options for the specified question index in a quiz.
 *
 * @param {number} questionIndex - The index of the current question in the quiz.
 * @returns {void}
 */
function getQuestion(questionIndex) {
  // Select necessary DOM elements
  let quizInnerContainer = document.querySelector(".quiz-inner-container");
  let questionContainer = document.querySelector(".question");
  let optionsContainer = document.querySelector(".answers");

  // Hide the instruction and start button, and show the quiz inner container
  instructionContainer.style.display = "none";
  startButton.style.display = "none";
  quizInnerContainer.style.display = "block";

  // Handle boundary conditions for previous and next buttons
  if (questionIndex < 0) {
    questionIndex = 0;
  }
  
  if (questionIndex === 10) {
    questionIndex = 9;
    if (userAnswers.length !== 10 || userAnswers.includes(undefined)) {
      // Find the index of the first unanswered question
      let firstUnansweredQuestionIndex = userAnswers.findIndex(
        (element) => element === undefined
      );

      // If no unanswered questions are found, set it to the length of userAnswers
      if (firstUnansweredQuestionIndex === -1) {
        firstUnansweredQuestionIndex = userAnswers.length;
      }

      // Display a validation message and navigate to the first unanswered question
      validationBox("Please answer all the questions.", () => {
        getQuestion(firstUnansweredQuestionIndex);
      });
    } else {
      // Confirm if the user wants to finish the quiz and proceed accordingly
      confirmBox("Are you sure you want to finish this test?", () => {
        // Turn off the warning so the user can leave or reload the page without warnings
        window.onbeforeunload = null;
        finishQuiz();
      });
    }
  }

  // Display the question text
  questionContainer.innerHTML = `Q${questionIndex + 1}: ${
    quiz[questionIndex].question
  }`;

  // Build the options HTML
  let options = "";
  const symbols = ["A", "B", "C", "D"];
  quiz[questionIndex].options.forEach((option, index) => {
    options += `
    <div class="answer-container">
      <input type="radio" name="choice" id=${index} value="${option}" " >
      <label for=${index} class="choice-label">
        <button class="option-button">
          <b>${symbols[index]}:</b>${option}
        </button>
      </label>
    </div>
    `;
  });

  // Build navigation tabs for all questions
  let tabs = "";
  for (let question in quiz) {
    tabs += `<div class="navigation-tab" value="${parseInt(question)}" ${
      parseInt(question) === questionIndex
        ? `style="background-color: rgb(141, 32, 32);color: white;"`
        : ""
    }>
    <button class="option-button">
      ${parseInt(question) + 1}
    </button></div>`;
  }

  // Update the options container with the options and navigation elements
  optionsContainer.innerHTML =
    options +
    `    <div class="line"></div>
      <div class="navigation-container">
          <button class="btn-navigation" id="previous" > &lt; </button>
          <div class="navigation-numbers-container">
            ${tabs}
          </div>
          <button class="btn-navigation" id="next" >&gt;</button>
      </div>`;

  // Add event listeners for navigation by question tabs
  let navigationTab = document.getElementsByClassName("navigation-tab");
  for (let tabIndex in navigationTab) {
    try {
      navigationTab[tabIndex].addEventListener("click", () => {
        getQuestion(parseInt(tabIndex));
      });
    } catch (e) {}
  }

  // Add event listeners for navigation by next and previous buttons
  for (let buttonIndex in navigationButtons) {
    try {
      navigationButtons[buttonIndex].addEventListener("click", () => {
        getQuestion(
          !parseInt(buttonIndex) ? questionIndex - 1 : questionIndex + 1
        );
      });
    } catch (e) {}
  }

  // Save the user's chosen answer to userAnswers when an option is selected
  let optionButtons = document.getElementsByClassName("option-button");
  for (let option of optionButtons) {
    let optionRadioButton = option.parentElement.parentElement.children[0];

    option.addEventListener("click", () => {
      // Find the associated radio button
      let optionRadioButton = option.parentElement.parentElement.querySelector(
        'input[type="radio"]'
      );

      // Check the radio button
      optionRadioButton.checked = true;

      // Save the selected answer to userAnswers
      userAnswers[questionIndex] = optionRadioButton.value;
      console.log(userAnswers);
    });

    optionRadioButton.addEventListener("change", (e) => {
      if (optionRadioButton.checked) {
        userAnswers[questionIndex] = e.target.value;
        console.log(userAnswers);
      }
    });
  }

  // Change the appearance of navigation buttons based on screen size
  const mediaQuery = window.matchMedia("(max-width: 550px)");
  mediaQuery.addEventListener("change", () => {
    changeNavigationButtons(questionIndex);
  });
  quizContainer.addEventListener("load", changeNavigationButtons(questionIndex));

  // Ensure the chosen answer's background color persists even if the user changes the question
  let checkChosenOption = document.getElementsByName("choice");
  checkChosenOption.forEach((option) => {
    if (option.value === userAnswers[questionIndex]) {
      option.checked = true;
    }
  });
}





/**
 * Displays the final results of the quiz, including the user's score and feedback for each question.
 * Provides an option to retake the quiz, resets the quiz state, and handles local storage for score and answers.
 *
 * @returns {void}
 */
function finishQuiz() {
  let score = 0;
  let quizInnerContainer = document.querySelector(".quiz-inner-container");
  let quizFnishContainer = document.querySelector(".finish-quiz-container");

  // Show the finish-quiz-container and hide other elements
  quizFnishContainer.style.display = "block";
  instructionContainer.style.display = "none";
  startButton.style.display = "none";
  quizInnerContainer.style.display = "none";

  // Check in localStorage if the user has already taken this quiz to display it and give them a chance to retake the quiz
  if (!localStorage.getItem("score")) {
    // Calculate the user's score by comparing correctAnswers and userAnswers
    correctAnswers.forEach((answer, index) => {
      if (answer === userAnswers[index]) {
        score++;
      }
    });

    // Save the user's score and answers in local storage to display them again if the user left the quiz
    localStorage.setItem("score", score);
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  } else {
    // Retrieve the score and userAnswers from local storage
    score = localStorage.getItem("score");
    userAnswers = JSON.parse(localStorage.getItem("userAnswers"));
  }

  let feedBack = "";

  // Generate feedback for each question, highlighting correct and user's answers
  quiz.forEach((question, index) => {
    let options = "";
    const symbols = ["A", "B", "C", "D"];
    quiz[index].options.forEach((option, secondIndex) => {
      options += `
    <div class="answer-container">
    <label for=${secondIndex} class="choice-label" style="background-color:${
        option === correctAnswers[index]
          ? "lightgreen;"
          : option === userAnswers[index]
          ? "rgb(141, 32, 32);color: white;"
          : ""
      }"> <b>${symbols[secondIndex]}:</b>${option}</label>
    </div>
    `;
    });

    feedBack += `
    <div class="quiz-container">
      <div class="question-container">
        <div class="question">
          Q${index + 1}: ${question.question}
        </div>
        <div class="answers">
          ${options}
          <div class="line"></div>
        </div>
      </div>
    </div> 
    `;
  });

  // Update the finish-quiz-container with the user's score, retake quiz button, and feedback
  quizFnishContainer.innerHTML += `
    <h1 class="instruction-title" id="start-process">You scored ${score} out of 10</h2>
    <button class="btn-start" id="btn-retake">Retake quiz</button>
    ${feedBack}
  `;

  // Function to retake the quiz, resetting the state and clearing local storage
  function retakeQuiz() {
    confirmBox("Are you sure you want to start?", () => {
      quizFnishContainer.style.display = "none";
      userAnswers = [];
      localStorage.removeItem("score");
      localStorage.removeItem("userAnswers");
      getQuestion(0);
      quizTime = 60 * 10;
      startTimerProcess();
    });
  }

  // Add an event listener to the "Retake quiz" button
  let retakeButton = document.getElementById("btn-retake");
  retakeButton.addEventListener("click", retakeQuiz);
}

/**
 * Initiates the quiz by displaying a confirmation message to start, checking if the user has previously taken the quiz,
 * and either starting a new quiz or resuming a previous one.
 *
 * @returns {void}
 */
function startQuiz() {
  // Display a confirmation box to warn the user about starting the quiz
  confirmBox("Are you sure you want to start?", () => {
    // Check if the user has already taken the quiz before. If so, go to the finish tab and turn off the warning.
    if (localStorage.getItem("score")) {
      window.onbeforeunload = null;
      finishQuiz();
    } else {
      // If the user did not take the quiz before, start a new quiz and initialize the timer
      userAnswers = [];
      getQuestion(0);
      startTimerProcess();
    }

    // Warn the user if they try to leave the quiz before finishing it
    window.onbeforeunload = function (event) {
      return "leave"; // A flag, like a comment
    };
  });
}

// Add an event listener to the "Start" button to begin the quiz
startButton.addEventListener("click", startQuiz);

