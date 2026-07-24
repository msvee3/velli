import { Resend } from 'resend'

let cachedClient: Resend | null = null
function getClient() {
  if (!cachedClient) cachedClient = new Resend(process.env.RESEND_API_KEY!)
  return cachedClient
}

const FROM = () => process.env.EMAIL_FROM ?? 'hello@velli.app'
const APP_URL = () => process.env.APP_URL ?? 'http://localhost:3000'

function baseTemplate(accent: string, bodyHtml: string) {
  return `
  <div style="background:#0a0810;padding:40px 20px;font-family:Georgia,serif;color:#f0e8ff;">
    <div style="max-width:480px;margin:0 auto;">
      <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${accent};margin-bottom:24px;">
        velli
      </div>
      ${bodyHtml}
      <div style="margin-top:40px;font-size:11px;color:rgba(255,255,255,0.35);">
        Sent by velli — celebration pages for the people you love.
      </div>
    </div>
  </div>`
}

function button(href: string, label: string, accent: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 24px;border-radius:999px;background:${accent}22;border:1px solid ${accent}55;color:${accent};text-decoration:none;font-family:sans-serif;font-size:14px;">${label}</a>`
}

export async function sendConfirmationEmail(opts: {
  to: string
  coupleName: string
  slug: string
  confirmToken: string
}) {
  const confirmUrl = `${APP_URL()}/p/${opts.slug}/confirm?token=${opts.confirmToken}`
  const html = baseTemplate(
    '#c4a0f0',
    `
    <h1 style="font-size:22px;font-weight:400;margin:0 0 12px;">Confirm your notification</h1>
    <p style="font-size:15px;line-height:1.6;color:rgba(240,232,255,0.75);">
      ${escapeHtml(opts.coupleName)} would love to let you know the moment their baby arrives.
      Confirm below to make sure you don't miss it.
    </p>
    ${button(confirmUrl, 'Confirm my email', '#c4a0f0')}
  `
  )
  return send({
    to: opts.to,
    subject: `Confirm your notification for ${opts.coupleName}'s announcement`,
    html,
  })
}

export async function sendRevealEmail(opts: {
  to: string
  coupleName: string
  babyName: string | null
  slug: string
}) {
  const pageUrl = `${APP_URL()}/p/${opts.slug}`
  const subject = opts.babyName ? `${opts.babyName} has arrived! ✦` : 'A baby has arrived! ✦'
  const html = baseTemplate(
    '#f0a030',
    `
    <h1 style="font-size:22px;font-weight:400;margin:0 0 12px;">${subject}</h1>
    <p style="font-size:15px;line-height:1.6;color:rgba(240,232,255,0.75);">
      ${escapeHtml(opts.coupleName)} are overjoyed to share the news. Open the celebration page for the full reveal.
    </p>
    ${button(pageUrl, 'See the reveal', '#f0a030')}
  `
  )
  return send({ to: opts.to, subject, html })
}

export async function sendFeedbackNotification(opts: { name: string; email: string; message: string }) {
  const to = process.env.FEEDBACK_TO_EMAIL
  if (!to) return null
  const html = baseTemplate(
    '#8098e0',
    `
    <h1 style="font-size:20px;font-weight:400;margin:0 0 12px;">New feedback</h1>
    <p style="font-size:14px;color:rgba(240,232,255,0.6);margin:0 0 8px;">From ${escapeHtml(opts.name)} &lt;${escapeHtml(opts.email)}&gt;</p>
    <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(opts.message)}</p>
  `
  )
  return send({ to, subject: `velli feedback from ${opts.name}`, html })
}

async function send(opts: { to: string; subject: string; html: string }) {
  try {
    const { data, error } = await getClient().emails.send({
      from: FROM(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    })
    if (error) return { status: 'failed' as const, resendId: null, error }
    return { status: 'sent' as const, resendId: data?.id ?? null }
  } catch (error) {
    return { status: 'failed' as const, resendId: null, error }
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
