import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const { GREENAPI_INSTANCE_ID, GREENAPI_API_TOKEN } = process.env;

// ✅ Print env to confirm
console.log("📦 ENV:", GREENAPI_INSTANCE_ID, GREENAPI_API_TOKEN);

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ Green API WhatsApp bot is running!");
});

// ✅ Webhook to handle incoming messages
app.post("/webhook", async (req, res) => {
  console.log("🔥 Webhook triggered");
  console.log("📩 Payload:", JSON.stringify(req.body, null, 2));

  try {
    const chatId = req.body?.senderData?.chatId;
    const message = req.body?.messageData?.textMessageData?.textMessage;

    console.log("Incoming Message:", message, "From:", chatId); // debug

    if (chatId && message) {
      // 1st message: language options
      await sendMessage(chatId, "Press:\n1 for English\n2 for Urdu");

      // 2nd message: support info
      await sendMessage(chatId, "Wait, our support will contact you shortly.");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in webhook:", err.message);
    res.sendStatus(500);
  }
});

// ✅ Test endpoint (manually hit to check message send)
app.get("/test", async (req, res) => {
  const testChatId = "923351878503@c.us"; // Replace with your WhatsApp number in full international format

  try {
    await sendMessage(testChatId, "✅ Test message from Green API bot.");
    res.send("✅ Test message sent!");
  } catch (err) {
    console.error("❌ Failed to send test:", err.message);
    res.status(500).send("❌ Failed to send test message.");
  }
});

// ✅ Function to send a message via Green API


async function sendMessage(chatId, message) {
  const url = `https://7105.api.greenapi.com/waInstance${GREENAPI_INSTANCE_ID}/sendMessage/${GREENAPI_API_TOKEN}`;
  await axios.post(url, {
    chatId,
    message,
  });
}


// ✅ Start the server
app.listen(3000, () => {
  console.log("✅ Bot is running on http://localhost:3000");
});
