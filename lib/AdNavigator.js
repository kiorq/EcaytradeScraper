const Page = require("./Page");
const { BASE_URL } = require("./const");

class AdNavigator extends Page {
    async openAdPreview(info, element) {
        const page = this.activePage();

        await page.goto(info.url);
    }

    async waitForSelector(selector, options) {
        const page = this.activePage();

        try {
            await page.waitForSelector(selector, options);
        } catch (err) {
            return false;
        }

        return true;
    }

    async advertLoaded() {
        // returns a boolean determining where advert page loaded
        // some ads may give a 404 even though they may show in
        // search results
        return await this.waitForSelector(".product--title", { timeout: 10000 });
    }

    async getPageContentElements() {
        const page = this.activePage();

        const productTitle = await page.$(".product--title h1");
        const productDescription = await page.$(".product--description");
        const priceBox = await page.$(".product--meta .price-box");
        const productMeta = await page.$(".product--meta");

        return {
            productTitle,
            productDescription,
            priceBox,
            productMeta
        };
    }
}

module.exports = AdNavigator;
