const ApiBaseURL = "http://localhost:3001";
const domain = "http://localhost:3000";
const recaptcha_sitekey = "";
const oauth2URL = `https://discord.com/api/oauth2/authorize?client_id=1094190720740511854&redirect_uri=${domain}/api/login&response_type=code&scope=identify%20guilds%20guilds.join`;

export { oauth2URL, ApiBaseURL, domain, recaptcha_sitekey };
