/**
 * emailTemplates.js — wrapper HTML con la marca de Stef Nails Academy
 *
 * Cada correo enviado por el sistema (alumno o admin) pasa por wrapTemplate()
 * para tener el mismo look & feel: logo en el header, cuerpo con colores de
 * marca y footer con link al sitio.
 *
 * El HTML está pensado para clientes de email reales — usa tablas + inline
 * styles porque Gmail / Outlook ignoran selectores CSS modernos. No usa <link>,
 * @media queries complejas, ni fuentes externas (caen al system stack).
 */

const BRAND = {
  name:        'Stef Nails Academy',
  primary:     '#ff5a5f',
  dark:        '#383838',
  textMuted:   '#6b7280',
  bg:          '#f8f8fa',
  cardBg:      '#ffffff',
  border:      '#e5e7eb',
  logoUrl:     'https://i.postimg.cc/GpRdG1qP/logo-stefnails.png',
  siteUrl:     'https://www.stefnailsacademy.com',
};

const stripHtml = (s = '') => String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/**
 * Devuelve { html, text } para un correo con marca Stef Nails.
 *
 * @param {object}  opts
 * @param {string}  opts.greeting    - Saludo en una línea (ej: "Hola María,")
 * @param {string}  opts.title       - Título principal del correo
 * @param {string}  opts.bodyHtml    - HTML interno del cuerpo (párrafos, listas, etc.)
 * @param {string} [opts.ctaLabel]   - Texto del botón principal (opcional)
 * @param {string} [opts.ctaUrl]     - URL del botón principal (opcional)
 * @param {string} [opts.footerNote] - Línea extra arriba del footer (opcional, ej. "URL válida por 1h")
 * @returns {{ html: string, text: string }}
 */
export function wrapTemplate({ greeting, title, bodyHtml, ctaLabel, ctaUrl, footerNote }) {
  const safeGreeting = greeting || '';
  const safeFooterNote = footerNote || '';

  const ctaBlock = ctaLabel && ctaUrl
    ? `
      <tr>
        <td style="padding: 12px 32px 24px 32px;">
          <a href="${ctaUrl}" target="_blank"
             style="display:inline-block; background-color:${BRAND.primary}; color:#ffffff;
                    text-decoration:none; font-weight:600; font-size:14px;
                    padding:12px 24px; border-radius:8px;">
            ${ctaLabel}
          </a>
        </td>
      </tr>`
    : '';

  const footerNoteBlock = safeFooterNote
    ? `<p style="margin:0 0 8px 0; font-size:12px; color:${BRAND.textMuted};">${safeFooterNote}</p>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${stripHtml(title)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:${BRAND.bg}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:${BRAND.dark};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background-color:${BRAND.bg}; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
                 style="max-width:600px; width:100%; background-color:${BRAND.cardBg};
                        border:1px solid ${BRAND.border}; border-radius:12px; overflow:hidden;">

            <!-- Header con logo -->
            <tr>
              <td align="center" style="padding:24px 24px 8px 24px; background-color:${BRAND.cardBg};">
                <img src="${BRAND.logoUrl}" alt="${BRAND.name}"
                     style="display:block; height:48px; width:auto; margin:0 auto;">
              </td>
            </tr>

            <!-- Título -->
            <tr>
              <td style="padding:16px 32px 4px 32px;">
                <h1 style="margin:0; font-size:20px; font-weight:600; color:${BRAND.dark}; line-height:1.3;">
                  ${title}
                </h1>
              </td>
            </tr>

            <!-- Saludo -->
            ${safeGreeting ? `
            <tr>
              <td style="padding:8px 32px 0 32px;">
                <p style="margin:0; font-size:15px; color:${BRAND.dark};">${safeGreeting}</p>
              </td>
            </tr>` : ''}

            <!-- Cuerpo -->
            <tr>
              <td style="padding:12px 32px 8px 32px; font-size:14px; line-height:1.55; color:${BRAND.dark};">
                ${bodyHtml}
              </td>
            </tr>

            ${ctaBlock}

            <!-- Divider -->
            <tr>
              <td style="padding:0 32px;">
                <div style="height:1px; background-color:${BRAND.border}; margin:8px 0 16px 0;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:0 32px 28px 32px;">
                ${footerNoteBlock}
                <p style="margin:0 0 6px 0; font-size:12px; color:${BRAND.textMuted};">
                  <a href="${BRAND.siteUrl}" style="color:${BRAND.primary}; text-decoration:none; font-weight:500;">
                    ${BRAND.siteUrl.replace('https://', '')}
                  </a>
                </p>
                <p style="margin:0; font-size:11px; color:${BRAND.textMuted};">
                  Este correo fue enviado por ${BRAND.name}.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  // Versión texto plano (para clientes que no renderizan HTML, anti-spam friendly)
  const text = [
    safeGreeting,
    '',
    title,
    '',
    stripHtml(bodyHtml),
    ctaUrl ? `\n${ctaLabel || 'Ver más'}: ${ctaUrl}` : '',
    safeFooterNote ? `\n${safeFooterNote}` : '',
    `\n— ${BRAND.name}  ·  ${BRAND.siteUrl}`,
  ].filter(Boolean).join('\n');

  return { html, text };
}

export const BRAND_CONFIG = BRAND;
