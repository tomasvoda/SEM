import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { record } = await req.json()
        const { first_name, email } = record

        if (!email) {
            throw new Error('Missing email')
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'EURO 2026 Team <onboarding@resend.dev>',
                to: [email],
                subject: 'Potvrzení registrace dobrovolníka – EURO 2026',
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Potvrzení registrace EURO 2026</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 32px 32px 0 32px;">
               <div style="font-size: 11px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">EUROPEAN KORFBALL CHAMPIONSHIP 2026</div>
               <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">Vítej v týmu, ${first_name}! 👋</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; font-size: 15px; line-height: 1.6; color: #334155;">
              <p style="margin: 0 0 16px 0;">Díky moc, že ses přihlásil/a jako dobrovolník.</p>
              
              <div style="padding: 16px; background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; font-weight: 500; color: #0f172a;">✅ Tvoji registraci máme uloženou.</p>
              </div>

              <p style="margin: 0 0 16px 0;">Teď už je (skoro) všechno na nás. Postupně zpracováváme přihlášky a ladíme organizační detaily. Jakmile se turnaj přiblíží, ozveme se ti s konkrétními informacemi o tvé roli, časech a všem ostatním.</p>

              <p style="margin: 0;">Kdyby tě mezitím cokoliv napadlo, jsme tu pro tebe.</p>
            </td>
          </tr>

          <!-- Signature / Footer -->
          <tr>
            <td style="padding: 0 32px 32px 32px; border-top: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #0f172a; font-size: 14px;">Tomáš Voda</p>
                    <p style="margin: 0 0 16px 0; color: #64748b; font-size: 13px;">Za organizační výbor EURO 2026</p>
                    
                    <div style="font-size: 13px; color: #64748b;">
                      <a href="mailto:tomas.voda@korfbal.cz" style="color: #3b82f6; text-decoration: none; font-weight: 500;">tomas.voda@korfbal.cz</a>
                      <span style="color: #cbd5e1; margin: 0 8px;">|</span>
                      <span style="color: #64748b;">+420 702 202 389</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
        <!-- Bottom Note -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center" style="font-size: 12px; color: #94a3b8;">
              <p style="margin: 0;">© 2026 Czech Korfball Association</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
            }),
        })

        const data = await res.json()
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
