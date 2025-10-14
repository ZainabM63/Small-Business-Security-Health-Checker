
## 👩‍💻 Developer

**Author:** Zainab Mughal

**Focus:** Cybersecurity & Web App Development

---

# 🛡️ Small Business Security Health Checker

## 📖 Overview
The **Small Business Security Health Checker** is a simple yet powerful tool designed to help **small businesses** quickly evaluate their website’s **security posture**.  
It checks for HTTPS, critical security headers, and open ports — then provides a **security score** and a downloadable **JSON report**.

---

## 📁 Folder Structure
```

SECURITY CHECKER MVP/
│
├── backend/
│   ├── server.js                # Main Express server
│   ├── routes/
│   │   └── scanRoutes.js        # API endpoint for security scan
│   └── utils/
│       ├── checkHttps.js        # HTTPS and HSTS validation
│       ├── checkHeaders.js      # Security headers analysis
│       └── scanPorts.js         # TCP port scanning
│
└── frontend/
└── index.html               # Simple web GUI for the tool

````

---

## ⚙️ Installation & Setup

### 1️⃣ Navigate to the backend folder
```bash
cd "SECURITY CHECKER MVP/backend"
````

### 2️⃣ Install dependencies

```bash
npm install express cors axios
```

### 3️⃣ Run the server

```bash
node server.js
```

You should see:

```
Server listening on port 4000
```

### 4️⃣ Open the frontend

Navigate to:

```
SECURITY CHECKER MVP/frontend/index.html
```

Double-click it, or open it using VS Code’s **Live Server** extension.

---

## 🧪 How to Use

1. Enter a domain name (e.g. `example.com`)
2. Click **“Scan”**
3. The tool will perform:

   * 🔒 HTTPS and certificate check
   * 🧱 Security headers check
   * 🚪 Port scanning (21, 22, 25, 80, 443, 3306)
4. View your overall **Security Score**
5. Click **“Download Report”** to save the JSON results

---

## 🌐 API Endpoint

If you want to test directly (for developers or API use):

**POST** request:

```
http://localhost:4000/api/scan
```

**Body (JSON):**

```json
{
  "domain": "example.com"
}
```

---

## 🧠 Example Output

```json
{
  "domain": "example.com",
  "timestamp": "2025-10-14T21:55:05.927Z",
  "https": {
    "https": true,
    "hsts": false,
    "certificateValid": true
  },
  "headers": {
    "checkedHeaders": [
      { "name": "content-security-policy", "present": false },
      { "name": "x-content-type-options", "present": false }
    ]
  },
  "ports": {
    "checkedPorts": [
      { "port": 21, "open": false },
      { "port": 443, "open": true }
    ]
  },
  "score": { "percent": 46 }
}
```

---

## 💡 Features

✅ HTTPS & SSL/TLS validation
✅ HSTS detection
✅ Common security header analysis
✅ Basic port scanning
✅ JSON report download
✅ Simple front-end dashboard

---

## 🧰 Tech Stack

| Component     | Technology                    |
| ------------- | ----------------------------- |
| **Backend**   | Node.js + Express             |
| **Frontend**  | HTML + JavaScript (Fetch API) |
| **Libraries** | axios, net, cors              |

---

## 🚀 Future Plans

* 📄 Export report as **PDF**
* 📊 Add graphical score display (chart or gauge)
* 🔍 Check SSL expiry, DNS, and WHOIS
* 💬 Add improvement tips per issue found




