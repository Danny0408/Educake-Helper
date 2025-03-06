# **📖 Educake Helper - Bookmarklet**
_A simple JavaScript tool to fetch and display correct answers for your Educake quizzes._

<img src="https://github.com/Danny0408/Educake-Helper/blob/main/Preview.png" width="300">

---

## **🚀 Features**
✔️ **Fetches quiz answers automatically**  
✔️ **Displays answers in a user-friendly, toggleable box**  
✔️ **Works on both mobile and desktop**  
✔️ **No need to install extensions – just a simple bookmarklet!**  

---

## **📥 Installation (Bookmarklet)**  
### **1️⃣ Save the Bookmarklet in Your Browser**
1. Open your web browser (Chrome, Firefox, Edge, etc.).
2. **Bookmark any webpage** (e.g., Google).
3. Open your **Bookmarks Manager**:
   - **Chrome:** Press `Ctrl + Shift + O`
   - **Firefox:** Press `Ctrl + Shift + B`
4. **Edit the bookmark**:
   - Change the **Name** to: `Educake Helper`
   - Replace the **URL** with this JavaScript snippet:
     ```javascript
     javascript:(function(){let s=document.createElement('script');s.src='https://raw.githubusercontent.com/Danny0408/Educake-Helper/refs/heads/main/EducakeHelper.js';document.body.appendChild(s);})(); 
     ```
   - *(Replace `YOUR-USERNAME/YOUR-REPO` with your actual GitHub repository details.)*
5. **Save the bookmark.**

---

## **🛠 How to Use**
1. **Go to an Educake quiz page** *(Make sure you’re logged in to Educake).*  
2. Click the **"Educake Helper"** bookmark you created.  
3. Wait for `"Fetching answers, please wait..."` to appear on the screen.  
4. Click the **"Show Answers"** button to reveal the correct answers!  
5. Click **"Hide Answers"** when you're done.  

💡 _The answers will appear in a floating box in the bottom-right corner._  

---

## **📝 Notes**
- 🛑 **You must be logged in to Educake** for the script to work.  
- 🎯 The script **only works on quiz pages** (not on the dashboard or other areas).  
- 🔒 The script **does not modify or interfere** with Educake’s system – it only **fetches and displays answers.**  

---

## **🛠 Troubleshooting**
| Issue | Solution |
|--------|----------|
| **Bookmarklet doesn't work?** | Make sure you're on an **Educake quiz page** before clicking the bookmark. |
| **Answers don’t appear?** | Reload the page and **try again**. Ensure you are **logged into Educake**. |
| **Nothing happens when I click the bookmark?** | Check the browser console (`F12 → Console`) for errors. |

---

## **💡 FAQ**
### ❓ Does this tool modify my quiz answers?
No, this tool **only displays the correct answers** for reference. It does **not** change your responses or interact with Educake’s servers.

### ❓ Will I get banned for using this?
This script simply fetches answers that are already available on the website. However, **use it responsibly and at your own risk**.

### ❓ Does this work on mobile?
Yes! You can save the bookmarklet in **Chrome Mobile or Safari**, then run it just like on a desktop.

---

## **📜 Disclaimer**
This project is intended for **educational purposes only**.  
By using this tool, you agree to use it **responsibly** and not in ways that violate Educake’s terms of service.  

We are **not responsible** for how you use this tool.

---

## **💻 Contributing**
Want to improve this script? **Pull requests are welcome!**  

### **To contribute:**
1. **Fork this repository** 🍴
2. **Clone your fork** 🔥  
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   ```
3. **Make changes & push** 🚀  
   ```bash
   git add .
   git commit -m "Improved Educake Helper UI"
   git push origin main
   ```
4. **Create a Pull Request** ✅  

---

## **🛠 Author & Credits**
👤 **[Your Name](https://github.com/YOUR-USERNAME)**  
💻 Created with ❤️ for the **Educake Community**  

---

## **⭐ Star This Repo!**
If you found this helpful, consider **starring ⭐ this repo** to support the project!  

📢 **Share this tool with your friends who use Educake!** 🚀
