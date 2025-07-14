# 🌩️ CloudVault

CloudVault is a full-stack cloud-based file manager that lets users upload, view, and delete files seamlessly using a modern UI and AWS S3 storage. Built with **Next.js**, **Express**, and **AWS SDK**, it brings together frontend polish and backend functionality in one deployable app.

---

## 🚀 Features

- 📤 Upload files to AWS S3
- 📜 List all uploaded files
- 🗑️ Delete files directly from the UI
- ⚡ Smooth animations with Framer Motion
- 🔐 Secure environment using AWS IAM credentials
- 🎯 Intuitive and responsive design with custom styling

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Framer Motion
- **Backend**: Node.js, Express, AWS SDK, Multer
- **Cloud**: Amazon S3 (bucket-based file storage)

---

## 🧪 How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cloudvault.git
cd cloudvault
```

### 2. Setup Backend

```bash
cd backend
npm install
```

- **Create a `.env` file in the backend folder and add the following:**

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region         # e.g., eu-north-1
AWS_BUCKET_NAME=your_bucket_name
```

- **Start the backend server:**

```bash
nodemon server.js
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📂 Folder Structure

```
cloudvault/
├── backend/
│   ├── server.js
│   ├── .env
│   └── uploads/
├── frontend/
│   └── (Next.js app)
├── README.md
```

---

## 🎓 Learning Outcomes

- ✅ Integrating AWS S3 with a web application
- ✅ Handling file uploads with Multer
- ✅ Structuring full-stack apps using Next.js and Express
- ✅ Creating responsive UI with animations
- ✅ Environment configuration with `.env` files
