# IMDb Web Scrapers

**IMDb Web Scrapers** is a Node.js-based project designed to scrape top movies, series, actors and more data from the IMDb website. This tool automates the extraction of movie titles, ratings, poster images, and additional details from IMDb’s chart and saves it into a structured JSON file.

## Features

- **Extract Key Data**: Includes movie titles, ratings, poster image URLs, and additional details such as release year.
- **Data Storage**: Saves the extracted movie data into a JSON file for easy access and use.
- **Error Handling**: Handles network issues and data extraction problems gracefully.

## Technologies Used

- **Node.js**: JavaScript runtime environment for executing the script.
- **Axios**: HTTP client for making requests to the IMDb website.
- **Cheerio**: Library for parsing and manipulating HTML, making it easier to extract data.
- **File System (fs)**: Used to save the scraped data to a JSON file.

## How It Works

1. **Fetch HTML**: Uses `axios` to send an HTTP request to the IMDb Top 250 page.
2. **Parse HTML**: Utilizes `cheerio` to load and parse the HTML content.
3. **Extract Data**: Selects and extracts movie titles, ratings, poster URLs, and other details using appropriate CSS selectors.
4. **Save Data**: Writes the extracted data to a `top250movies.json` file using the `fs` module.

## Setup and Usage

1. **Install Dependencies**:

```bash
npm install axios cheerio
```

2. **Run the Script:**:

```bash
node scraper-name.js
```

3. **Check Results:**:

   The script will create a file.json in your working directory with the scraped movie data.

## Output Example

in Res folder

```bash
cd Res
```

```json
  {
    "title": "The Shawshank Redemption",
    "rating": "9.3",
    "posterMini": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_QL75_UX140_CR0,1,140,207_.jpg",
    "datails": [
      "1994",
      "2h 22m",
      "R"
    ]
  },
```

This project is useful for data analysis, research, or creating applications that leverage IMDb’s movie data.

# Code explaination 

1. Importing Required Modules

```js
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
```

2. Define the URL to Scrape

```js
const url = "https://m.imdb.com/chart/toptv/";
```

3. Function to Fetch the Page HTML

```js
async function getPageHTML() {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://www.google.com/",
      },
    });
    return html;
  } catch (error) {
    console.error("Error fetching the page: ", error.message);
  }
}
```

4. Calling the Function and Processing the Response

```js
getPageHTML()
  .then((res) => {
    if (!res) {
      console.log("No response received");
      return;
    }

    const $ = cheerio.load(res);

    const tvShows = [];

    $(".ipc-metadata-list-summary-item.sc-10233bc-0.TwzGn.cli-parent").each(
      (index, element) => {
        const titleElement = $(element).find(".ipc-title__text");
        const ratingElement = $(element).find(".ipc-rating-star--rating");
        const datailsElement = $(element).find(".sc-b189961a-8.hCbzGp.cli-title-metadata-item");
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

    fs.writeFile("Top250TVShows.json", JSON.stringify(tvShows), (err) => {
      if (err) throw err;
      console.log("The JSON file has been created successfully!");
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
```

- getPageHTML(): Calls the function to fetch the page HTML.
- then(res => { ... }): Processes the response once the HTML is fetched.
- if (!res) { ... }: Checks if the response is null or undefined and logs a message if it is.
- const $ = cheerio.load(res);: Loads the HTML into cheerio for parsing.
- const tvShows = [];: Initializes an empty array to store the TV show data.

5. Parsing the HTML Content

```js
$(".ipc-metadata-list-summary-item.sc-10233bc-0.TwzGn.cli-parent").each((index, element) => {
  const titleElement = $(element).find(".ipc-title__text");
  const ratingElement = $(element).find(".ipc-rating-star--rating");
  const datailsElement = $(element).find(".sc-b189961a-8.hCbzGp.cli-title-metadata-item");
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
});
```

- $(".ipc-metadata-list-summary-item.sc-10233bc-0.TwzGn.cli-parent").each(...): Selects each TV show item and iterates over them.
- titleElement, ratingElement, datailsElement, posterMiniElement: Finds and stores the relevant elements for the title, rating, details, and poster image.
- title = titleElement.text().split(". ")[1]: Extracts the title text and splits it to get the actual title.
- rating = ratingElement.text(): Extracts the rating text.
- posterMini = posterMiniElement.attr("src"): Extracts the source URL of the poster image.
- datailsElement.each(...): Iterates over the details elements and pushes the text to the datails array.
- if (title && rating) { ... }: Checks if both title and rating are present and then pushes the data to the tvShows array.

6. Writing the Data to a JSON File

```js
fs.writeFile("Top250TVShows.json", JSON.stringify(tvShows), (err) => {
  if (err) throw err;
  console.log("The JSON file has been created successfully!");
});
```
