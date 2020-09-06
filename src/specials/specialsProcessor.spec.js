import SpecialsProcessor from './specialsProcessor';
import getCartMock from '../testUtil/cart.mock';
import getSpecialsMock from '../testUtil/specials.mock';

describe('SpecialsProcessorTest', () => {
  let processor;
  let co;
  let addItemToCart;

  beforeEach(() => {
    addItemToCart = jest.fn();
    co = {
      cart: getCartMock(),
      addItemToCart,
    };

    jest.spyOn(co, 'addItemToCart').mockImplementation((sku) => {
      co.cart[sku] = {
        name: 'VGA adapter',
        price: 30.00,
        qty: 1,
        freeQty: 0,
      };
    });

    processor = new SpecialsProcessor(co);
  });

  describe('priceDiscountTest', () => {
    it('updates unit price if quantity is greater than discount quantity', () => {
      const special = getSpecialsMock()[0];
      const sku = 'ipd';
      processor.priceDiscount(sku, special);

      expect(co.cart[sku].price).toBe(499.99);
    });

    it('does not update unit price if quantity is less than discount quantity', () => {
      const special = { ...getSpecialsMock()[0], discountQty: 6 };
      const sku = 'ipd';
      processor.priceDiscount(sku, special);

      expect(co.cart[sku].price).toBe(549.99);
    });
  });

  describe('freeProductTest', () => {
    it('calls addItemToCart if free product is not already added', () => {
      const freeSKU = 'vga';
      const sku = 'mbp';
      const special = getSpecialsMock()[1];

      delete processor.cart[freeSKU];
      processor.freeProduct(sku, special);

      expect(processor.addItemToCart).toHaveBeenCalledWith(freeSKU);
    });

    it('adjusts free products quantity if free product is already present', () => {
      const freeSKU = 'vga';
      const sku = 'mbp';
      const special = getSpecialsMock()[1];

      processor.freeProduct(sku, special);

      expect(co.cart[freeSKU].qty).toBe(2);
      expect(co.cart[freeSKU].freeQty).toBe(3);
    });

    it('doesnot let free product quantity fall to negative if too many eligible products are added', () => {
      const freeSKU = 'vga';
      const sku = 'mbp';
      const special = getSpecialsMock()[1];

      processor.cart[freeSKU].qty = 2;
      processor.freeProduct(sku, special);

      expect(co.cart[freeSKU].qty).toBe(0);
      expect(co.cart[freeSKU].freeQty).toBe(3);
    });
  });

  describe('qtyDiscountTest', () => {
    it('does not update freeQty if qty is less than trigger quantity', () => {
      const sku = 'atv';
      const special = getSpecialsMock()[2];
      processor.cart[sku].qty = 2;
      processor.qtyDiscount(sku, special);

      expect(co.cart[sku].qty).toBe(2);
      expect(co.cart[sku].freeQty).toBe(0);
    });

    it('sets free quantity and updates quantity if purchased quantity is more than trigger quantity', () => {
      const sku = 'atv';
      const special = getSpecialsMock()[2];

      processor.qtyDiscount(sku, special);

      // Free Quantity is updated as multiple of eligible trigger quantity.
      expect(co.cart[sku].qty).toBe(5);
      expect(co.cart[sku].freeQty).toBe(2);
    });
  });
});
