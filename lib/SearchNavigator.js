const Page = require("./Page");
const { BASE_URL } = require("./const");

class SearchNavigator extends Page {
    async loadMainPage() {
        const page = this.activePage();
        await page.goto(BASE_URL);
    }

    async searchFor(term) {
        const page = this.activePage();
        await page.waitForSelector("form.global-search");

        // type term in search box
        const input = await page.$("form.global-search input#input-global-search_1");
        await input.click({ clickCount: 3 });
        await input.type(term);

        // click search button
        const button = await page.$("form.global-search .btn-search");
        await button.click({ clickCount: 1 });
    }

    async getAdPreviews() {
        const htmlList = [];
        const page = this.activePage();
        await page.waitForSelector("ul.ads-list-dis-adblock li", {
            timeout: 15000
        });
        const items = await page.$$(".item");

        return items;
    }

    async nextPage() {
        const selector = "ul.pager.hide-mobile li.pager-next";
        const page = this.activePage();

        await page.waitForSelector(selector);
        const pager_next = await page.$(selector);

        // scroll to page
        await page.evaluate(function(element) {
            const pos = element.getBoundingClientRect();
            window.scrollBy(0, pos.top - 100);
        }, pager_next);
        await pager_next.click({ clickCount: 3 });
    }

    async isLastPage() {
        const page = this.activePage();

        const selector = "ul.pager.hide-mobile li.pager-next";
        const pager_next = await page.$(selector, { timeout: 3000 });

        // pager-next is not visible on the last page
        return pager_next == null;
    }
}

module.exports = SearchNavigator;
