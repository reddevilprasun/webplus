export const sentSMS = async (number: string, msg: string) => {
      try {
            const accountSid = process.env.ACCOUNT_SID;
            const authToken = process.env.AUTH_TOKEN;
            const client = require('twilio')(accountSid, authToken);

            const response = await client.messages.create({
                  body: msg,
                  from: '+15855777961',
                  to: `+91${number}`
            });

            if (!response.sid) {
                  return { error: true, message: "Failed to send SMS. Please check the number." };
            }
            return { success: true };
      } catch (error: any) {
            return { error: true, message: "Failed to send SMS. Please check the number" };
      }
}
