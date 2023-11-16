document.addEventListener("DOMContentLoaded", function () {
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const questionElement = document.getElementById("question");
    const choicesForm = document.getElementById("choices");
    const scoreValueElement = document.getElementById("score-value");
    const submitButton = document.getElementById("submit-button");

    const themeNameElement = document.getElementById("theme-name");
    const queryParams = new URLSearchParams(window.location.search);
    const selectedTheme = queryParams.get("theme");

    let currentQuestionIndex = 0;
    let score = 0;
    let totalScore = 0;

    themeNameElement.textContent = selectedTheme;
    
    // Correspondance entre les noms de fichier et les titres
    const themeTitles = {
        "questions\\réglementation-t3p.json": "Réglementation T3P",
        "questions\\gestion-entreprise.json": "Gestion entreprise",
        "questions\\sécurité-routière.json": "Sécurité routière",
        "questions\\français.json": "Français",
        "questions\\anglais.json": "Anglais",
        "questions\\développement-commercial-vtc.json": "Développement comercial VTC et gestion spécifique",
        "questions\\réglementation-nationale-vtc.json": "Réglementation nationale VTC"
    };

    if (selectedTheme && themeTitles[selectedTheme]) {
        themeNameElement.textContent = themeTitles[selectedTheme];
    } else {
        console.error("Le thème sélectionné n'a pas été trouvé dans la correspondance des titres.");
    }

    console.log(selectedTheme)
    console.log(themeTitles[selectedTheme])
    console.log(themeTitles["questions\\réglementation-t3p.json"])

    fetch(selectedTheme)
        .then((response) => response.json())
        .then((data) => {
            const questions = data;

            totalScore = questions.reduce((total, question) => total + parseInt(question.bareme), 0);

            function showQuestion(question) {
                questionElement.textContent = question.question;
                choicesForm.innerHTML = "";

                if (question.type === "Choix multiple") {
                    question.choices.forEach((choice, index) => {
                        const choiceDiv = document.createElement("div");
                        choiceDiv.classList.add("choice");
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.id = "choice-" + index;
                        const label = document.createElement("label");
                        label.textContent = choice;
                        label.setAttribute("for", "choice-" + index);
                        choiceDiv.appendChild(checkbox);
                        choiceDiv.appendChild(label);
                        choicesForm.appendChild(choiceDiv);
                    });
                } else if (question.type === "Ouverte") {
                    const answerInput = document.createElement("input");
                    answerInput.setAttribute("type", "text");
                    choicesForm.appendChild(answerInput);
                }
            }




            function checkAnswer(question, selectedChoiceIndices) {
                const selectedChoices = selectedChoiceIndices.map(index => question.choices[index]).sort().join(',');
                const correctAnswers = question.correct_answer.sort().join(',');

                let isCorrect = selectedChoices === correctAnswers;

                if (isCorrect) {
                    score += parseInt(question.bareme);
                    alert("Bonne réponse : " + correctAnswers);
                } else {
                    alert("Mauvaise réponse. Les réponses correctes sont : " + correctAnswers);
                }

                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(questions[currentQuestionIndex]);
                } else {
                    showResult();
                }
                updateScore();
            }

            function updateScore() {
                scoreValueElement.textContent = score + " / " + totalScore;
            }

            function showResult() {
                questionContainer.style.display = "none";
                resultContainer.style.display = "block";
                updateScore();
            }

            submitButton.addEventListener("click", () => {
                const selectedChoiceIndices = Array.from(choicesForm.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(input => parseInt(input.id.split("-")[1]));
                checkAnswer(questions[currentQuestionIndex], selectedChoiceIndices);
            });

            showQuestion(questions[currentQuestionIndex]);
            updateScore();
        })
        .catch((error) => {
            console.error("Erreur lors du chargement du fichier JSON :", error);
        });
});
