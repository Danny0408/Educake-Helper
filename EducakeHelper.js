(async function() {
    // Get the authorization token from sessionStorage
    let authToken = sessionStorage.getItem("token");

    // Function to get XSRF-TOKEN from cookies
    function getXsrfToken() {
        let match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }
    let xsrfToken = getXsrfToken();

    if (!authToken) {
        alert("Authorization token not found in sessionStorage. Ensure you're logged in.");
        return;
    }

    if (!xsrfToken) {
        alert("XSRF token not found in cookies. Ensure you're logged in.");
        return;
    }

    // Extract Quiz ID from URL
    let match = window.location.pathname.match(/quiz\/(\d+)/);
    if (!match) {
        alert("Make sure you're on the quiz page.");
        return;
    }
    let quizId = match[1];

    console.log("Quiz ID:", quizId);
    console.log("Using Auth Token:", authToken);
    console.log("Using XSRF Token:", xsrfToken);

    // Create answer box with loading message
    createAnswerBox("Fetching answers, please wait...");

    try {
        // Fetch quiz data
        let quizResponse = await fetch(`https://my.educake.co.uk/api/student/quiz/${quizId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2',
                'Authorization': `Bearer ${authToken}`,
                'X-XSRF-TOKEN': xsrfToken
            }
        });

        if (!quizResponse.ok) throw new Error("Failed to fetch quiz data.");

        let quizData = await quizResponse.json();

        // Extract question IDs
        let questionIds = quizData.attempt[quizId]?.questions;
        if (!questionIds || questionIds.length === 0) {
            updateAnswerBox("No questions found in the quiz.");
            return;
        }

        console.log(`Found ${questionIds.length} questions.`);

        let answers = [];

        // Fetch correct answers for each question
        for (let i = 0; i < questionIds.length; i++) {
            let questionId = questionIds[i];
            try {
                let response = await fetch(`https://my.educake.co.uk/api/course/question/${questionId}/mark`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;version=2',
                        'Authorization': `Bearer ${authToken}`,
                        'X-XSRF-TOKEN': xsrfToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "givenAnswer": "1" }) // Dummy answer to get correct answer
                });

                if (!response.ok) {
                    console.warn(`Failed to fetch answer for Question ${i + 1} (ID: ${questionId})`);
                    continue;
                }

                let data = await response.json();

                // Check if response contains the correct answer
                let correctAnswer = data.answer?.correctAnswers?.join(", ");
                if (correctAnswer) {
                    answers.push(`Question ${i + 1}: <b>${correctAnswer}</b>`);
                } else {
                    answers.push(`Question ${i + 1}: No answer found`);
                }

            } catch (error) {
                console.error(`Error fetching answer for Question ${i + 1} (ID: ${questionId}):`, error);
            }
        }

        if (answers.length === 0) {
            updateAnswerBox("No answers were retrieved.");
        } else {
            updateAnswerBox(answers.join("<br><br>"));
        }

    } catch (error) {
        console.error("Error:", error);
        updateAnswerBox("An error occurred while fetching answers.");
    }

    // Function to create the floating answer box
    function createAnswerBox(initialMessage) {
        if (document.getElementById("answerBox")) return;

        let answerBox = document.createElement("div");
        answerBox.id = "answerBox";
        answerBox.style.position = "fixed";
        answerBox.style.bottom = "20px";
        answerBox.style.right = "20px";
        answerBox.style.width = "350px";
        answerBox.style.maxHeight = "400px";
        answerBox.style.overflowY = "auto";
        answerBox.style.padding = "15px";
        answerBox.style.background = "rgba(0, 0, 0, 0.9)";
        answerBox.style.color = "#fff";
        answerBox.style.borderRadius = "10px";
        answerBox.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.5)";
        answerBox.style.fontFamily = "Arial, sans-serif";
        answerBox.style.fontSize = "14px";
        answerBox.style.zIndex = "9999";
        answerBox.style.display = "none"; // Hidden by default

        let answerContent = document.createElement("div");
        answerContent.id = "answerContent";
        answerContent.innerHTML = initialMessage;

        let closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.marginTop = "10px";
        closeButton.style.padding = "5px 10px";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "5px";
        closeButton.style.background = "#ff3333";
        closeButton.style.color = "#fff";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function() {
            answerBox.style.display = "none";
        };

        answerBox.appendChild(answerContent);
        answerBox.appendChild(closeButton);
        document.body.appendChild(answerBox);

        let toggleButton = document.createElement("button");
        toggleButton.innerText = "Show Answers";
        toggleButton.id = "toggleButton";
        toggleButton.style.position = "fixed";
        toggleButton.style.bottom = "20px";
        toggleButton.style.left = "20px";
        toggleButton.style.padding = "10px";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "5px";
        toggleButton.style.background = "#00ff00";
        toggleButton.style.color = "#000";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.zIndex = "9999";
        toggleButton.onclick = function() {
            let box = document.getElementById("answerBox");
            if (box.style.display === "none") {
                box.style.display = "block";
                toggleButton.innerText = "Hide Answers";
            } else {
                box.style.display = "none";
                toggleButton.innerText = "Show Answers";
            }
        };

        document.body.appendChild(toggleButton);
    }

    // Function to update the answer box content
    function updateAnswerBox(content) {
        let answerContent = document.getElementById("answerContent");
        if (answerContent) {
            answerContent.innerHTML = content;
        }
    }
})();
