import { Webhook } from "svix";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Template email per ogni tipo di evento Clerk
function buildEmail(type: string, data: Record<string, string>) {
  switch (type) {
    case "email.created": {
      const {
        to_email_address,
        slug,
        data: emailData,
      } = data as unknown as {
        to_email_address: string;
        slug: string;
        data: Record<string, string>;
      };

      if (slug === "verification_code") {
        return {
          to: to_email_address,
          subject: "Il tuo codice di verifica Vittl",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
              <h2 style="font-size:20px;font-weight:600;color:#111;margin-bottom:8px;">
                Verifica la tua email
              </h2>
              <p style="color:#555;font-size:14px;margin-bottom:24px;">
                Usa il codice qui sotto per completare la registrazione su Vittl.
              </p>
              <div style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111;">
                  ${emailData?.otp_code}
                </span>
              </div>
              <p style="color:#999;font-size:12px;">
                Il codice scade tra 10 minuti. Se non hai richiesto questo codice, ignora questa email.
              </p>
            </div>
          `,
        };
      }

      if (slug === "reset_password_code") {
        return {
          to: to_email_address,
          subject: "Reset password Vittl",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
              <h2 style="font-size:20px;font-weight:600;color:#111;margin-bottom:8px;">
                Reset della password
              </h2>
              <p style="color:#555;font-size:14px;margin-bottom:24px;">
                Usa il codice qui sotto per reimpostare la tua password.
              </p>
              <div style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111;">
                  ${emailData?.otp_code}
                </span>
              </div>
              <p style="color:#999;font-size:12px;">
                Il codice scade tra 10 minuti.
              </p>
            </div>
          `,
        };
      }

      return null; // slug non gestito
    }
    default:
      return null;
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_EMAIL_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();

  let payload: Record<string, unknown>;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    payload = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as Record<string, unknown>;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const email = buildEmail(
    payload.type as string,
    payload.data as Record<string, string>,
  );

  if (!email) {
    return new Response("Event not handled", { status: 200 });
  }

  try {
    await resend.emails.send({
      from: "Vittl <noreply@vittl.it>",
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
  } catch (err) {
    console.error("Resend error:", err);
    return new Response("Email send failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
