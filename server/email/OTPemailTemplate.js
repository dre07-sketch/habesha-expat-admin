// emailTemplate.js
const getCoolEmailTemplate = (otp, name) => {
  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="400" style="background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 0 10px;">
               <h2 style="color: #f8fafc; margin: 0; font-weight: 600; font-size: 24px;">Reset Password</h2>
               <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Hello ${name},</p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding: 20px;">
              <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.5); border-radius: 12px; padding: 20px; width: 200px;">
                <span style="color: #818cf8; font-size: 36px; letter-spacing: 8px; font-weight: bold; display: block; text-align: center;">
                  ${otp}
                </span>
              </div>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td align="center" style="padding: 0 30px 30px;">
              <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                Enter this code to proceed. This code will expire in <b style="color: #f8fafc;">3 minutes</b>.
              </p>
              <p style="color: #64748b; font-size: 11px; margin-top: 20px;">
                If you did not request this, please ignore this email.
              </p>
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

module.exports = { getCoolEmailTemplate };