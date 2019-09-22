const util = require("./lib/util");
const SearchNavigator = require("./lib/SearchNavigator");
const AdNavigator = require("./lib/AdNavigator");
const Scraper = require("./lib/Scraper");

const searchAndScrape = async function(browser, search_term) {
    const adsFounds = [];
    const searchPage = await browser.newPage();
    const mainNavigator = new SearchNavigator(searchPage);
    const scraper = new Scraper(searchPage);

    await mainNavigator.loadMainPage();
    await mainNavigator.searchFor(search_term);

    while (true) {
        // get all ad preview as elements
        const previews = await mainNavigator.getAdPreviews();
        // go through each preview
        for (let pi = 0; pi < previews.length; pi++) {
            const element = previews[pi];
            const previewInfo = await scraper.getPreviewInfo(element);

            const adPage = await browser.newPage();
            const adNavigator = new AdNavigator(adPage);

            // open ad and extract data
            await adNavigator.openAdPreview(previewInfo, element);

            if (!(await adNavigator.advertLoaded())) {
                // probably a 404, weird huh?
                continue;
            }

            const pageContentElements = await adNavigator.getPageContentElements();
            const adInfo = await scraper.getAdInfo(pageContentElements);

            if (adInfo.sold) {
                adsFounds.push(adInfo);
            }

            await adPage.close();
        }

        if (await mainNavigator.isLastPage()) {
            // we are on last page, we are done here
            break;
        }
        // go to next page
        await mainNavigator.nextPage();
    }

    return adsFounds;
};

module.exports = searchAndScrape;
