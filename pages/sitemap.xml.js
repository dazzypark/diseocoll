//pages/sitemap.xml.js
const { ApiBaseURL } = require("../settings");

function generateSiteMap({ guild_json, bot_json }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://diseocoll.com/</loc>
     </url>
     ${guild_json
       .map((id) => {
         return `
       <url>
           <loc>${`https://diseocoll.com/servers/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
       ${bot_json
         .map((id) => {
           return `
        <url>
            <loc>${`https://diseocoll.com/bots/${id}`}</loc>
        </url>
      `;
         })
         .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const guild_load = await fetch(`${ApiBaseURL}/api/v1/guilds/loadGuilds`, {
    method: "POST",
    body: JSON.stringify({ mode: "sitemaps" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const guild_json = await guild_load.json();

  const bot_load = await fetch(`${ApiBaseURL}/api/v1/bots/loadBots`, {
    method: "POST",
    body: JSON.stringify({ mode: "sitemaps" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const bot_json = await bot_load.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap({
    guild_json: guild_json.guilds,
    bot_json: bot_json.bots,
  });

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
