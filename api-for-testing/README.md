1. Install Dependencies

First, ensure you have the necessary dependencies installed:

```bash
npm install express axios cheerio fs
```

# Explanation
Setting Up Express:

```javascript
const express = require("express");
const app = express();
const port = 3000;
Fetching IMDb Page HTML:
```

```javascript
async function getPageHTML() {
  // Axios request to fetch HTML
}
```

Scraping TV Shows:

```javascript
async function fetchTVShows() {
  // Parse HTML using Cheerio
}
```

API Endpoint:

```javascript
app.get("/api/tvshows", async (req, res) => {
  try {
    const tvShows = await fetchTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TV shows" });
  }
});
```

Starting the Server:

```javascript
Copy code
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
Running the Server
Run the server with:
```

```bash
node server.js
```

Your server will be running at http://localhost:3000, and you can access the TV shows data at http://localhost:3000/api/tvshows. This endpoint will return the scraped IMDb top TV shows as a JSON response.