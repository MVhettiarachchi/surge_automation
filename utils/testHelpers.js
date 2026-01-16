const TEST_DATA = {
  searchTerm: 'Wallet',
  maxRelatedProducts: 6,
  priceRangeTolerance: 0.2,  // 20%
  categoryKeywords: ['wallet', 'purse', 'card holder', 'billfold']
};

function isPriceInRange(mainPrice, relatedPrice, tolerance = 0.2) {
  const minPrice = mainPrice * (1 - tolerance);
  const maxPrice = mainPrice * (1 + tolerance);
  return relatedPrice >= minPrice && relatedPrice <= maxPrice;
}

function isSameCategory(productTitle, keywords) {
  return keywords.some(keyword => productTitle.toLowerCase().includes(keyword));
}

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

module.exports = {
  TEST_DATA,
  isPriceInRange,
  isSameCategory,
  hasDuplicates
};
