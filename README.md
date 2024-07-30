# IMDb Web Scrapers

**IMDb Web Scrapers** is a Node.js-based project designed to scrape movie data from the IMDb Top 250 list. This tool automates the extraction of movie titles, ratings, poster images, and additional details from IMDb’s Top 250 chart and saves it into a structured JSON file.

## Features

- **Scrape IMDb Top 250 List**: Retrieve movie information from IMDb's Top 250 chart.
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