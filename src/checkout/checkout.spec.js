import Checkout from './checkout';
import catalogue from '../catalogue/catalogue';
import specialsList from '../specials/specialsList';

describe('CheckoutTest', () => {
  let co;

  beforeEach(() => {
    co = new Checkout(catalogue, specialsList);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds item to cart if product does not exist in cart', () => {
    const sku = 'atv';
    co.scan('atv');

    expect(co.cart[sku]).toEqual({
      name: 'Apple TV',
      price: 109.50,
      qty: 1,
      freeQty: 0,
    });
  });

  it('updates item quantity if product is already present in cart', () => {
    const sku = 'atv';
    co.scan('atv');
    co.scan('atv');

    expect(co.cart[sku]).toEqual({
      name: 'Apple TV',
      price: 109.50,
      qty: 2,
      freeQty: 0,
    });
  });

  it('invalid sku scan results in console warning', () => {
    const sku = 'test';
    co.scan(sku);

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith(`Oops! No sku with ID: ${sku} was found in our catalog`);
  });

  it('checkout supports chaining', () => {
    const total = co.scan('atv')
      .scan('atv')
      .scan('atv')
      .scan('vga')
      .total();

    expect(total).toBe(249);
  });

  it('total method returns grand total after applying specials to eligible products', () => {
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');

    expect(co.total()).toBe(2718.95);
  });

  it('checkout supports applying same special to multiple products and multiple specials to same product', () => {
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('mbp');
    co.scan('mbp');
    co.scan('mbp');
    co.total();

    expect(co.cart).toEqual({
      atv: {
        freeQty: 1,
        name: 'Apple TV',
        price: 109.5,
        qty: 2,
      },
      mbp: {
        freeQty: 1,
        name: 'MacBook Pro',
        price: 1399.99,
        qty: 2,
      },
      vga: {
        freeQty: 3,
        name: 'VGA adapter',
        price: 30,
        qty: 0,
      },
    });
  });
});
