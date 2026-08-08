const newsletterTemplate = (subject, htmlContent) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Tahoma, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
      <tr>
        <td align="center">
          
          <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 90%; margin: 0 auto;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color: #2563eb; padding: 30px 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Gitnest Platform</h1>
                <p style="color: #93c5fd; margin: 8px 0 0 0; font-size: 14px;">Learn, Build, Deploy</p>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 40px 30px; color: #374151; font-size: 15px; line-height: 1.8; text-align: left;">
                <h2 style="color: #1f2937; font-size: 20px; margin-top: 0; margin-bottom: 20px;">${subject}</h2>
                
                <div>
                  ${htmlContent}
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                  <a href="http://localhost:3000" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 15px;">Visit Platform</a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px; color: #6b7280; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0;">You received this email because you are registered on our platform.</p>
                <p style="margin: 5px 0 0 0;">© 2026 Gitnest. All rights reserved.</p>
              </td>
            </tr>
            
          </table>

        </td>
      </tr>
    </table>
    
  </body>
  </html>
  `;
};

module.exports = newsletterTemplate;