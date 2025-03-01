import express from "express";
import axios from "axios";
import { pool } from "../../config/config.js";

const router = express.Router();

const getToken = async () => {
    try {
        const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64");
        const { data } = await axios.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            { headers: { Authorization: `Basic ${auth}` } }
        );
        return data.access_token;
    } catch (error) {
        throw new Error("Failed to get Safaricom token");
    }
};

const getNgrokUrlFromDB = async () => {
    try {
        const [result] = await pool.query("SELECT url FROM ngrok_urls ORDER BY created_at DESC LIMIT 1");
        return result.length ? result[0].url : null;
    } catch (error) {
        throw new Error("Failed to fetch Ngrok URL");
    }
};

router.post("/send-money", async (req, res) => {
    try {
        const { user_id, phone, amount } = req.body;

        if (!user_id || !phone || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const token = await getToken();
        const ngrokUrl = await getNgrokUrlFromDB();
        console.log(ngrokUrl)

        if (!ngrokUrl) return res.status(500).json({ error: "Ngrok URL is not available" });

        const { data: mpesaResponse } = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
            {
                InitiatorName: process.env.INITIATOR_NAME,
                SecurityCredential: process.env.SECURITY_CREDENTIAL,
                CommandID: "BusinessPayment",
                Amount: amount,
                PartyA: process.env.SHORTCODE,
                PartyB: phone,
                Remarks: "Payment to Customer",
                QueueTimeOutURL: `${ngrokUrl}/send-money`,
                ResultURL: `${ngrokUrl}/send-money`,
                Occasion: "Agrics Payout"
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("M-Pesa API Response:", mpesaResponse);
        const transactionID = mpesaResponse.ConversationID;

        await pool.query(
            "INSERT INTO agrics_payments (user_id, amount, mpesa_receipt_number, mpesa_transaction_id, mpesa_phone_number, is_paid, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, amount, transactionID, transactionID, phone, false, new Date()]
        );

        const result = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ResultType: 0,
                    ResultCode: 0,
                    ResultDesc: "The service request is processed successfully.",
                    TransactionID: "LKXXXX1234",
                    Amount: amount
                });
            }, 3000);
        });

        console.log("M-Pesa Transaction Completed:", result);

        const isPaid = result.ResultCode === 0;

        await pool.query(
            "UPDATE agrics_payments SET is_paid = ?, paid_at = ? WHERE mpesa_transaction_id = ? AND user_id = ?",
            [isPaid, new Date(), transactionID, user_id]
        );

        return res.json({ success: true, mpesaResponse, result });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: error.message || "Internal Server Error" });

    }
});

//
// curl -X POST http://localhost:5000/api/send-money      -H "Content-Type: application/json"      -d '{
//     "user_id": 1,
//     "phone": "254708374149",
//     "amount": 100
// }'


export default router;