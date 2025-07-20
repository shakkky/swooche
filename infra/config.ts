export const config = new sst.Config.Secret("Config", {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
  TWILIO_API_KEY: process.env.TWILIO_API_KEY!,
  TWILIO_API_SECRET: process.env.TWILIO_API_SECRET!,
  TWIML_APP_SID: process.env.TWIML_APP_SID!,
});
