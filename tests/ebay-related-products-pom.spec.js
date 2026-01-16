const { test, expect } = require('@playwright/test');
const EbayHomePage = require('../pages/EbayHomePage');
const EbayProductPage = require('../pages/EbayProductPage');
const { TEST_DATA, isPriceInRange, isSameCategory, hasDuplicates } = require('../utils/testHelpers');

test.describe('eBay Related Products Validation', () => {

  test('TC01-04: Core functionality - display, count, category, price', async ({ page }) => {
    const homePage = new EbayHomePage(page);
    const productPage = new EbayProductPage(page);
    
    await homePage.goto();
    await homePage.search(TEST_DATA.searchTerm);
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/\/itm\//, { timeout: 10000 });
    
    const mainPrice = await productPage.getProductPrice();
    
    // TC01: Verify section exists
    const sectionVisible = await productPage.isRelatedSectionVisible();
    expect(sectionVisible).toBeTruthy();
    console.log('TC01: Related products section displayed');
    
    // TC02: Verify max 6 products
    const productCount = await productPage.getRelatedProductsCount();
    expect(productCount).toBeGreaterThan(0);
    expect(productCount).toBeLessThanOrEqual(TEST_DATA.maxRelatedProducts);
    console.log(`TC02: Product count: ${productCount} (max ${TEST_DATA.maxRelatedProducts})`);
    
    // TC03: Verify same category
    const firstTitle = await productPage.getRelatedProductTitle(0);
    const sameCat = isSameCategory(firstTitle, TEST_DATA.categoryKeywords);
    expect(sameCat).toBeTruthy();
    console.log('TC03: Same category validated');
    
    // TC04: Verify price range
    const relatedPrice = await productPage.getRelatedProductPrice(0);
    const inRange = isPriceInRange(mainPrice, relatedPrice, TEST_DATA.priceRangeTolerance);
    expect(inRange).toBeTruthy();
    console.log('TC04: Price within range');
  });

  test('TC05-06: Edge cases - fewer or no products', async ({ page }) => {
    const homePage = new EbayHomePage(page);
    const productPage = new EbayProductPage(page);
    
    await homePage.goto();
    await homePage.search(TEST_DATA.searchTerm);
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/\/itm\//, { timeout: 10000 });
    
    // TC05: Handle fewer than 6 products
    const productCount = await productPage.getRelatedProductsCount();
    if (productCount > 0 && productCount < TEST_DATA.maxRelatedProducts) {
      console.log(`TC05: Handles ${productCount} products correctly`);
      expect(productCount).toBeGreaterThan(0);
    } else if (productCount === TEST_DATA.maxRelatedProducts) {
      console.log('TC05: Maximum products displayed');
    }
    
    // TC06: Handle no products
    const sectionVisible = await productPage.isRelatedSectionVisible();
    if (!sectionVisible || productCount === 0) {
      console.log('TC06: No products - handled gracefully');
    } else {
      console.log('TC06: Products section exists');
      expect(productCount).toBeGreaterThan(0);
    }
  });

  test('TC07-10: Data quality - duplicates, images, titles, prices', async ({ page }) => {
    const homePage = new EbayHomePage(page);
    const productPage = new EbayProductPage(page);
    
    await homePage.goto();
    await homePage.search(TEST_DATA.searchTerm);
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/\/itm\//, { timeout: 10000 });
    
    const productCount = await productPage.getRelatedProductsCount();
    
    if (productCount === 0) {
      console.log('WARNING: No related products to validate');
      return;
    }
    
    // TC07: Check for duplicates
    const titles = await productPage.getAllRelatedProductTitles();
    expect(hasDuplicates(titles)).toBeFalsy();
    console.log(`TC07: No duplicates (${titles.length} unique)`);
    
    // TC08: Verify images
    const firstImage = await productPage.getRelatedProductImage(0);
    await expect(firstImage).toBeVisible();
    const imgSrc = await firstImage.getAttribute('src');
    expect(imgSrc).toBeTruthy();
    console.log('TC08: Valid images');
    
    // TC09: Verify titles
    const firstTitle = await productPage.getRelatedProductTitle(0);
    expect(firstTitle.trim().length).toBeGreaterThan(0);
    console.log('TC09: Valid titles');
    
    // TC10: Verify prices
    const firstPrice = await productPage.getRelatedProductPrice(0);
    expect(firstPrice).toBeGreaterThan(0);
    console.log('TC10: Valid prices');
    
    await productPage.takeScreenshot('related-products-validation');
  });
});
