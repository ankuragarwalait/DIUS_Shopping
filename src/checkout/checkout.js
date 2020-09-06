/**
 * checkout.js
 * @description This contains all the logic specific to the checkout process
 */

/* eslint-disable no-console */
import SpecialsProcessor from '../specials/specialsProcessor';

export default class Checkout {
  constructor(catalogue, specials) {
    this.catalogue = catalogue;
    this.specials = specials;
    this.cart = {};
  }

  /**
   * scan
   * @description Simulates an update to the shopping cart.
   * If item exists in the cart its quantity is updated else item is added to cart.
   * @param sku {string} The SKU of the item you wish to add
   * @returns {Checkout} Returns the Checkout object if we would like to leverage chaining.
   */
  scan(sku) {
    if (this.cart[sku]) {
      this.cart[sku].qty += 1;
    } else {
      this.addItemToCart(sku);
    }
    return this;
  }

  /**
   * addItemToCart
   * @description Adds a new item to the shopping cart.
   * Logs a warning message in case of invalid SKU ID. Doesn't throw JS error
   * for maitaining continuity in using the application.
   * Error handling can be more graceful but as of now simply logs a message.
   * @param sku
   * @returns {Checkout.cart} Returns the checkout's updated cart object for downstream systems.
   */
  addItemToCart(sku) {
    const item = this.catalogue.find((catalogueItem) => catalogueItem.sku === sku);

    if (!item) {
      console.warn(`Oops! No sku with ID: ${sku} was found in our catalog`);
      return false;
    }

    this.cart[sku] = {
      name: item.name,
      qty: 1,
      price: item.price,
      freeQty: 0,
    };

    return this.cart;
  }

  /**
   * total
   * @description Calculates grand total and prints billing summary.
   * Applies specials on eligible products based on configured specials rules.
   * Supports application of multiple specials to same product or same speical to multiple products.
   *
   * @return {grandTotal} The grand total price of the checkout instance.
   */
  total() {
    // Instantiate specials with reference to checkout.
    const specialFunctions = new SpecialsProcessor(this);

    let grandTotal = 0;

    // Loop over the cart and apply promos/specials for each item in the cart.
    Object.keys(this.cart).forEach((itemSKU) => {
      // More than one specials/promos could be applied to the same product.
      const applicableSpecials = this.specials.filter(({ skus }) => skus.indexOf(itemSKU) > -1);
      if (applicableSpecials.length > 0) {
        applicableSpecials.map((special) => specialFunctions[special.type](itemSKU, special));
      }

      // Pick the cart item after specials have been applied
      const { qty, price } = this.cart[itemSKU];

      /* Calculate the item's total price by multiplying the item price with the qty.
       * Rounded the total price to two decimal places just in case there is a decimal overflow.
      */
      const itemTotalPrice = Math.round(
        (price * qty * 100),
      ) / 100;

      grandTotal += itemTotalPrice;
    });

    console.log('\n\n-----------------------------Welcome To DIUS Shopping----------------------------\n');
    /*
     * This logic is repeated because free item added to cart as a result of applied special
     * would otherwise not get printed.
    */
    Object.keys(this.cart).forEach((itemSKU) => {
      const {
        name, qty, freeQty, price,
      } = this.cart[itemSKU];

      const itemTotalPrice = Math.round(
        (price * qty * 100),
      ) / 100;

      console.log(`Name: ${name}, Total Qty: ${qty + freeQty}, Total Price: ${itemTotalPrice.toFixed(2)}`);
      console.log('---------------------------------------------------------------------------------');
    });

    console.log(`Thank you for Shopping.\n\nYour total price payable is: ${grandTotal.toFixed(2)}`);
    console.log('---------------------------------------------------------------------------------');

    return grandTotal;
  }
}
