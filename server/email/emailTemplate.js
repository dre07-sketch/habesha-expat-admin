// ==========================================
// EMAIL TEMPLATE GENERATOR
// ==========================================

const createCoolEmailTemplate = (subject, content, imageUrl = null) => {
  const currentYear = new Date().getFullYear();
  
  // Default hero image if none provided
  const heroImage = imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #f4f6f8;
            padding: 40px 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Header Section - Updated to blue-black gradient */
        .header {
            background: linear-gradient(135deg, #0a192f 0%, #000000 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, rgba(100, 181, 246, 0) 70%);
            animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(0.8); opacity: 0.5; }
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-size: 26px;
            font-weight: 800;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .header-icon {
            margin-right: 10px;
            font-size: 24px;
        }
        
        .header p {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
            font-weight: 300;
        }
        
        /* Featured Image Section - Matching NewsletterForm image upload */
        .featured-image-section {
            padding: 0;
            margin: 0;
            position: relative;
        }
        
        .featured-image {
            width: 100%;
            height: 220px;
            object-fit: cover;
            display: block;
        }
        
        .featured-image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            padding: 20px;
        }
        
        /* Content Section - Matching NewsletterForm content area */
        .content-section {
            padding: 40px 30px;
            color: #4a5568;
        }
        
        .content-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .content-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #0a192f 0%, #000000 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-size: 18px;
        }
        
        .content-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content-body {
            font-size: 16px;
            line-height: 1.7;
            color: #4a5568;
        }
        
        /* Button Container - Centers the button */
        .button-container {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        
        /* Button - Updated to match blue-black theme */
        .cta-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a192f 0%, #000000 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(10, 25, 47, 0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        
        /* Button shine effect */
        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
            z-index: -1;
        }
        
        .cta-button:hover::before {
            left: 100%;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 20px rgba(10, 25, 47, 0.6);
        }
        
        .button-icon {
            margin-right: 8px;
        }
        
        /* Footer */
        .footer {
            background-color: #0a192f;
            color: #cbd5e0;
            padding: 30px;
            text-align: center;
            font-size: 13px;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #a0aec0;
            text-decoration: underline;
        }
        
        .footer-links {
            margin-top: 15px;
        }
        
        .footer-links a {
            margin: 0 10px;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 22px;
            }
            
            .content-section {
                padding: 30px 20px;
            }
            
            .featured-image {
                height: 180px;
            }
            
            .cta-button {
                padding: 8px 16px;
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header Section - Updated to blue-black gradient -->
            <div class="header">
                <div class="header-content">
                    <h1>
                        <span class="header-icon">✉️</span>
                        ${subject}
                    </h1>
                    <p>Latest Updates & Insights</p>
                </div>
            </div>
            
            <!-- Featured Image Section - Matching NewsletterForm image upload -->
            <div class="featured-image-section">
                <img src="${heroImage}" alt="Featured Image" class="featured-image">
                <div class="featured-image-overlay">
                    Featured Image
                </div>
            </div>
            
            <!-- Content Section - Matching NewsletterForm content area -->
            <div class="content-section">
                <div class="content-header">
                    <div class="content-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </div>
                    <div class="content-title">Email Content</div>
                </div>
                
                <div class="content-body">
                    ${content}
                </div>
                
                <!-- Button Container to center the button -->
                <div class="button-container">
                    <a href="#" class="cta-button">
                        <span class="button-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </span>
                        Learn More
                    </a>
                </div>
            </div>
            
            <!-- Footer - Updated to match blue-black theme -->
            <div class="footer">
                <p>&copy; ${currentYear} Habesh Expat News. All rights reserved.</p>
                <p>123 Business Street, Tech City</p>
                <div class="footer-links">
                    <a href="#">Unsubscribe</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Contact Us</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { createCoolEmailTemplate };