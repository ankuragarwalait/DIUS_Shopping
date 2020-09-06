# DIUS Shopping

An attempt to solving the problem given [here](https://github.com/DiUS/coding-tests/blob/master/dius_shopping.md).

This is a shopping cart application(without any UI) to simulate adding products to cart and applying any configured specials for those products.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all dependencies required to run the application.

```bash
npm install
```

## Running the application

Once the dependencies have been installed the application can be run using
```node
npm start
```

It runs four different scenarios from the index.js file. Remove/add scenarios to this file to run them.

## Adding a checkout scenario

### Instantiate Checkout
Instantiate a checkout with a list of catalogue items and specials.
```node
const co = new Checkout(catalogue, specialsList);
```

### Scan item
Pass sku Id of the product you wish to scan(add product to the cart).
```node
co.scan('atv'); // Use one of the eligible products from the the catalogue
```

Scan operations can also be chained
```node
co.scan('atv')
  .scan('mbp')
  .scan('ipd');
```

### Get Total
Get Grand Total of the products added to the cart after applying specials.
```node
co.total()
```
Prints Shopping summary in given format

```node
-----------------------------Welcome To DIUS Shopping----------------------------

Name: Apple TV, Total Qty: 3, Total Price: 219.00
---------------------------------------------------------------------------------
Name: VGA adapter, Total Qty: 1, Total Price: 30.00
---------------------------------------------------------------------------------
Thank you for Shopping.

Your total price payable is: 249.00
---------------------------------------------------------------------------------
```

## Testing
Repository uses jest as the preferred testing framework. More about jest can be found [here](https://jestjs.io/).

To create tests add a .spec.js file anywhere in your src folder.

To run tests
```node
npm run test
```

## Enhancements Added

Added a couple of functionalities to the stated requirements to make the system more intuitive.

- Added support to associate multiple specials to the same SKU or same SKU to be eligible for more than one special.
- It wasn't clear from the requirement if this is the case. The quantity discount makes products free in multiples. So **buy 3 at the price of 2** should also support **buy 6 at the price of 4**.

## The Thought Process
I have used the data sets in the form of JSON and since the system ultimately would get integrated with a database system I am assuming the data can be massaged and returned in the format utilised for this exercise.

Since pricing rules had to be flexible I have catalog in one place and specials in another. These could be combined as well with specials part of each catalog item but felt this was cleaner.

The checkout instance is initialised with a specials and catalogue data. Special Processor is the class that created special processing rules. The special processor class is instantiated with the current checkout object instance so that methods like *addItemtoCart* and the *catalog* are available to it.

 - When an item is scanned it is either added to the cart if it doesn't already exist or
its quantity is updated.
- Once all products that needed to be added are done we loop over the cart items and apply specials. The *type* attribute decides which method to execute from the specials.
- Specials methods get required payload and update the cart line item according to the configured rules.
- Cart summary is finally printed with the grand total.

**Note:** I had to loop over the cart items again because in cases where the free item doesn't already exist and it is added later the line item is not printed in the summary. Wasn't sure how to optimise this.
## Credits
 Thank you Dius Consulting for the opportunity to interview with you guys and the fun project.
Loved creating this.