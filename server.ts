import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up json parsing
app.use(express.json());

const ENQUIRIES_FILEStr = path.join(process.cwd(), "enquiries.json");

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  shoeType: string;
  brand?: string;
  size?: string;
  message?: string;
  timestamp: string;
  status: "new" | "contacted" | "completed";
}

function getEnquiries(): Enquiry[] {
  try {
    if (fs.existsSync(ENQUIRIES_FILEStr)) {
      const data = fs.readFileSync(ENQUIRIES_FILEStr, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading enquiries file:", error);
  }
  return [];
}

function saveEnquiries(enquiries: Enquiry[]) {
  try {
    fs.writeFileSync(ENQUIRIES_FILEStr, JSON.stringify(enquiries, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing enquiries file:", error);
  }
}

// API Routes

// Submit an enquiry
app.post("/api/enquire", async (req, res) => {
  try {
    const { name, phone, shoeType, brand, size, message, customWebhookUrl } = req.body;

    if (!name || !phone || !shoeType) {
      return res.status(400).json({ error: "Name, phone number, and shoe type are required fields." });
    }

    const newEnquiry: Enquiry = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      phone,
      shoeType,
      brand: brand || "",
      size: size || "",
      message: message || "",
      timestamp: new Date().toISOString(),
      status: "new"
    };

    const currentEnquiries = getEnquiries();
    currentEnquiries.unshift(newEnquiry); // Add to the top
    saveEnquiries(currentEnquiries);

    // Forward to n8n webhook if available
    const webhookUrl = process.env.N8N_WEBHOOK_URL || customWebhookUrl;
    let webhookStatusStr = "not_configured";

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "new_enquiry",
            data: newEnquiry,
            metadata: {
              source: "Mehta Boot House Website",
              timestamp: new Date().toISOString()
            }
          })
        });
        
        if (response.ok) {
          webhookStatusStr = "success";
        } else {
          webhookStatusStr = `failed_with_${response.status}`;
          console.error(`n8n webhook returned status ${response.status}`);
        }
      } catch (err: any) {
        webhookStatusStr = `error_${err.message || "unknown"}`;
        console.error("Failed to post to n8n webhook:", err);
      }
    }

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      enquiry: newEnquiry,
      webhookStatus: webhookStatusStr
    });
  } catch (error: any) {
    console.error("Enquiry submission system error:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// Get enquiries (requires matching owner pin)
app.get("/api/enquiries", (req, res) => {
  const pin = req.query.pin as string;
  const expectedPin = process.env.OWNER_PIN || "7876";

  if (pin !== expectedPin) {
    return res.status(401).json({ error: "Unauthorized access. Invalid owner PIN." });
  }

  const enquiries = getEnquiries();
  res.json({ success: true, enquiries });
});

// Update enquiry status
app.patch("/api/enquiries/:id", (req, res) => {
  const pin = req.query.pin as string;
  const expectedPin = process.env.OWNER_PIN || "7876";
  const { status } = req.body;

  if (pin !== expectedPin) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { id } = req.params;
  const enquiries = getEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Enquiry not found." });
  }

  enquiries[index].status = status;
  saveEnquiries(enquiries);

  res.json({ success: true, enquiry: enquiries[index] });
});

// Test connection to n8n webhook
app.post("/api/test-webhook", async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "Webhook URL is required." });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "test_connection",
        message: "Hello from Mehta Boot House!",
        timestamp: new Date().toISOString(),
        testData: {
          name: "Test Customer",
          phone: "7876624340",
          shoeType: "Sneakers",
          size: "9",
          message: "This is a test connection from Mehta Boot House n8n integration check."
        }
      })
    });

    if (response.ok) {
      res.json({ success: true, status: response.status, message: "Webhook pinged successfully!" });
    } else {
      res.status(400).json({ 
        success: false, 
        status: response.status, 
        error: `Webhook returned status code ${response.status}. Check your n8n workflows.`
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: `Failed to connect with n8n at URL. Details: ${error.message || "Unknown Network Error"}`
    });
  }
});

// Vite static file serving or HMR integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
