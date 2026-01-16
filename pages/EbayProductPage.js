const BasePage = require('./BasePage');

class EbayProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productTitle = page.locator('.x-item-title');
    this.productPrice = page.locator('.x-price-primary').first();
    this.relatedSection = page.locator('[class*="carousel"], [class*="related"], [class*="similar"]').first();
    this.relatedProducts = page.locator('[class*="carousel"] [class*="item"], [class*="related"] [class*="item"]');
  }

  async getProductPrice() {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }

  async isRelatedSectionVisible() {
    return await this.relatedSection.isVisible({ timeout: 10000 }).catch(() => false);
  }

  async getRelatedProductsCount() {
    return await this.relatedProducts.count();
  }

  async getRelatedProductTitle(index) {
    return await this.relatedProducts.nth(index).locator('[class*="title"]').textContent();
  }

  async getRelatedProductPrice(index) {
    const priceText = await this.relatedProducts.nth(index).locator('[class*="price"]').textContent();
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }

  async getRelatedProductImage(index) {
    return this.relatedProducts.nth(index).locator('img');
  }

  async getAllRelatedProductTitles() {
    const count = await this.getRelatedProductsCount();
    const titles = [];
    for (let i = 0; i < Math.min(count, 6); i++) {
      const title = await this.getRelatedProductTitle(i);
      titles.push(title.trim());
    }
    return titles;
  }
}

module.exports = EbayProductPage;
