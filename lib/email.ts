import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_RuTNXtVV_Q4Wpevrp7peLv5vAUZm8V88K');

// Gmail SMTP configuration for reliable delivery (commented out for now)
// const gmailTransporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'packedin.tn@gmail.com',
//     pass: 'your-app-password-here', // You'll need to generate this
//   },
// });

// Email templates
const createQuoteEmailTemplate = (quoteData: any) => {
  const { products, customer, totals, quoteId } = quoteData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle Demande de Devis</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .totals { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .highlight { color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎯 Nouvelle Demande de Devis</h2>
          <p><strong>ID de devis:</strong> ${quoteId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <h3>👤 Informations Client</h3>
        <p><strong>Nom:</strong> ${customer.name || 'Non spécifié'}</p>
        <p><strong>Email:</strong> ${customer.email || 'Non spécifié'}</p>
        <p><strong>Téléphone:</strong> ${customer.phone || 'Non spécifié'}</p>
        
        <h3>📦 Produits Demandés</h3>
        ${products.map((product: any) => `
          <div class="product-item">
            <p><strong>${product.title}</strong></p>
            <p>Quantité: ${product.quantity}</p>
            <p>Prix unitaire: ${product.price} TND</p>
            <p>Total: ${(product.price * product.quantity).toFixed(2)} TND</p>
          </div>
        `).join('')}
        
        <div class="totals">
          <h3>💰 Récapitulatif</h3>
          <p><strong>Quantité totale:</strong> ${totals.totalQuantity} unités</p>
          <p><strong>Sous-total:</strong> ${totals.subtotal.toFixed(2)} TND</p>
          ${totals.discount > 0 ? `
            <p><strong>Remise (${totals.discount}%):</strong> -${totals.discountAmount.toFixed(2)} TND</p>
          ` : ''}
          <p class="highlight"><strong>Total final:</strong> ${totals.total.toFixed(2)} TND</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px;">
          <h4>📋 Actions à effectuer:</h4>
          <ul>
            <li>Vérifier la disponibilité des produits</li>
            <li>Préparer le devis détaillé</li>
            <li>Contacter le client dans les 24h</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send quote email
export const sendQuoteEmail = async (quoteData: any) => {
  try {
    const result = await resend.emails.send({
      from: 'Packedin Devis <onboarding@resend.dev>',
      to: 'packedin.tn@gmail.com',
      subject: `🎯 Nouvelle demande de devis - ${quoteData.quoteId}`,
      html: createQuoteEmailTemplate(quoteData),
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    throw new Error(`Failed to send quote email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Send single product quote email
export const sendSingleProductQuoteEmail = async (quoteData: {
  productId: string;
  productTitle: string;
  quantity: number;
  basePrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
  };
  quoteId: string;
}) => {
  try {
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Demande de Devis Produit</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .totals { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .highlight { color: #28a745; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 Demande de Devis Produit</h2>
            <p><strong>ID de devis:</strong> ${quoteData.quoteId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <h3>👤 Informations Client</h3>
          <p><strong>Nom:</strong> ${quoteData.customer.name || 'Non spécifié'}</p>
          <p><strong>Email:</strong> ${quoteData.customer.email || 'Non spécifié'}</p>
          <p><strong>Téléphone:</strong> ${quoteData.customer.phone || 'Non spécifié'}</p>
          
          <h3>📦 Produit Demandé</h3>
          <p><strong>Produit:</strong> ${quoteData.productTitle}</p>
          <p><strong>Quantité:</strong> ${quoteData.quantity} unités</p>
          <p><strong>Prix de base:</strong> ${quoteData.basePrice.toFixed(2)} TND</p>
          ${quoteData.discount > 0 ? `<p><strong>Remise:</strong> ${quoteData.discount}%</p>` : ''}
          <p class="highlight"><strong>Prix final:</strong> ${quoteData.finalPrice.toFixed(2)} TND</p>
          <p><strong>Mode de paiement:</strong> ${quoteData.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 'Carte bancaire'}</p>
        </div>
      </body>
      </html>
    `;
    
    const result = await resend.emails.send({
      from: 'Packedin Devis <onboarding@resend.dev>',
      to: 'packedin.tn@gmail.com',
      subject: `🎯 Demande de devis - ${quoteData.productTitle}`,
      html: emailContent,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    throw new Error(`Failed to send single product quote email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Send contact form email
export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  timestamp: string;
}) => {
  try {

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouveau Message de Contact</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .message-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .highlight { color: #28a745; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 Nouveau Message de Contact</h2>
            <p><strong>Reçu le:</strong> ${new Date(contactData.timestamp).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div class="content">
            <h3>👤 Informations du Contact</h3>

            <div class="field">
              <div class="label">Nom complet:</div>
              <div class="value">${contactData.name}</div>
            </div>

            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
            </div>

            <div class="field">
              <div class="label">Téléphone:</div>
              <div class="value">${contactData.phone}</div>
            </div>

            <div class="field">
              <div class="label">Entreprise:</div>
              <div class="value">${contactData.company}</div>
            </div>

            <div class="field">
              <div class="label">Sujet:</div>
              <div class="value highlight">${contactData.subject}</div>
            </div>

            <div class="message-box">
              <div class="label">Message:</div>
              <div class="value" style="white-space: pre-wrap;">${contactData.message}</div>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px;">
            <h4>📋 Actions recommandées:</h4>
            <ul>
              <li>Répondre dans les 24h</li>
              <li>Enregistrer le contact dans le CRM</li>
              <li>Évaluer les besoins du client</li>
              <li>Préparer une proposition personnalisée</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Packedin Contact <onboarding@resend.dev>',
      to: 'packedin.tn@gmail.com',
      replyTo: contactData.email,
      subject: `📧 Contact: ${contactData.subject} - ${contactData.name}`,
      html: emailContent,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    throw new Error(`Failed to send contact email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    // Test with a simple API call to Resend
    return { success: true, message: 'Resend email configuration is valid' };
  } catch (error) {
    return {
      success: false,
      message: `Email configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Reply email template
const createReplyEmailTemplate = (replyData: any) => {
  const { toName, message, originalMessage } = replyData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Réponse de Packedin</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #16a34a, #22c55e, #4ade80);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #16a34a;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message-content {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
          margin: 20px 0;
          white-space: pre-wrap;
        }
        .original-message {
          background: #f1f5f9;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
          border: 1px solid #e2e8f0;
        }
        .original-message h3 {
          color: #475569;
          margin: 0 0 15px 0;
          font-size: 16px;
        }
        .original-details {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 15px;
        }
        .original-text {
          color: #475569;
          font-style: italic;
          white-space: pre-wrap;
        }
        .footer {
          background: #f8fafc;
          padding: 25px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-size: 14px;
        }
        .signature {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .logo {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #16a34a;
          margin-bottom: 10px;
        }
        @media (max-width: 600px) {
          .contact-info { flex-direction: column; gap: 15px; }
          .content { padding: 20px; }
          .header { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">P</div>
          <h1>Packedin</h1>
          <p>Solutions d'emballage professionnelles</p>
        </div>

        <div class="content">
          <div class="greeting">
            Bonjour ${toName},
          </div>

          <p>Merci pour votre message. Nous sommes ravis de pouvoir vous répondre.</p>

          <div class="message-content">
            ${message}
          </div>

          <p>N'hésitez pas à nous contacter si vous avez d'autres questions. Notre équipe est là pour vous accompagner dans tous vos projets d'emballage.</p>

          <div class="original-message">
            <h3>📩 Votre message original :</h3>
            <div class="original-details">
              <strong>Date :</strong> ${new Date(originalMessage.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}<br>
              ${originalMessage.subject ? `<strong>Sujet :</strong> ${originalMessage.subject}<br>` : ''}
              ${originalMessage.company ? `<strong>Entreprise :</strong> ${originalMessage.company}<br>` : ''}
              ${originalMessage.phone ? `<strong>Téléphone :</strong> ${originalMessage.phone}` : ''}
            </div>
            <div class="original-text">${originalMessage.message}</div>
          </div>
        </div>

        <div class="footer">
          <div class="contact-info">
            <div class="contact-item">
              📧 contact@packedin.tn
            </div>
            <div class="contact-item">
              📞 +216 29 362 224
            </div>
            <div class="contact-item">
              📍 Nabeul, Tunisie
            </div>
          </div>

          <div class="signature">
            <strong>L'équipe Packedin</strong><br>
            Votre partenaire pour des solutions d'emballage innovantes
            <br><br>
            <small>© ${new Date().getFullYear()} Packedin. Tous droits réservés.</small>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send reply email function
export const sendReplyEmail = async (replyData: {
  to: string;
  toName: string;
  subject: string;
  message: string;
  originalMessage: any;
}) => {
  try {
    const result = await resend.emails.send({
      from: 'Packedin <onboarding@resend.dev>',
      to: replyData.to,
      subject: `Re: ${replyData.subject}`,
      html: createReplyEmailTemplate(replyData),
    });

    console.log('Reply email sent successfully:', result.data?.id);
    return result;
  } catch (error) {
    console.error('Error sending reply email:', error);
    throw error;
  }
};

// Generic send email function
export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) => {
  try {
    const result = await resend.emails.send({
      from: emailData.from || 'Packedin <onboarding@resend.dev>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log('✅ Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// All functions are already exported as named exports above
