const searchAndScrape = require("./searchAndScrape");
const chalk = require("chalk");

const error = chalk.bold.red;
const info = chalk.keyword("green");

const run = async function(search_term, keywords = [], excluded_keywords = [], verbose = false) {
    try {
        console.log(info(`Performing search for "${search_term}"`));

        const advertsFound = await searchAndScrape(search_term);

        advertsFound.forEach(function(adInfo) {
            console.log(info(`[${adInfo.metaData.id}] ${(adInfo.price && "$" + adInfo.price) || ""} ${adInfo.title}`));
        });
    } catch (err) {
        console.log(error(err));
        throw err;
    }
};

SEARCH_TERM = "apartment";
KEYWORDS = ["deposit", "1 bedroom", "1 bed", "1 bd"];
EXCLUDED_KEYWORDS = ["east end", "north side"];

run(SEARCH_TERM, KEYWORDS, EXCLUDED_KEYWORDS);
