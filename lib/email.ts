function ticketEmailHtml({
  guestName, companions, coupleNames, weddingDateText, venueName, qrDataUri,
}: {
  guestName: string; companions: string[]; coupleNames: string;
  weddingDateText: string; venueName: string; qrDataUri: string;
}) {
  const companionsLine = companions.length
    ? `<p style="margin:0 0 4px;color:#4b5563;font-size:14px;">Accompagné(e) de : ${companions.join(", ")}</p>`
    : "";

  return `
  <div style="background:#FDF8F5;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #fde2ec;">
      <div style="height:6px;background:linear-gradient(to right,#F4A7B9,#e91e8c,#4A90D9);"></div>
      <div style="padding:36px 32px;text-align:center;">
        <p style="margin:0 0 6px;color:#e91e8c;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Billet d'accès</p>
        <h1 style="margin:0 0 12px;color:#1A2B5F;font-size:28px;font-weight:400;">${coupleNames}</h1>
        <p style="margin:0 0 24px;color:#4b5563;font-size:14px;">${weddingDateText} — ${venueName}</p>

        <p style="margin:0 0 4px;color:#1A2B5F;font-size:16px;font-weight:bold;">${guestName}</p>
        ${companionsLine}

        <div style="margin:24px 0;padding:16px;background:#FDF8F5;border-radius:16px;">
          <img src="${qrDataUri}" alt="QR code d'accès" width="220" height="220" style="display:block;margin:0 auto;" />
        </div>

        <p style="margin:0;color:#4b5563;font-size:13px;line-height:1.6;">
          Présentez ce billet (le QR code ci-dessus) à l'entrée le jour J.
          Pensez à le garder accessible sur votre téléphone.
        </p>
      </div>
    </div>
  </div>`;
}

export async function sendTicketEmail({
  to, guestName, companions, qrPngBuffer, coupleNames, weddingDateText, venueName,
}: {
  to: string;
  guestName: string;
  companions: string[];
  qrPngBuffer: Buffer;
  coupleNames: string;
  weddingDateText: string;
  venueName: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("Configuration email manquante : BREVO_API_KEY n'est pas définie.");
  }
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("Configuration email manquante : EMAIL_FROM n'est pas définie.");
  }

  const qrDataUri = `data:image/png;base64,${qrPngBuffer.toString("base64")}`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: from, name: coupleNames },
      to: [{ email: to, name: guestName }],
      subject: `Votre billet d'accès — Mariage ${coupleNames}`,
      htmlContent: ticketEmailHtml({ guestName, companions, coupleNames, weddingDateText, venueName, qrDataUri }),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Échec de l'envoi via Brevo (${res.status}) : ${body}`);
  }

  return res.json();
}
