const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const url = "https://www.imdb.com/chart/starmeter/";

async function getPageHTML() {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://www.google.com/",
      },
    });
    return html;
  } catch (error) {
    console.error("Error fetching the page: ", error.message);
  }
}

getPageHTML()
  .then((res) => {
    if (!res) {
      console.log("No response received");
      return;
    }

    const $ = cheerio.load(res);

    const celebs = [];

    $(".ipc-metadata-list-summary-item").each((index, element) => {
      const nameElement = $(element).find(".ipc-title__text");
      const datailsElement = $(element).find(
        ".ipc-inline-list__item.sc-ada31d55-5.kwvPJV"
      );
      const imageElement = $(element).find(
          ".ipc-media.ipc-media--avatar.ipc-image-media-ratio--avatar.ipc-media--base.ipc-media--custom.ipc-media--avatar-circle.ipc-avatar__avatar-image.ipc-media__img img"
        );
        
        const name = nameElement.text();
        const image = imageElement.attr("src");
        const datails = [];
        
        datailsElement.each((index, element) => {
            datails.push($(element).text().trim());
        });
        
        if (name) {
            celebs.push({ name, image, datails });
        }
    });
    const folderPath = path.join(__dirname, "./Res");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    // console.log(celebs);
    // celebs variable has the data
    // put this data into a file
    fs.writeFile("./Res/MostPopularCelebs.json", JSON.stringify(celebs), (err) => {
      if (err) throw err;
      console.log("The JSON file has been created successfully!");
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
