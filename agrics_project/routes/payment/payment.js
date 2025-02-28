import express from "express";
import axios from "axios";
import ngrok from "ngrok";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

let ngrokUrl = "";

const setupNgrok = async () => {
    ngrokUrl = await ngrok.connect({ proto: "http", addr: process.env.PORT || 3000 });
    console.log(`🔗 Ngrok URL: ${ngrokUrl}`);
};

// Run Ngrok when the app starts
setupNgrok();

const getToken = async () => {
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64");
    const { data } = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: { Authorization: `Basic ${auth}` }
    });
    return data.access_token;
};

router.post("/send-money", async (req, res) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
            {
                InitiatorName: process.env.INITIATOR_NAME,
                SecurityCredential: process.env.SECURITY_CREDENTIAL,
                CommandID: "BusinessPayment",
                Amount: req.body.amount || 100,  // Get amount from request body
                PartyA: process.env.SHORTCODE,
                PartyB: req.body.phone || process.env.TEST_PHONE,  // Get phone from request
                Remarks: "Test Payment",
                QueueTimeOutURL: `${ngrokUrl}/api/mpesa/timeout`,
                ResultURL: `${ngrokUrl}/api/mpesa/result`,
                Occasion: "Test"
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json(error.response?.data || { error: "Request failed" });
    }
});

// Handle Mpesa Result & Timeout Callbacks
router.post("/result", (req, res) => {
    console.log("📩 MPesa Result:", req.body);
    res.status(200).send("Result received");
});

router.post("/timeout", (req, res) => {
    console.log("⏳ MPesa Timeout:", req.body);
    res.status(200).send("Timeout received");
});

export default router;
