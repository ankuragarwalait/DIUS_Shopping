/**
 *  SpecialsProcessor.js
 * @description Defines promotion rules and their implmentation mechanism
 * Any new promotion type that needs to be supported can be added here.
 * Initializes with current instance of checkout.
*/
export default class SpecialsProcessor {
  constructor(Checkout) {
    this.cart = Checkout.cart;
    this.catalogue = Checkout.catalogue;
    this.addItemToCart = Checkout.addItemToCart;
  }

  /**
  * @description Updates price of each unit based on a triggering quantity.
  * Sets new price as the discounted price.
  * @param: {itemSKU} SKU Id of the eligible product.
  * @param: {special: {discountQty: trigger quantity, discountedPrice: new price to be set}}
  */
  priceDiscount(itemSKU, { discountQty, discountedPrice }) {
    const { qty } = this.cart[itemSKU];

    if (qty > discountQty) {
      this.cart[itemSKU].price = discountedPrice;
    }
  }

  /**
  * @description Adds a free product to the cart for each quantity of the eligible product.
  * Readjusts quantity of the free product if it is already in cart.
  * @param: {itemSKU} SKU Id of the eligible product.
  * @param: {special: {freeSKU}} SKU ID of the product to be added for free}
  */
  freeProduct(itemSKU, { freeSKU }) {
    const { qty: primarySKUqty } = this.cart[itemSKU];

    // Add free sku to cart if not already present
    if (!this.cart[freeSKU]) {
      this.addItemToCart(freeSKU);
    }

    this.cart[freeSKU].freeQty += primarySKUqty;
    this.cart[freeSKU].qty -= primarySKUqty;

    // Avoid letting freeSKU qty fall below 0.
    if (this.cart[freeSKU].qty < 0) this.cart[freeSKU].qty = 0;
  }

  /**
  * @description Gives some quntity of the product for free if you buy more than a certain number.
  * Buy 3 for price of 2 and buy 6 for price of 4 supported.
  * @param: {itemSKU} SKU Id of the eligible product.
  * @param: {special:{triggerQty: Min Qty to be bought, freeQty: qty that would be free}}
  */
  qtyDiscount(itemSKU, { triggerQty, freeQty }) {
    const { qty } = this.cart[itemSKU];

    if (qty >= triggerQty) {
      const freeMultiple = Math.floor(qty / triggerQty);
      this.cart[itemSKU].qty -= (freeQty * freeMultiple);
      this.cart[itemSKU].freeQty = (freeQty * freeMultiple);
    }
  }
}
