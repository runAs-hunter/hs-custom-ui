const hubspot = require("@hubspot/api-client");

async function main(context) {
  try {
    console.log("Function context:", context);
    console.log("context.auth:", context.auth);
    console.log("context.secrets:", context.secrets);

    const { contactId } = context.parameters;
    if (!contactId) throw new Error("Missing contactId");

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

    // Read and parse the view_log
    const { properties } = await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      ["view_log"]
    );
    const log = properties.view_log || "";
    
    // Parse the log entries
    const visits = log
      .split("\n")
      .filter(Boolean)
      .map(line => {
        // Parse format: "email @ timestamp"
        const parts = line.split(" @ ");
        if (parts.length >= 2) {
          return { 
            email: parts[0].trim(), 
            timestamp: parts.slice(1).join(" @ ").trim() 
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null entries

    console.log("Successfully fetched visits:", visits);
    return {
      statusCode: 200,
      response: visits
    };
  } catch (error) {
    console.error("get-visits error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { statusCode: 500, body: { error: error.message, details: error?.response?.body } };
  }
}

exports.main = main;
