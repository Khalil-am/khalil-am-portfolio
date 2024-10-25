// src/config.js
export default {
  // Subdomain to send emails, if you have one – it’s fancy, but optional
  subdomain: "mail",
  // REQUIRED – Magic login emails need a bit of magic; set your 'From' address here
  fromNoReply: `Khalil <noreply@khalil-am.com>`,
  // REQUIRED – For all other communications that are a bit less magical
  fromAdmin: `Khalil at SautNote <khalil@sautnote.com>`,
  // Set up an email for support, just in case someone needs to holler
  supportEmail: "support@sautnote.com",
  // Forward replies from users to this address to avoid them getting lost in the ether
  forwardRepliesTo: "khalil-am@outlook.com",
};
