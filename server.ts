import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("agri_ai.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    subscription_tier TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commodity TEXT NOT NULL,
    price REAL NOT NULL,
    date DATE NOT NULL,
    region TEXT
  );

  CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    image_url TEXT,
    diagnosis TEXT,
    treatment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    tier TEXT,
    status TEXT,
    start_date DATETIME,
    end_date DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed some initial price data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM price_history").get() as { count: number };
if (count.count === 0) {
  const commodities = ["Cà phê", "Hồ tiêu", "Gạo", "Cao su", "Heo hơi", "Sầu riêng"];
  const regions = ["Tây Nguyên", "Miền Đông", "Đồng bằng sông Cửu Long"];
  
  const insert = db.prepare("INSERT INTO price_history (commodity, price, date, region) VALUES (?, ?, ?, ?)");
  
  commodities.forEach(c => {
    let basePrice = 50000 + Math.random() * 100000;
    for (let i = 60; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const price = basePrice + (Math.random() - 0.5) * 5000;
      insert.run(c, price, date.toISOString().split('T')[0], regions[Math.floor(Math.random() * regions.length)]);
      basePrice = price;
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      (req as any).user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)");
      const result = stmt.run(email, hashedPassword, fullName);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, tier: user.subscription_tier }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role, tier: user.subscription_tier } });
  });

  // Prices
  app.get("/api/prices", (req, res) => {
    const { commodity } = req.query;
    const data = db.prepare("SELECT * FROM price_history WHERE commodity = ? ORDER BY date ASC").all(commodity);
    res.json(data);
  });

  // AI Prediction
  app.post("/api/ai/predict-price", authenticateToken, async (req, res) => {
    const { commodity, historicalData } = req.body;
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Dựa trên dữ liệu giá lịch sử sau đây của ${commodity}: ${JSON.stringify(historicalData)}. 
        Hãy dự đoán giá cho 7 ngày, 30 ngày và 90 ngày tới. 
        Trả về kết quả dưới dạng JSON với cấu trúc: 
        { 
          "predictions": [{ "date": "YYYY-MM-DD", "price": number }], 
          "trend": "up|down|stable", 
          "confidence": number (0-1), 
          "recommendation": "string",
          "analysis": "string"
        }`,
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e) {
      res.status(500).json({ error: "AI Prediction failed" });
    }
  });

  // AI Disease Detection
  app.post("/api/ai/detect-disease", authenticateToken, async (req, res) => {
    const { image } = req.body; // base64
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: "Bạn là một chuyên gia bệnh học thực vật. Hãy phân tích hình ảnh này và cho biết: 1. Tên bệnh (nếu có), 2. Nguyên nhân, 3. Cách điều trị chi tiết, 4. Loại thuốc gợi ý. Trả về tiếng Việt." },
            { inlineData: { mimeType: "image/jpeg", data: image.split(',')[1] } }
          ]
        }
      });
      
      const diagnosis = response.text;
      db.prepare("INSERT INTO scan_history (user_id, diagnosis) VALUES (?, ?)").run((req as any).user.id, diagnosis);
      
      res.json({ diagnosis });
    } catch (e) {
      res.status(500).json({ error: "AI Detection failed" });
    }
  });

  // AI Chatbot
  app.post("/api/ai/chat", authenticateToken, async (req, res) => {
    const { message, history } = req.body;
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Bạn là AgriAI Assistant, một chuyên gia nông nghiệp Việt Nam. Hãy tư vấn kỹ thuật canh tác, phòng trừ sâu bệnh và thị trường nông sản một cách chuyên nghiệp, dễ hiểu cho nông dân."
        }
      });

      // Simple history mapping
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (e) {
      res.status(500).json({ error: "AI Chat failed" });
    }
  });

  // Subscriptions
  app.post("/api/subscriptions/upgrade", authenticateToken, (req, res) => {
    const { tier } = req.body;
    db.prepare("UPDATE users SET subscription_tier = ? WHERE id = ?").run(tier, (req as any).user.id);
    res.json({ success: true, tier });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
