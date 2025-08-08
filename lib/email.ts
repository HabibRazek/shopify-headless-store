import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create reusable transporter object
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email configuration missing. Please set SMTP_USER and SMTP_PASS environment variables.');
  }



  return nodemailer.createTransport(EMAIL_CONFIG);
};

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
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ZIPBAGS Devis" <${process.env.SMTP_USER}>`,
      to: 'packedin.tn@gmail.com',
      subject: `🎯 Nouvelle demande de devis - ${quoteData.quoteId}`,
      html: createQuoteEmailTemplate(quoteData),
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
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
    const transporter = createTransporter();
    
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
    
    const mailOptions = {
      from: `"ZIPBAGS Devis" <${process.env.SMTP_USER}>`,
      to: 'packedin.tn@gmail.com',
      subject: `🎯 Demande de devis - ${quoteData.productTitle}`,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
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
    const transporter = createTransporter();

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

    const mailOptions = {
      from: `"Packedin Contact" <${process.env.SMTP_USER}>`,
      to: 'packedin.tn@gmail.com',
      replyTo: contactData.email,
      subject: `📧 Contact: ${contactData.subject} - ${contactData.name}`,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Failed to send contact email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return {
      success: false,
      message: `Email configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
