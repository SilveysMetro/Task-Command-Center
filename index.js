import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// YOUR MAKE WEBHOOK URL
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/10q6oeif131vxna5nvenrhl3chdkcngp";

// Simple health check
app.get("/", (req, res) => {
  res.send("Silveys Gateway is online.");
});

// Main endpoint V will call
app.post("/task", async (req, res) => {
  try {
    const payload = req.body;

    // Basic safety check
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }

    // Forward to Make webhook
    const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!makeResponse.ok) {
      console.error("Make Webhook Error:", await makeResponse.text());
      return res.status(500).json({ error: "Failed to forward to Make" });
    }

    // Confirm to V that everything worked
    res.status(200).json({
      status: "success",
      message: "Task forwarded to Make.",
    });

  } catch (err) {
    console.error("GATEWAY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Railway uses PORT env var
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Silveys Gateway running on port ${PORT}`)
);
