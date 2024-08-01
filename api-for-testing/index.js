const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const url_toptv = "https://m.imdb.com/chart/toptv/";
const url_movies = "https://www.imdb.com/chart/top/";
const url_celebs = "https://www.imdb.com/chart/starmeter/";

async function getPageHTML(url) {
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

async function fetchTVShows() {
  const res = await getPageHTML(url_toptv);
  if (!res) {
    console.log("No response received");
    return [];
  }

  const $ = cheerio.load(res);
  const tvShows = [];

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
        tvShows.push({ title, rating, posterMini, datails });
      }
    }
  );

  return tvShows;
}

async function fetchMovies() {
  const res = await getPageHTML(url_movies);
  if (!res) {
    console.log("No response received");
    return [];
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

  return movies;
}

async function fetchCelebs() {
  const res = await getPageHTML(url_celebs);
  if (!res) {
    console.log("No response received");
    return [];
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

  return celebs;
}

app.get("/", (req, res) => {
  res.send(`
      <html>
        <head>
          <title>Top TV Shows API</title>
        </head>
        <body>
          <h1>Welcome to the Top TV Shows API</h1>
          <p>Use the endpoint <code>/tvshows</code> to get the list of top TV shows.</p>
          <p>Use the endpoint <code>/movies</code> to get the list of top TV shows.</p>
          <p>Use the endpoint <code>/celebs</code> to get the list of top TV shows.</p>
        </body>
      </html>
    `);
});

app.get("/tvshows", async (req, res) => {
  try {
    const tvShows = await fetchTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TV shows" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await fetchMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TV movies" });
  }
});

app.get("/celebs", async (req, res) => {
  try {
    const celebs = await fetchCelebs();
    res.json(celebs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TV celebs" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Resource not found" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
