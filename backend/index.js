import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Express backend is running');
});

// Send email route
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const data = await resend.emails.send({
      from: 'Event System <onboarding@resend.dev>',
      to, 
      subject, 
      html,
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to send email',
      details: err.message,
    });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT}`);
});
