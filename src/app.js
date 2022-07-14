import { getQuestions } from "./services/QuestionsService.mjs";

const game = document.querySelector("#game");
const scoreContainer = document.querySelector("#score");
const jeopardyCategories = getQuestions();

/**
 * Renders the board of categories with their cards
 */
const renderCategories = () => {
    scoreContainer.textContent = 0;
    jeopardyCategories.forEach((category) => addCategoryColumn(category, game));
};

/**
 * Renders the given category (object) into the given game board (Element)
 * @param {any} category 
 * @param {Element} game 
 */
const addCategoryColumn = (category, game) => {
    const genreColumn = document.createElement("div");
    genreColumn.className = "genre-column";

    game.append(genreColumn);

    const titleElement = document.createElement("div");
    titleElement.className = "genre-title";
    titleElement.textContent = category.genre;

    genreColumn.append(titleElement);

    category.questions.forEach((questionObject) => addCard(questionObject, genreColumn));
};

/**
 * Adds a question card containing the question object into the given genreColumn (Element)
 * @param {any} questionObject 
 * @param {Element} genreColumn 
 */
const addCard = (questionObject, genreColumn) => {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card";
    cardContainer.setAttribute("data-question", questionObject.question);
    cardContainer.setAttribute("data-state", true);

    genreColumn.append(cardContainer);

    if (questionObject.level === "easy") {
        cardContainer.textContent = 100;
    } else if (questionObject.level === "medium") {
        cardContainer.textContent = 200;
    } else {
        cardContainer.textContent = 300;
    }

    cardContainer.setAttribute("data-value", cardContainer.textContent);

    cardContainer.addEventListener("click", () =>
        replaceWithQuestionAndAnswers(questionObject, cardContainer)
    );
};


/**
 * Card click event handler
 * Replaces the card content with the question and the different options as buttons
 * @param {any} questionObject 
 * @param {Element} cardContainer 
 */
const replaceWithQuestionAndAnswers = (questionObject, cardContainer) => {
    // If a card was already flipped
    if (cardContainer.getAttribute("data-state") === "false") {
        console.log("IS DISABLED");
        return;
    }

    cardContainer.innerHTML = "";
    cardContainer.style.fontSize = "15px";
    cardContainer.style.lineHeight = "30px";

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-display";
    questionContainer.textContent = questionObject.question;

    cardContainer.append(questionContainer);

    questionObject.answers.forEach((answer) => {
        const answerContainer = document.createElement("button");
        answerContainer.className = `answer-btn`;
        answerContainer.textContent = answer;
        answerContainer.addEventListener("click", () =>
            checkResult(answer, questionObject.correct, cardContainer)
        );

        cardContainer.append(answerContainer);
    });

    let notSelectedCards = document.querySelectorAll(".card");
    // Disable all the cards until an answer is selected
    notSelectedCards.forEach((notSelectedCard) =>
        notSelectedCard.setAttribute("data-state", false)
    );
};

/**
 * Event handler for answer option buttons
 * Checks if the answer is the correct answer and replaces the card content respectively
 * @param {string} answer
 * @param {string} correct 
 * @param {Element} cardContainer 
 */
const checkResult = (answer, correct, cardContainer) => {
    let cardScore = parseInt(cardContainer.getAttribute("data-value"));
    if (answer === correct) {
        score += cardScore;
        scoreContainer.textContent = score;
        cardContainer.className = "card-correct";
    } else {
        cardContainer.className = "card-incorrect";
    }
    cardContainer.innerHTML = cardScore;
    cardContainer.style = "";

    let notSelectedCards = document.querySelectorAll(".card");

    // Enable the rest of the cards
    notSelectedCards.forEach((notSelectedCard) => {
        if (
            notSelectedCard.getAttribute("data-question") !==
            cardContainer.getAttribute("data-question")
        ) {
            notSelectedCard.setAttribute("data-state", true);
        }
    });
};

let score = 0;
renderCategories();
