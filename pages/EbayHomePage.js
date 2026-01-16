const BasePage = require('./BasePage');

class EbayHomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchBox = page.locator('#gh-ac');
    this.searchButton = page.locator('#gh-btn');
    this.searchResults = page.locator('a[href*="/itm/"]');
  }

  async goto() {
    await this.page.goto('https://www.ebay.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
  }

  async search(searchTerm) {
    await this.searchBox.fill(searchTerm);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  async clickFirstProduct() {
    await this.searchResults.first().click();
  }
}

module.exports = EbayHomePage;
