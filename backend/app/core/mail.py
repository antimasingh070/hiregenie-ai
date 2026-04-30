from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
def send_reset_email(email: str, token: str):
    print(f"Send email to {email} with token {token}")
    
async def send_reset_password_mail(email_to: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your HireGenie AI account. Click the button below to proceed:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="padding: 12px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   Reset Password
                </a>
            </p>
            <p>If you did not request this change, please ignore this email.</p>
            <p>This link will expire in 15 minutes.</p>
            <br>
            <p>Best Regards,<br>The HireGenie AI Team</p>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="HireGenie AI - Password Reset",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)