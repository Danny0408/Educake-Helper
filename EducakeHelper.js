(async function() {
    const authToken = sessionStorage.getItem("token");
    const getXsrfToken = () => document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
    const xsrfToken = decodeURIComponent(getXsrfToken());
    const quizId = window.location.pathname.match(/quiz\/(\d+)/)?.[1];

    if (!authToken || !quizId) return;

    // Fetch all answers instantly
    const quizResponse = await fetch(`https://my.educake.co.uk/api/student/quiz/${quizId}`, {
        headers: { "Authorization": `Bearer ${authToken}`, "X-XSRF-TOKEN": xsrfToken, "Accept": "application/json;version=2" }
    });
    const quizData = await quizResponse.json();
    const qIds = quizData.attempt[quizId]?.questions;

    const allAnswers = await Promise.all(qIds.map(async (id, i) => {
        try {
            const res = await fetch(`https://my.educake.co.uk/api/course/question/${id}/mark`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${authToken}`, "X-XSRF-TOKEN": xsrfToken, "Content-Type": "application/json", "Accept": "application/json;version=2" },
                body: JSON.stringify({ givenAnswer: "1" })
            });
            const data = await res.json();
            return { num: i + 1, text: data.answer?.correctAnswers[0] || "" };
        } catch (e) { return { num: i + 1, text: "" }; }
    }));

    const status = document.createElement("div");
    Object.assign(status.style, {
        position: "fixed", bottom: "10px", left: "10px", padding: "8px 15px",
        background: "rgba(0,0,0,0.9)", color: "#00ff00", borderRadius: "10px",
        zIndex: "99999", border: "1px solid #00ff00", fontFamily: "monospace", fontSize: "12px",
        boxShadow: "0 0 10px #00ff00"
    });
    document.body.appendChild(status);

    let lastQuestion = 0;

    const fillLogic = () => {
        const uiMatch = document.body.innerText.match(/Question (\d+) of/i);
        const currentNum = uiMatch ? parseInt(uiMatch[1]) : null;
        
        if (!currentNum || currentNum === lastQuestion) return;
        
        const answerData = allAnswers.find(a => a.num === currentNum);
        if (!answerData || !answerData.text) return;

        lastQuestion = currentNum;
        const targetAnswer = answerData.text.trim().toLowerCase();

        // 1. AUTO-TYPE LOGIC
        const input = document.querySelector("input[type='text'], input[type='search'], input[name='answer'], textarea");
        if (input) {
            input.focus();
            input.value = "";
            let i = 0;
            const typer = setInterval(() => {
                if (i < answerData.text.length) {
                    input.value += answerData.text[i];
                    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
                    i++;
                } else {
                    clearInterval(typer);
                    status.innerText = `Q${currentNum}: Typed. Press Enter x2`;
                }
            }, 30);
        }

        // 2. AUTO-BUTTON LOGIC
        const buttons = document.querySelectorAll("button, [role='button'], .btn, .answer-option, li[data-answer]");
        buttons.forEach(btn => {
            const btnText = btn.innerText.trim().toLowerCase();
            
            if (btnText === targetAnswer || btnText.includes(targetAnswer)) {
                // Visual Highlight
                btn.style.outline = "8px solid #00ff00";
                btn.style.backgroundColor = "#003300";

                // Forceful Click Sequence
                const opts = { bubbles: true, cancelable: true, view: window };
                btn.dispatchEvent(new MouseEvent("mousedown", opts));
                btn.dispatchEvent(new MouseEvent("mouseup", opts));
                btn.dispatchEvent(new MouseEvent("click", opts));
                
                status.innerText = `Q${currentNum}: Auto-Clicked! Press Enter`;
            }
        });
    };

    setInterval(fillLogic, 600);

    window.addEventListener("keydown", (e) => {
        if (e.key === "F2") { lastQuestion = -1; fillLogic(); }
    });

    status.innerText = "FULL AUTO ACTIVE - F2 TO FORCE";
})();
