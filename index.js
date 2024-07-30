const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://www.imdb.com/chart/top/";

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

    const movies = [];

    $(".ipc-metadata-list-summary-item.sc-10233bc-0.TwzGn.cli-parent").each(
      (index, element) => {
        const titleElement = $(element).find(".ipc-title__text");
        const ratingElement = $(element).find(".ipc-rating-star--rating");
        const datailsElement = $(element).find(
          ".sc-b189961a-8.hCbzGp.cli-title-metadata-item"
        );
        const posterMiniElement = $(element).find(".ipc-image");

        const title = titleElement.text().split(". ")[1];
        const rating = ratingElement.text();
        const posterMini = posterMiniElement.attr("src");
        const datails = [];

        datailsElement.each((index, element) => {
          datails.push($(element).text().trim());
        });

        if (title && rating) {
          movies.push({ title, rating, posterMini, datails });
        }
      }
    );
    // movies variable has the data
    // put this data into a file
    fs.writeFile("top250movies.json", JSON.stringify(movies), (err) => {
      if (err) throw err;
      console.log("The JSON file has been created successfully!");
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
