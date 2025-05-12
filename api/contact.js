// api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }
  
    const { name, email, subject, message } = req.body;
  
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Missing fields' });
    }
  
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: process.env.MAIL_TO,
          subject: `[PORTFOLIO] ${subject}`,
          html: `
            <h3>New message from ${name}</h3>
            <p><b>Email:</b> ${email}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b><br/>${message}</p>
          `
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Resend Error:', error.message);
      res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
  }