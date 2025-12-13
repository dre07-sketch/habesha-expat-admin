const createCoolEmailTemplate = (subject, content, imageUrl = null) => {
    const currentYear = new Date().getFullYear();
    
    // 1. Handle Image URL (Absolute path or Default)
    const fullHeroImage = imageUrl
        ? `http://localhost:5000/upload/${imageUrl}`
        : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

    // 2. TEXT FORMATTER LOGIC
    // This turns raw text with line breaks into beautiful HTML paragraphs.
    const formatContent = (text) => {
        if (!text) return '';
        
        // Split text by double newlines (paragraphs)
        return text
            .split(/\n\s*\n/) // Detects gaps between paragraphs
            .map(paragraph => {
                const cleanText = paragraph.trim();
                if (!cleanText) return '';
                
                // Return a styled HTML paragraph
                return `<p style="margin: 0 0 24px 0; font-family: 'Times New Roman', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #374151;">${cleanText}</p>`;
            })
            .join(''); // Join them back together
    };

    const formattedBody = formatContent(content);

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${subject}</title>
    <style type="text/css">
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        
        .primary-btn:hover { background-color: #4338ca !important; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4) !important; transform: translateY(-2px); }
        
        @media screen and (max-width: 680px) {
            .w-full { width: 100% !important; max-width: 100% !important; }
            .p-mobile { padding: 30px 20px !important; }
            .mobile-title { font-size: 28px !important; line-height: 1.2 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #1e293b; font-family: 'Times New Roman', Times, serif;">

    <!-- Outer Table (Blue-Black Background) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b;">
        <tr>
            <td align="center" style="padding: 45px 10px;">
                
                <!-- Main Card Container - INCREASED WIDTH TO 680px -->
                <table border="0" cellpadding="0" cellspacing="0" width="680" class="w-full" style="background-color: #ffffff; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border-radius: 4px;">
                    
                    <!-- Top Accent Gradient -->
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, #4f46e5 0%, #000000 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header Section -->
                    <tr>
                        <td style="padding: 40px 50px 25px 50px; border-bottom: 2px solid #f1f5f9;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <span style="font-family: 'Times New Roman', Times, serif; font-weight: 700; font-size: 26px; color: #0f172a; letter-spacing: 0.5px; text-transform: uppercase;">
                                            Habesh<span style="color: #4f46e5;"> Expat.</span>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: 400; color: #64748b; font-style: italic;">
                                            Weekly Digest
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content Body -->
                    <tr>
                        <td class="p-mobile" style="padding: 45px 60px;">
                            
                            <!-- Date / Category -->
                            <div style="margin-bottom: 25px;">
                                <span style="border: 1px solid #e2e8f0; background-color: #2d648c; color: #ffffff; padding: 6px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; font-family: Helvetica, Arial, sans-serif;">
                                    News
                                </span>
                                <span style="color: #64748b; font-size: 16px; margin-left: 12px; font-family: 'Times New Roman', Times, serif; font-style: italic;">
                                    ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <!-- Title (Times New Roman Bold) -->
                            <h1 class="mobile-title" style="margin: 0 0 30px 0; font-family: 'Times New Roman', Times, serif; font-size: 42px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; line-height: 1.1;">
                                ${subject}
                            </h1>

                            <!-- IMAGE SECTION -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 40px;">
                                <tr>
                                    <td>
                                        <img src="${fullHeroImage}" alt="Cover Image" width="560" style="display: block; width: 100%; height: auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
                                    </td>
                                </tr>
                            </table>

                            <!-- Formatted Content (Times New Roman) -->
                            <div style="font-family: 'Times New Roman', Times, serif; font-size: 19px; line-height: 1.7; color: #334155;">
                                ${formattedBody}
                            </div>

                            <!-- CTA Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 50px;">
                                <tr>
                                    <td align="center">
                                        <a href="#" class="primary-btn" style="display: inline-block; padding: 16px 40px; background-color: #2d648c; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 0px; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
                                            Read Full Story
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 45px 60px; border-top: 1px solid #e2e8f0;" class="p-mobile">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="color: #f8fafc; font-size: 14px; font-family: 'Times New Roman', Times, serif; line-height: 1.6;">
                                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #f8fafc; font-weight: bold;">
                                            Habesh Expat News
                                        </p>
                                        
                                        <p style="margin: 0 0 25px 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                                            <a href="#" style="color: #f8fafc; text-decoration: none; margin: 0 10px;">Website</a>
                                            <a href="#" style="color: #f8fafc; text-decoration: none; margin: 0 10px;">Twitter</a>
                                            <a href="#" style="color: #f8fafc; text-decoration: none; margin: 0 10px;">LinkedIn</a>
                                        </p>

                                        <p style="margin: 0; font-size: 13px; font-style: italic;">
                                            <a href="#" style="color: #f8fafc; text-decoration: underline;">Unsubscribe</a> &nbsp;•&nbsp; 
                                            <a href="#" style="color: #f8fafc; text-decoration: underline;">Privacy Policy</a>
                                        </p>
                                        <p style="margin-top: 15px; font-size: 12px; opacity: 0.6;">
                                            &copy; ${currentYear} All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Bottom Spacer -->
                <div style="height: 60px;">&nbsp;</div>

            </td>
        </tr>
    </table>

</body>
</html>
    `;
};

module.exports = { createCoolEmailTemplate };