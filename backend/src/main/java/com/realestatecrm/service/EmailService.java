package com.realestatecrm.service;

import com.realestatecrm.dto.ContactRequest;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.model.Property;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

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


    public void sendContactFormEmail(ContactRequest request) {
        try {
            // Send to admin
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(adminEmail);
            helper.setSubject("🔔 New Contact Form Submission - " + companyName);
            helper.setText(buildContactEmailTemplate(request), true);

            mailSender.send(message);
            log.info("Contact form email sent successfully to {}", adminEmail);
            
            // Send confirmation to sender
            sendContactConfirmationEmail(request);
        } catch (MessagingException e) {
            log.error("Failed to send contact form email", e);
        }
    }
    
    public void sendContactConfirmationEmail(ContactRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getEmail());
            helper.setSubject("✅ We Received Your Message - " + companyName);
            helper.setText(buildContactConfirmationTemplate(request), true);

            mailSender.send(message);
            log.info("Confirmation email sent to {}", request.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send confirmation email", e);
        }
    }

    public void sendLeadNotificationEmail(LeadRequest request, Property property) {
        try {
            // Send to admin
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(adminEmail);
            helper.setSubject("🎯 New Lead Inquiry - " + companyName);
            helper.setText(buildLeadEmailTemplate(request, property), true);

            mailSender.send(message);
            log.info("Lead notification email sent successfully to {}", adminEmail);
            
            // Send confirmation to lead
            sendLeadConfirmationEmail(request, property);
        } catch (MessagingException e) {
            log.error("Failed to send lead notification email", e);
        }
    }
    
    public void sendLeadConfirmationEmail(LeadRequest request, Property property) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getCustomerEmail());
            helper.setSubject("✅ Thank You for Your Interest - " + companyName);
            helper.setText(buildLeadConfirmationTemplate(request, property), true);

            mailSender.send(message);
            log.info("Lead confirmation email sent to {}", request.getCustomerEmail());
        } catch (MessagingException e) {
            log.error("Failed to send lead confirmation email", e);
        }
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
}
