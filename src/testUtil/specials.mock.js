export default function getSpecialsMock() {
  return [
    {
      skus: ['ipd'],
      type: 'priceDiscount',
      discountQty: 2,
      discountedPrice: 499.99,
    },
    {
      skus: ['mbp'],
      type: 'freeProduct',
      freeSKU: 'vga',
    },
    {
      skus: ['atv'],
      type: 'qtyDiscount',
      triggerQty: 3,
      freeQty: 1,
    },
  ];
}
