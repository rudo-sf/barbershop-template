export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, service, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Fresh Cuts Contact Form <hello@gosunnysites.com>',
        to: 'gosunnysites@gmail.com',
        subject: `New Booking Request from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a84c;">New Booking Request — Fresh Cuts</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Service</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${service || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Notes</td>
                <td style="padding: 10px;">${message || 'None'}</td>
              </tr>
            </table>
            <p style="color: #888; font-size: 12px; margin-top: 30px;">Sent from Fresh Cuts barbershop website — Built by Go Sunny Go</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}