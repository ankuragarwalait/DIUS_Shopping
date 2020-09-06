/**
 * specialsList.js
 * @description A collection of configured specials/offers.
 * Any data layer that can return data in JSON format can make this data available.
 */

const specialsList = [
  {
    skus: ['ipd'],
    type: 'priceDiscount',
    discountQty: 4,
    discountedPrice: 499.99,
  },
  {
    skus: ['mbp'],
    type: 'freeProduct',
    freeSKU: 'vga',
  },
  {
    skus: ['atv', 'mbp'],
    type: 'qtyDiscount',
    triggerQty: 3,
    freeQty: 1,
  },
];

export default specialsList;
