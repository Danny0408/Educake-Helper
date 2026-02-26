(async function() {
    const authToken = sessionStorage.getItem("token");
    const getXsrfToken = () => document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
    const xsrfToken = decodeURIComponent(getXsrfToken());
    const quizId = window.location.pathname.match(/quiz\/(\d+)/)?.[1];

    if (!authToken || !quizId) return;

    // Fetch Answers (Pre-load)
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
        zIndex: "99999", border: "1px solid #00ff00", fontFamily: "monospace", fontSize: "12px"
    });
    document.body.appendChild(status);

    let lastQuestion = 0;
    let isProcessing = false;

    // Direct Enter simulation
    const pressEnter = () => {
        ['keydown', 'keyup', 'keypress'].forEach(type => {
            const ev = new KeyboardEvent(type, {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
            });
            document.activeElement.dispatchEvent(ev);
        });
    };

    const fullAutoLogic = async () => {
        if (isProcessing) return; 
        
        const uiMatch = document.body.innerText.match(/Question (\d+) of/i);
        const currentNum = uiMatch ? parseInt(uiMatch[1]) : null;
        
        if (!currentNum || currentNum === lastQuestion) return;
        
        const answerData = allAnswers.find(a => a.num === currentNum);
        if (!answerData || !answerData.text) return;

        isProcessing = true;
        lastQuestion = currentNum;
        status.innerText = `Q${currentNum}: TYPING...`;

        const input = document.querySelector("input[type='text'], input[name='answer'], textarea");
        if (input) {
            input.focus();
            input.value = answerData.text; // Instant input instead of char-by-char for reliability
            input.dispatchEvent(new Event("input", { bubbles: true }));
            
            // Wait for the UI to register the text
            await new Promise(r => setTimeout(r, 400));
            
            // 1. SUBMIT
            status.innerText = `Q${currentNum}: SUBMITTING...`;
            pressEnter(); 
            
            // 2. WAIT FOR FEEDBACK SCREEN
            // This needs to be long enough for the "Correct" message to appear
            await new Promise(r => setTimeout(r, 1000)); 
            
            // 3. NEXT QUESTION
            status.innerText = `Q${currentNum}: NEXT...`;
            pressEnter(); 
            
            // Final breather to allow the next Q to load
            await new Promise(r => setTimeout(r, 500));
        }

        // BUTTONS (Unchanged)
        const buttons = document.querySelectorAll("button, [role='button'], .btn, .answer-option");
        for (let btn of buttons) {
            const btnText = btn.innerText.trim().toLowerCase();
            const target = answerData.text.trim().toLowerCase();

            if (btnText === target || btnText.includes(target)) {
                btn.click(); 
                await new Promise(r => setTimeout(r, 600)); 
                pressEnter(); 
                await new Promise(r => setTimeout(r, 1000)); 
                pressEnter(); 
                break;
            }
        }

        isProcessing = false;
        status.innerText = `READY - Q${currentNum} DONE`;
    };

    setInterval(fullAutoLogic, 1000);
    status.innerText = "FULL AUTO ACTIVE";
})();
