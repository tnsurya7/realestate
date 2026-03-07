package com.realestatecrm.service;

import com.realestatecrm.dto.ContactRequest;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.model.Property;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${mail.from}")
    private String fromEmail;
    
    @Value("${app.admin.email}")
    private String adminEmail;
    
    @Value("${app.contact.phone}")
    private String contactPhone;
    
    @Value("${app.contact.email}")
    private String contactEmail;
    
    @Value("${app.company.name}")
    private String companyName;
    
    @Value("${app.company.address}")
    private String companyAddress;

    private String getFooterHtml() {
        return String.format("""
            <div class="footer">
                <p><strong>%s</strong></p>
                <p>%s</p>
                <p><a href="mailto:%s">%s</a> | +91 %s</p>
                <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">This is an automated notification from your CRM system.</p>
            </div>
            """, companyName, companyAddress, contactEmail, contactEmail, contactPhone);
    }
    
    private String getContactInfoHtml(String linkColor) {
        return String.format("""
            <div class="contact-info">
                <div class="contact-item">
                    <span style="font-size: 20px;">📞</span>
                    <div>
                        <strong style="color: #1e293b;">Call Us:</strong>
                        <a href="tel:+91%s" style="color: %s; text-decoration: none; display: block;">+91 %s</a>
                    </div>
                </div>
                <div class="contact-item">
                    <span style="font-size: 20px;">💬</span>
                    <div>
                        <strong style="color: #1e293b;">WhatsApp:</strong>
                        <a href="https://wa.me/91%s" style="color: %s; text-decoration: none; display: block;">Chat with us instantly</a>
                    </div>
                </div>
                <div class="contact-item">
                    <span style="font-size: 20px;">✉️</span>
                    <div>
                        <strong style="color: #1e293b;">Email:</strong>
                        <a href="mailto:%s" style="color: %s; text-decoration: none; display: block;">%s</a>
                    </div>
                </div>
            </div>
            """, contactPhone, linkColor, contactPhone, contactPhone, linkColor, contactEmail, linkColor, contactEmail);
    }


    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            log.info("Email sent successfully to {} - Status: {}", to, response.getStatusCode());
        } catch (IOException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    public void sendContactFormEmail(ContactRequest request) {
        // Send to admin
        sendEmail(adminEmail, "🔔 New Contact Form Submission - " + companyName, buildContactEmailTemplate(request));
        log.info("Contact form email sent to admin");
        
        // Send confirmation to sender
        sendEmail(request.getEmail(), "✅ We Received Your Message - " + companyName, buildContactConfirmationTemplate(request));
        log.info("Confirmation email sent to {}", request.getEmail());
    }

    public void sendLeadNotificationEmail(LeadRequest request, Property property) {
        // Send to admin
        sendEmail(adminEmail, "🎯 New Lead Inquiry - " + companyName, buildLeadEmailTemplate(request, property));
        log.info("Lead notification email sent to admin");
        
        // Send confirmation to lead
        sendEmail(request.getCustomerEmail(), "✅ Thank You for Your Interest - " + companyName, buildLeadConfirmationTemplate(request, property));
        log.info("Lead confirmation email sent to {}", request.getCustomerEmail());
    }

    public void sendPropertyRecommendations(com.realestatecrm.model.Lead lead, java.util.List<com.realestatecrm.model.Property> properties) {
        sendEmail(lead.getCustomerEmail(), "🏡 Property Recommendations Just for You - " + companyName, buildPropertyRecommendationTemplate(lead, properties));
        log.info("Property recommendations sent to: {}", lead.getCustomerEmail());
    }

    private String buildContactEmailTemplate(ContactRequest request) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #2563eb 0%%, #1e40af 100%%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
                    .header p { color: #dbeafe; margin: 8px 0 0 0; font-size: 14px; }
                    .content { padding: 40px 30px; }
                    .badge { display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
                    .info-row { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
                    .info-row:last-child { border-bottom: none; }
                    .label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
                    .value { font-size: 16px; color: #1e293b; font-weight: 500; }
                    .message-box { background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-top: 10px; }
                    .message-box p { margin: 0; color: #475569; line-height: 1.7; }
                    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer p { margin: 5px 0; font-size: 13px; color: #64748b; }
                    .footer a { color: #2563eb; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📬 New Contact Message</h1>
                        <p>Someone reached out through your website</p>
                    </div>
                    <div class="content">
                        <span class="badge">CONTACT FORM SUBMISSION</span>
                        
                        <div class="info-row">
                            <div class="label">Full Name</div>
                            <div class="value">%s</div>
                        </div>
                        
                        <div class="info-row">
                            <div class="label">Email Address</div>
                            <div class="value"><a href="mailto:%s" style="color: #2563eb; text-decoration: none;">%s</a></div>
                        </div>
                        
                        %s
                        
                        <div class="info-row">
                            <div class="label">Message</div>
                            <div class="message-box">
                                <p>%s</p>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>%s</strong></p>
                        <p>%s</p>
                        <p><a href="mailto:%s">%s</a> | +91 %s</p>
                        <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">This is an automated notification from your CRM system.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                request.getName(),
                request.getEmail(),
                request.getEmail(),
                request.getPhone() != null && !request.getPhone().isEmpty() 
                    ? "<div class=\"info-row\"><div class=\"label\">Phone Number</div><div class=\"value\"><a href=\"tel:" + request.getPhone() + "\" style=\"color: #2563eb; text-decoration: none;\">" + request.getPhone() + "</a></div></div>"
                    : "",
                request.getMessage().replace("\n", "<br>"),
                companyName,
                companyAddress,
                contactEmail,
                contactEmail,
                contactPhone
            );
    }

    private String buildLeadEmailTemplate(LeadRequest request, Property property) {
        String propertyInfo = property != null 
            ? "<div class=\"info-row\"><div class=\"label\">Interested Property</div><div class=\"value\" style=\"color: #2563eb; font-weight: 600;\">" + property.getTitle() + "</div><div style=\"font-size: 13px; color: #64748b; margin-top: 4px;\">📍 " + property.getLocation() + " | ₹" + String.format("%,d", property.getPrice().longValue()) + "</div></div>"
            : "";

        String budgetInfo = request.getBudget() != null 
            ? "<div class=\"info-row\"><div class=\"label\">Budget</div><div class=\"value\">₹" + String.format("%,d", request.getBudget().longValue()) + "</div></div>"
            : "";

        String notesInfo = request.getNotes() != null && !request.getNotes().isEmpty()
            ? "<div class=\"info-row\"><div class=\"label\">Additional Notes</div><div class=\"message-box\"><p>" + request.getNotes().replace("\n", "<br>") + "</p></div></div>"
            : "";

        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
                    .header p { color: #d1fae5; margin: 8px 0 0 0; font-size: 14px; }
                    .content { padding: 40px 30px; }
                    .badge { display: inline-block; background-color: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
                    .info-row { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
                    .info-row:last-child { border-bottom: none; }
                    .label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
                    .value { font-size: 16px; color: #1e293b; font-weight: 500; }
                    .message-box { background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 10px; }
                    .message-box p { margin: 0; color: #475569; line-height: 1.7; }
                    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer p { margin: 5px 0; font-size: 13px; color: #64748b; }
                    .footer a { color: #10b981; text-decoration: none; }
                    .cta-button { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 New Lead Inquiry</h1>
                        <p>A potential customer is interested in a property</p>
                    </div>
                    <div class="content">
                        <span class="badge">NEW LEAD - ACTION REQUIRED</span>
                        
                        <div class="info-row">
                            <div class="label">Customer Name</div>
                            <div class="value">%s</div>
                        </div>
                        
                        <div class="info-row">
                            <div class="label">Email Address</div>
                            <div class="value"><a href="mailto:%s" style="color: #10b981; text-decoration: none;">%s</a></div>
                        </div>
                        
                        <div class="info-row">
                            <div class="label">Phone Number</div>
                            <div class="value"><a href="tel:%s" style="color: #10b981; text-decoration: none;">%s</a></div>
                        </div>
                        
                        %s
                        
                        %s
                        
                        %s
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">⏰ <strong>Quick Response Recommended</strong></p>
                            <p style="color: #64748b; font-size: 13px;">Contact this lead within 2 hours for best conversion rates</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>%s</strong></p>
                        <p>%s</p>
                        <p><a href="mailto:%s">%s</a> | +91 %s</p>
                        <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">This is an automated notification from your CRM system.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getCustomerEmail(),
                request.getCustomerPhone(),
                request.getCustomerPhone(),
                propertyInfo,
                budgetInfo,
                notesInfo,
                companyName,
                companyAddress,
                contactEmail,
                contactEmail,
                contactPhone
            );
    }

    private String buildContactConfirmationTemplate(ContactRequest request) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
                    .header p { color: #d1fae5; margin: 8px 0 0 0; font-size: 14px; }
                    .content { padding: 40px 30px; }
                    .checkmark { width: 60px; height: 60px; background-color: #d1fae5; border-radius: 50%%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                    .checkmark svg { width: 30px; height: 30px; color: #059669; }
                    .message-box { background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
                    .contact-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .contact-item { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
                    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer p { margin: 5px 0; font-size: 13px; color: #64748b; }
                    .footer a { color: #10b981; text-decoration: none; }
                    .btn { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Message Received!</h1>
                        <p>Thank you for contacting us</p>
                    </div>
                    <div class="content">
                        <div class="checkmark">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        
                        <h2 style="text-align: center; color: #1e293b; margin-bottom: 10px;">Hi %s!</h2>
                        <p style="text-align: center; color: #64748b; margin-bottom: 30px;">We've received your message and our team will get back to you shortly.</p>
                        
                        <div class="message-box">
                            <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Your Message:</strong></p>
                            <p style="margin: 10px 0 0 0; color: #475569;">%s</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">⏰ <strong>Expected Response Time:</strong> Within 24 hours</p>
                            <p style="color: #64748b; font-size: 14px;">For immediate assistance, feel free to reach out:</p>
                        </div>
                        
                        <div class="contact-info">
                            <div class="contact-item">
                                <span style="font-size: 20px;">📞</span>
                                <div>
                                    <strong style="color: #1e293b;">Call Us:</strong>
                                    <a href="tel:+91%s" style="color: #10b981; text-decoration: none; display: block;">+91 %s</a>
                                </div>
                            </div>
                            <div class="contact-item">
                                <span style="font-size: 20px;">💬</span>
                                <div>
                                    <strong style="color: #1e293b;">WhatsApp:</strong>
                                    <a href="https://wa.me/91%s" style="color: #10b981; text-decoration: none; display: block;">Chat with us instantly</a>
                                </div>
                            </div>
                            <div class="contact-item">
                                <span style="font-size: 20px;">✉️</span>
                                <div>
                                    <strong style="color: #1e293b;">Email:</strong>
                                    <a href="mailto:%s" style="color: #10b981; text-decoration: none; display: block;">%s</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>%s</strong></p>
                        <p>%s</p>
                        <p><a href="mailto:%s">%s</a> | +91 %s</p>
                        <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">This is an automated confirmation from %s.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                request.getName(),
                request.getMessage().replace("\n", "<br>"),
                contactPhone,
                contactPhone,
                contactPhone,
                contactEmail,
                contactEmail,
                companyName,
                companyAddress,
                contactEmail,
                contactEmail,
                contactPhone,
                companyName
            );
    }

    private String buildLeadConfirmationTemplate(LeadRequest request, Property property) {
        String propertyInfo = property != null 
            ? "<div style=\"background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;\"><h3 style=\"color: #1e293b; margin-top: 0;\">Property You're Interested In:</h3><p style=\"color: #2563eb; font-weight: 600; font-size: 18px; margin: 5px 0;\">" + property.getTitle() + "</p><p style=\"color: #64748b; margin: 5px 0;\">📍 " + property.getLocation() + "</p><p style=\"color: #059669; font-weight: 600; margin: 5px 0;\">₹" + String.format("%,d", property.getPrice().longValue()) + "</p></div>"
            : "";

        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #2563eb 0%%, #1e40af 100%%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
                    .header p { color: #dbeafe; margin: 8px 0 0 0; font-size: 14px; }
                    .content { padding: 40px 30px; }
                    .checkmark { width: 60px; height: 60px; background-color: #dbeafe; border-radius: 50%%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                    .checkmark svg { width: 30px; height: 30px; color: #1e40af; }
                    .contact-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .contact-item { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
                    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer p { margin: 5px 0; font-size: 13px; color: #64748b; }
                    .footer a { color: #2563eb; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Interest Received!</h1>
                        <p>We're excited to help you find your dream property</p>
                    </div>
                    <div class="content">
                        <div class="checkmark">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        
                        <h2 style="text-align: center; color: #1e293b; margin-bottom: 10px;">Hi %s!</h2>
                        <p style="text-align: center; color: #64748b; margin-bottom: 30px;">Thank you for expressing interest! Our team has received your inquiry and will contact you shortly.</p>
                        
                        %s
                        
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px;">
                            <p style="color: #92400e; font-size: 14px; margin: 0;"><strong>⏰ Quick Response Guaranteed</strong></p>
                            <p style="color: #92400e; font-size: 14px; margin: 5px 0 0 0;">Our agent will reach out within 2 hours during business hours</p>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <p style="color: #64748b; font-size: 14px;">Need immediate assistance? Contact us now:</p>
                        </div>
                        
                        <div class="contact-info">
                            <div class="contact-item">
                                <span style="font-size: 20px;">📞</span>
                                <div>
                                    <strong style="color: #1e293b;">Call Us:</strong>
                                    <a href="tel:+91%s" style="color: #2563eb; text-decoration: none; display: block;">+91 %s</a>
                                </div>
                            </div>
                            <div class="contact-item">
                                <span style="font-size: 20px;">💬</span>
                                <div>
                                    <strong style="color: #1e293b;">WhatsApp:</strong>
                                    <a href="https://wa.me/91%s" style="color: #2563eb; text-decoration: none; display: block;">Chat with us instantly</a>
                                </div>
                            </div>
                            <div class="contact-item">
                                <span style="font-size: 20px;">✉️</span>
                                <div>
                                    <strong style="color: #1e293b;">Email:</strong>
                                    <a href="mailto:%s" style="color: #2563eb; text-decoration: none; display: block;">%s</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>%s</strong></p>
                        <p>%s</p>
                        <p><a href="mailto:%s">%s</a> | +91 %s</p>
                        <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">This is an automated confirmation from %s.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                request.getCustomerName(),
                propertyInfo,
                contactPhone,
                contactPhone,
                contactPhone,
                contactEmail,
                contactEmail,
                companyName,
                companyAddress,
                contactEmail,
                contactEmail,
                contactPhone,
                companyName
            );
    }

    private String buildPropertyRecommendationTemplate(com.realestatecrm.model.Lead lead, java.util.List<com.realestatecrm.model.Property> properties) {
        StringBuilder propertiesHtml = new StringBuilder();

        for (com.realestatecrm.model.Property property : properties) {
            propertiesHtml.append(String.format("""
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #1e293b; margin-top: 0;">%s</h3>
                    <p style="color: #64748b; margin: 5px 0;">📍 %s</p>
                    <p style="color: #059669; font-weight: 600; font-size: 20px; margin: 10px 0;">₹%s</p>
                    <p style="color: #475569; margin: 10px 0;">%s</p>
                    <div style="display: flex; gap: 15px; margin: 10px 0;">
                        <span style="color: #64748b;">🛏️ %d Bedrooms</span>
                        <span style="color: #64748b;">🚿 %d Bathrooms</span>
                        <span style="color: #64748b;">📐 %.0f sq ft</span>
                    </div>
                </div>
                """,
                property.getTitle(),
                property.getLocation(),
                String.format("%,d", property.getPrice().longValue()),
                property.getDescription() != null ? property.getDescription() : "Beautiful property in prime location",
                property.getBedrooms() != null ? property.getBedrooms() : 0,
                property.getBathrooms() != null ? property.getBathrooms() : 0,
                property.getArea() != null ? property.getArea() : 0.0
            ));
        }

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #2563eb 0%%, #1e40af 100%%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
                    .header p { color: #dbeafe; margin: 8px 0 0 0; font-size: 14px; }
                    .content { padding: 40px 30px; }
                    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
                    .footer p { margin: 5px 0; font-size: 13px; color: #64748b; }
                    .footer a { color: #2563eb; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏡 Property Recommendations</h1>
                        <p>Handpicked properties matching your preferences</p>
                    </div>
                    <div class="content">
                        <h2 style="text-align: center; color: #1e293b; margin-bottom: 10px;">Hi %s!</h2>
                        <p style="text-align: center; color: #64748b; margin-bottom: 30px;">We found some amazing properties that match your budget and preferences.</p>

                        %s

                        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
                            <p style="color: #475569; margin: 0;">Interested in any of these properties?</p>
                            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">Contact us for more details or to schedule a viewing!</p>
                            <div style="margin-top: 15px;">
                                <a href="tel:+91%s" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px;">📞 Call Us</a>
                                <a href="https://wa.me/91%s" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px;">💬 WhatsApp</a>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p><strong>%s</strong></p>
                        <p>%s</p>
                        <p><a href="mailto:%s">%s</a> | +91 %s</p>
                        <p style="margin-top: 15px; color: #94a3b8; font-size: 12px;">You're receiving this because you expressed interest in properties. <a href="#" style="color: #94a3b8;">Unsubscribe</a></p>
                    </div>
                </div>
            </body>
            </html>
            """,
            lead.getCustomerName(),
            propertiesHtml.toString(),
            contactPhone,
            contactPhone,
            companyName,
            companyAddress,
            contactEmail,
            contactEmail,
            contactPhone
        );
    }

}
