// src/services/emailService.js
import emailjs from "@emailjs/browser";

// Twój skonfigurowany Service ID (SMTP lub Gmail)
const SERVICE_ID = "service_99ze4ld";

// ID szablonu dla maili zabiegowych (zalecenia pozabiegowe)
const TEMPLATE_TREATMENT = "template_kqm23qp";

// ID szablonu dla newslettera
const TEMPLATE_NEWSLETTER = "template_won8k6h"; // <- zakładam, że to właściwe ID

// Twój publiczny klucz EmailJS
const USER_ID = "5jB6ZtTBlhFYjZEX6";

/**
 * Wyślij maila z zaleceniami pozabiegowymi
 */
export function sendTreatmentEmail({
  to_name,
  to_email,
  date,
  treatment_type,
}) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_TREATMENT,
    {
      to_name,
      to_email,
      date,
      treatment_type,
    },
    USER_ID
  );
}

/**
 * Wyślij newsletter o dowolnym temacie i treści
 */
export function sendNewsletterEmail({ to_name, to_email, subject, message }) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_NEWSLETTER,
    {
      to_name,
      to_email,
      subject,
      message,
    },
    USER_ID
  );
}
