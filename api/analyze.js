export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: 'Method not allowed' });
  }
  const { supplier } = req.body || {};
  if (!supplier) {
    return res.status(400).json({ error: true, message: 'Missing supplier domain' });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `Analyze supplier domain "${supplier}". Return ONLY valid JSON no markdown: {"company_name":"","website":"${supplier}","address":"","domain_age":"","business_category":"","overall_score":5.0,"verdict":"MODERATE RISK","verdict_summary":"","categories":[{"name":"Domain Age Risk","score":5,"explanation":""},{"name":"Fraud Scanner Risk","score":5,"explanation":""},{"name":"Amazon Compliance Risk","score":5,"explanation":""},{"name":"Review Quality Risk","score":5,"explanation":""},{"name":"Transparency Risk","score":5,"explanation":""},{"name":"Brand Authorization Risk","score":5,"explanation":""},{"name":"Physical Presence Risk","score":5,"explanation":""}],"red_flags":[],"due_diligence_steps":[],"conclusion":"","data_sources_note":""}`
        }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: true, message: data?.error?.message || 'Anthropic API error' });
    }
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').replace(/```json|```/g, '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const report = JSON.parse(match[0]);
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            domain: supplier,
            company_name: report.company_name || '',
            overall_score: report.overall_score || 0,
            verdict: report.verdict || '',
            full_report: report
          })
        });
      } catch (e) {}
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message || 'Internal server error' });
  }
}
