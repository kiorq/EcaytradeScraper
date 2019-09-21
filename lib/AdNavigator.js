const Page = require("./Page");
const { BASE_URL } = require("./const");

class AdNavigator extends Page {
    async openAdPreview(info, element) {
        const page = this.activePage();

        await page.goto(info.url);
    }

    async getPageContentElements() {
        const page = this.activePage();
        // wait
        await page.waitForSelector(".product--title");

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
