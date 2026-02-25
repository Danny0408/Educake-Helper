# 📖 Educake Helper PRO - Full Auto Edition
_An automation tool that turns Educake into a "tap-and-go" experience. It types answers and selects multiple-choice buttons for you._

---
<img src="https://github.com/Danny0408/Educake-Helper/blob/main/preview1.png" width="300">
<img src="https://github.com/Danny0408/Educake-Helper/blob/main/preview2.png" width="300">
<img src="https://github.com/Danny0408/Educake-Helper/blob/main/preview3.png" width="300">
---

## 🚀 Features
✔️ **Instant Data Fetching** – Grab every answer in the quiz the millisecond you run the script.  
✔️ **Auto-Type** – Detects text boxes and types the correct answer.  
✔️ **Auto-Select** – Uses `MouseEvent` simulation to automatically find and click the correct multiple-choice buttons.  
✔️ **Smart Observer** – Automatically detects when you move to a new question and triggers the appropriate action.  
✔️ **Neon Stealth UI** – glowing status bar that tells you exactly what to do.  
✔️ **F2 Force Trigger** – A manual override key to force-fill a question if the auto-detection hangs.

---

## 📥 How to Run
### 1️⃣ Open Developer Console
1. Log in to [Educake](https://my.educake.co.uk/) and start your quiz.
2. Open the **Developer Console**:
   - **Windows/Linux:** `F12` or `Ctrl + Shift + i`
   - **Mac:** `Command + Option + J` or `Command + Option + i` for some 
3. **Paste the following loader and press Enter:**
   ```javascript
   fetch("https://raw.githubusercontent.com/Danny0408/Educake-Helper/main/EducakeHelper.js")
   .then(r => r.text())
   .then(eval)
   .catch(e => console.error("Error loading Educake Helper:", e));
   ```
   OR
   ```javascript
     fetch("https://raw.githubusercontent.com/Danny0408/Educake-Helper/main/EducakeHelper.js").then(r=>r.text()).then(eval);
   ```
