export default {
  title: process.env.SITE_NAME,
  mail: {
    name: process.env.EMAIL_NAME,
    email: process.env.EMAIL_FROM
  },
  url: {
    api: process.env.API_URL,
    site: process.env.SITE_URL,
    dashboard: process.env.DASHBOARD_URL,
    app: process.env.APP_URL,
    assets: process.env.ASSETS_URL || process.env.API_URL
  },
  notifications: {
    sms: {
      sid: process.env.TWILIO_SID,
      token: process.env.TWILIO_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },
    push: {
      key: process.env.FIREBASE_KEY,
      id: process.env.FIREBASE_ID
    },
    mail: {
      key: process.env.SENDGRID_API_KEY
    }
  },
  salt: process.env.SALT,
  jwtSecret: process.env.JWT_SECRET
}
