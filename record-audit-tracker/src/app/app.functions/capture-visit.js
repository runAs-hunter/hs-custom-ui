const hubspot = require("@hubspot/api-client");

function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const yy = date.getFullYear().toString().slice(-2);
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${mm}/${dd}/${yy} ${hh}:${min}:${ss}`;
}

async function main(context) {
  try {
    console.log("Function context:", context);
    console.log("context.auth:", context.auth);
    console.log("context.secrets:", context.secrets);

    const { contactId, userId, userEmail } = context.parameters;
    if (!contactId) throw new Error("Missing contactId");
    if (!userId || !userEmail) throw new Error("Missing user info");

    // Try to get access token from different sources
    let accessToken = null;
    
    // First try OAuth
    if (context.auth && context.auth.oauthAccessToken) {
      accessToken = context.auth.oauthAccessToken;
      console.log("Using OAuth access token");
    }
    // Then try secrets
    else if (context.secrets && context.secrets.PRIVATE_APP_ACCESS_TOKEN) {
      accessToken = context.secrets.PRIVATE_APP_ACCESS_TOKEN;
      console.log("Using private app access token from secrets");
    }
    // Finally try environment variable
    else if (process.env.PRIVATE_APP_ACCESS_TOKEN) {
      accessToken = process.env.PRIVATE_APP_ACCESS_TOKEN;
      console.log("Using private app access token from environment");
    }
    
    if (!accessToken) {
      console.error("No access token found. Available sources:", {
        hasAuth: !!context.auth,
        hasSecrets: !!context.secrets,
        hasEnvToken: !!process.env.PRIVATE_APP_ACCESS_TOKEN,
        authKeys: context.auth ? Object.keys(context.auth) : [],
        secretKeys: context.secrets ? Object.keys(context.secrets) : []
      });
      throw new Error("No access token available for HubSpot API");
    }

    const hubspotClient = new hubspot.Client({ accessToken });

    const email = userEmail || "unknown@unknown.com";
    const entry = `${email} @ ${formatDate(new Date())}`;

    // Overwrite the view_log with only the new entry
    await hubspotClient.crm.contacts.basicApi.update(contactId, {
      properties: { view_log: entry }
    });

    console.log("Successfully logged visit:", entry);
    return { statusCode: 200, body: { message: "Visit logged successfully" } };
  } catch (error) {
    console.error("capture-visit error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { statusCode: 500, body: { error: error.message, details: error?.response?.body } };
  }
}

exports.main = main;
