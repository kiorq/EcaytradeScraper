const puppeteer = require("puppeteer");
const util = require("./lib/util");
const SearchNavigator = require("./lib/SearchNavigator");
const AdNavigator = require("./lib/AdNavigator");
const Scraper = require("./lib/Scraper");

const searchAndScrape = async function(search_term) {
    const adsFounds = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
        const mainNavigator = new SearchNavigator(page);
        const scraper = new Scraper(page);

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
    } catch (err) {
        await browser.close();
        throw err;
    }
    // done
    await browser.close();

    return adsFounds;
};

module.exports = searchAndScrape;
