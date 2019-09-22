const puppeteer = require("puppeteer");
const chalk = require("chalk");
const { screenshotPages } = require("./lib/util");
const searchAndScrape = require("./searchAndScrape");
const adFilter = require("./adFilter");
const validateArgs = require("./args");

const error = chalk.bold.red;
const info = chalk.keyword("green");
const { searchTerm, keywordsLookup, keywordsExcluded } = validateArgs(process.argv.slice(2));

(async function() {
    let browser = null;
    try {
        console.log(info(`Performing search for "${searchTerm}"`));
        // start up browser
        browser = await puppeteer.launch({ headless: true });

        const advertsFound = await searchAndScrape(browser, searchTerm);
        const advertsFiltered = await adFilter(advertsFound, keywordsLookup, keywordsExcluded);

        advertsFound.forEach(function(adInfo) {
            console.log(info(`[${adInfo.metaData.id}] ${(adInfo.price && "$" + adInfo.price) || ""} ${adInfo.title}`));
        });
    } catch (err) {
        console.log(error(err));
        await screenshotPages(browser);
        throw err;
    } finally {
        // close down browser
        browser && (await browser.close());
    }
})();
