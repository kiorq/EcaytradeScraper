const Page = require("./Page");
const { BASE_URL } = require("./const");

class Scraper extends Page {
    async getPreviewPrice(preview_element) {
        try {
            return await preview_element.$eval(".price", e => e.innerText);
        } catch (error) {
            return null;
        }
    }

    async getPreviewInfo(previewElement) {
        const page = this.activePage();
        const title = await previewElement.$eval("h3", e => e.innerText);
        const price = await this.getPreviewPrice(previewElement);
        const path = await previewElement.$eval("a.visual", e => e.getAttribute("href"));
        const url = `${BASE_URL}${path}`;
        const searchResultUrl = page.url();

        return {
            title,
            price,
            path,
            url,
            id: parseInt(path.match(/[0-9]+$/)),
            searchResultUrl
        };
    }

    async _extractMetaData(productMeta) {
        const metaString = await productMeta.evaluate(e => e.innerText);
        const metaMatches = metaString.match(/[A-Za-z]+\ \:\ [A-Za-z0-9\.]+/g);
        const data = {};

        metaMatches.forEach(function(str) {
            const name = str
                .trim()
                .match(/([A-Za-z]+)\ \:/)[1]
                .toLowerCase();
            const value = str
                .trim()
                .match(/\: ([A-Za-z0-9\.\'\ \-]+)/)[1]
                .toLowerCase();

            data[name] = value;
        });

        return data;
    }

    async _extractPrice(priceBox) {
        if (!priceBox) {
            // has no price
            return null;
        }

        const priceString = await priceBox.evaluate(e => e.innerText);
        const price = parseInt(
            priceString
                .replace(",", "")
                .replace("$", "")
                .replace("KYD", "")
                .trim()
        );

        return price || null;
    }

    async _extractTitle(productTitle) {
        const titleString = await productTitle.evaluate(e => e.innerText);
        return titleString.toLowerCase().replace("(sold) ").trim;
    }

    async _extractSold(productTitle) {
        const titleString = await productTitle.evaluate(e => e.innerText);
        const soldMatchesFound = titleString.toLocaleLowerCase().match(/\(sold\)/);
        return soldMatchesFound && soldMatchesFound.length > 0 ? true : false;
    }

    async getAdInfo(pageContentElements) {
        const page = this.activePage();
        const { productTitle, productDescription, priceBox, productMeta } = pageContentElements;
        const title = await this._extractTitle(productTitle);
        const description = await productDescription.evaluate(e => e.innerText);
        const metaData = await this._extractMetaData(productMeta);
        const price = await this._extractPrice(priceBox);
        const sold = await this._extractSold(productTitle);

        return { title, description, metaData, price, sold };
    }
}

module.exports = Scraper;
