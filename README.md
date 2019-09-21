# Ecaytrade Scraper
Scrape ecaytrade search results and filter them to give a more narrow defined result set.

### Requirements
- Node v8.12.0 or later

### How to run
`npm start -- --term shoes`

**Arguments**
- `--term shows`: Search term used to search in ecay trade

- `--keywords red,new`: Will narrow search results to ads that matches up with any or all of the keywords, organized by most keywords matched first

- `--exclude yellow,eastend`: Will exclude any ad that contains any of the keywords in exclude