/** index.js
* Entry point to the aaplication.
* Uses catalogue and specialsList to instantiate a new checkout.
*/

import Checkout from './src/checkout/checkout';
import catalogue from './src/catalogue/catalogue';
import specialsList from './src/specials/specialsList';

const co = new Checkout(catalogue, specialsList);
co.scan('atv');
co.scan('atv');
co.scan('atv');
co.scan('vga');
co.total();

const co1 = new Checkout(catalogue, specialsList);
co1.scan('atv');
co1.scan('ipd');
co1.scan('ipd');
co1.scan('atv');
co1.scan('ipd');
co1.scan('ipd');
co1.scan('ipd');
co1.total();

// supports chaining
const co2 = new Checkout(catalogue, specialsList);
co2.scan('mbp').scan('vga').scan('ipd').total();

// Multiple speicals on same product and same promo on multiple product scenario
const co3 = new Checkout(catalogue, specialsList);
co3.scan('atv');
co3.scan('atv');
co3.scan('atv');
co3.scan('mbp');
co3.scan('mbp');
co3.scan('mbp');
co3.total();
