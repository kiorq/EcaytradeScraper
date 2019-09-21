const chalk = require("chalk");
const searchAndScrape = require("./searchAndScrape");
const adFilter = require("./adFilter");
const validateArgs = require("./args");

const error = chalk.bold.red;
const info = chalk.keyword("green");
const { searchTerm, keywordsLookup, keywordsExcluded } = validateArgs(process.argv.slice(2));

(async function() {
    try {
        console.log(info(`Performing search for "${searchTerm}"`));

        const advertsFound = await searchAndScrape(searchTerm);
        const advertsFiltered = await adFilter(advertsFound, keywordsLookup, keywordsExcluded);

        advertsFound.forEach(function(adInfo) {
            console.log(info(`[${adInfo.metaData.id}] ${(adInfo.price && "$" + adInfo.price) || ""} ${adInfo.title}`));
        });
    } catch (err) {
        console.log(error(err));
        throw err;
    }
})();
