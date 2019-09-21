class Page {
    constructor(page) {
        if (!page) {
            throw new Error("Page required");
        }
        this.page = page;
    }

    activePage() {
        return this.page;
    }
}

module.exports = Page;
