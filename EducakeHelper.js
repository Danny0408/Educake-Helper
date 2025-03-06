(async function() {
    window.currentInput = null;
    document.addEventListener("focusin", (e) => {
        if (e.target.matches("input[type='text'], input[type='search'], input[name='answer'], textarea")) {
            window.currentInput = e.target;
        }
    }, true);

    const loadingBox = document.createElement("div");
    Object.assign(loadingBox.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 15px",
        background: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)"
    });
    loadingBox.innerText = "Loading answers, please wait...";
    document.body.appendChild(loadingBox);

    const authToken = sessionStorage.getItem("token");
    if (!authToken) {
        loadingBox.innerText = "Auth token not found. Make sure you're logged in.";
        return;
    }

    function getXsrfToken() {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }
    const xsrfToken = getXsrfToken();
    if (!xsrfToken) {
        loadingBox.innerText = "XSRF token not found. Make sure you're logged in.";
        return;
    }

    const quizMatch = window.location.pathname.match(/quiz\/(\d+)/);
    if (!quizMatch) {
        loadingBox.innerText = "No quiz ID found. Make sure you're on a quiz page.";
        return;
    }
    const quizId = quizMatch[1];

    let quizData;
    try {
        const quizResponse = await fetch(`https://my.educake.co.uk/api/student/quiz/${quizId}`, {
            method: "GET",
            headers: {
                Accept: "application/json;version=2",
                Authorization: `Bearer ${authToken}`,
                "X-XSRF-TOKEN": xsrfToken
            }
        });
        if (!quizResponse.ok) throw new Error("Failed to fetch quiz data.");
        quizData = await quizResponse.json();
    } catch (error) {
        loadingBox.innerText = "Error loading quiz data. Check console.";
        console.error(error);
        return;
    }

    const questionIds = quizData.attempt[quizId]?.questions;
    if (!questionIds || questionIds.length === 0) {
        loadingBox.innerText = "No questions found in this quiz.";
        return;
    }

    const allAnswers = [];
    for (let i = 0; i < questionIds.length; i++) {
        const questionId = questionIds[i];
        try {
            const response = await fetch(`https://my.educake.co.uk/api/course/question/${questionId}/mark`, {
                method: "POST",
                headers: {
                    Accept: "application/json;version=2",
                    Authorization: `Bearer ${authToken}`,
                    "X-XSRF-TOKEN": xsrfToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ givenAnswer: "1" })
            });
            if (!response.ok) continue;
            const data = await response.json();
            const correctAnswers = data.answer?.correctAnswers;
            if (correctAnswers && correctAnswers.length > 0) {
                allAnswers.push({
                    questionNumber: i + 1,
                    correctAnswers
                });
            }
        } catch (error) {
            console.error(`Error fetching answer for Question ${i + 1}:`, error);
        }
    }

    if (allAnswers.length === 0) {
        loadingBox.innerText = "No answers were retrieved.";
        return;
    }

    loadingBox.remove();
    createUI(allAnswers);

    function createUI(allAnswers) {
        const answerBox = document.createElement("div");
        Object.assign(answerBox.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "15px",
            background: "rgba(0, 0, 0, 0.9)",
            color: "#fff",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            zIndex: 9999,
            display: "none"
        });
        answerBox.id = "answerBox";

        const answerContent = document.createElement("div");

        const heading = document.createElement("h2");
        heading.innerText = "Educake Answers";
        heading.style.marginTop = "0";
        heading.style.fontSize = "16px";
        heading.style.borderBottom = "1px solid #666";
        heading.style.paddingBottom = "5px";
        heading.style.textAlign = "center";
        heading.style.marginBottom = "10px";
        answerContent.appendChild(heading);

        allAnswers.forEach(({ questionNumber, correctAnswers }) => {
            const questionDiv = document.createElement("div");
            questionDiv.style.marginBottom = "15px";

            const qTitle = document.createElement("div");
            qTitle.style.fontWeight = "bold";
            qTitle.innerText = `Question ${questionNumber}:`;
            questionDiv.appendChild(qTitle);

            correctAnswers.forEach((singleAnswer) => {
                const ansLine = document.createElement("div");
                ansLine.style.marginLeft = "8px";
                ansLine.style.marginBottom = "6px";
                ansLine.innerHTML = `\u2022 ${singleAnswer}`;

                const answerBtn = document.createElement("button");
                answerBtn.innerText = "Auto-Answer";
                Object.assign(answerBtn.style, {
                    marginLeft: "10px",
                    padding: "4px 6px",
                    border: "none",
                    borderRadius: "4px",
                    background: "#4aff4a",
                    color: "#000",
                    cursor: "pointer"
                });
                answerBtn.onmousedown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                };
                answerBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    autoAnswer(singleAnswer);
                };

                ansLine.appendChild(answerBtn);
                questionDiv.appendChild(ansLine);
            });

            answerContent.appendChild(questionDiv);
        });

        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        Object.assign(closeButton.style, {
            marginTop: "10px",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            background: "#ff3333",
            color: "#fff",
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
        });
        closeButton.onclick = () => {
            answerBox.style.display = "none";
        };

        answerBox.appendChild(answerContent);
        answerBox.appendChild(closeButton);
        document.body.appendChild(answerBox);

        const toggleBtn = document.createElement("button");
        toggleBtn.innerText = "Show Answers";
        Object.assign(toggleBtn.style, {
            position: "fixed",
            bottom: "20px",
            left: "20px",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            background: "#00ff00",
            color: "#000",
            cursor: "pointer",
            zIndex: 9999
        });
        toggleBtn.onclick = () => {
            if (answerBox.style.display === "none") {
                answerBox.style.display = "block";
                toggleBtn.innerText = "Hide Answers";
            } else {
                answerBox.style.display = "none";
                toggleBtn.innerText = "Show Answers";
            }
        };

        document.body.appendChild(toggleBtn);
    }

    function autoAnswer(answerText) {
        if (
            window.currentInput &&
            window.currentInput.matches("input[type='text'], input[type='search'], input[name='answer'], textarea")
        ) {
            typeIntoInput(window.currentInput, answerText);
            return;
        }

        const possibleClickables = document.querySelectorAll("button, [role='option'], li.btn, .btn");
        const wantedText = answerText.trim().toLowerCase().replace(/\s+/g, " ");
        let found = false;

        for (let el of possibleClickables) {
            let text = el.textContent
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();
            if (text.includes(wantedText)) {
                el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                found = true;
                break;
            }
        }

        if (!found) {
            alert(`No matching multiple-choice button found for: "${answerText}".`);
        }
    }

    function typeIntoInput(inputElem, text) {
        inputElem.focus();
        let idx = 0;
        function step() {
            if (idx < text.length) {
                const event = new InputEvent("input", { bubbles: true });
                inputElem.value += text[idx];
                inputElem.dispatchEvent(event);
                idx++;
                setTimeout(step, 100);
            }
        }
        step();
    }
})();
