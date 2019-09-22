const screenshotPages = async function(browser = false) {
    if (browser) {
        // screenshot
        const activePages = await browser.pages();
        for (api = 0; api < activePages.length; api++) {
            const currentPage = activePages[api];
            const screenshotFilename = `screenshot_tab_${api}.png`;
            console.log("saving screenshot", screenshotFilename);
            await currentPage.screenshot({ path: screenshotFilename });
        }
    }
};

module.exports = {
    screenshotPages
};
