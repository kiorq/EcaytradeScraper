const minimist = require("minimist");

const validate = function(args) {
    const argv = minimist(args);

    if (!argv.term) {
        console.log(error("--term argument required"));
        return;
    }

    const searchTerm = argv.term;
    const keywordsLookup = (argv.keywords && argv.keywords.split(",")) || [];
    const keywordsExcluded = (argv.exclude && argv.exclude.split(",")) || [];
    const headless = argv.headless ? true : false;

    return { searchTerm, keywordsLookup, keywordsExcluded, headless };
};

module.exports = validate;
