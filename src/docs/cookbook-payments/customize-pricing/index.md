---
title: Customize pricing
slug: customize-pricing
updated: 2020-04-16
category: cookbook-payments
ingress:
  Flex allows lots of flexibility for your providers in terms of how
  they can set their pricing. This guide walks you through customizing
  listing pricing and processing the pricing calculations correctly
  during the transactions.
published: true
---

**NOTE! In case the version of FTW you are using is _earlier_ than
2.14.0, please refer to
[an older version](https://5ca7544a073eba00098460b9--sharetribe-flex-docs-site.netlify.com/docs/guides/how-to-customize-pricing/)
of this guide.**

This guide walks you through the process of taking custom pricing into
use by using the example of a common pricing adjustment: adding the
ability to charge an optional cleaning fee on top of the regular nightly
price of the accommodation. For more information about custom pricing
and pricing in Flex in general, refer to
[the custom pricing background article](/background/custom-pricing/).

## 1. Process change

To get started, the transaction process needs to be updated to support
custom pricing. The required change is to add the
`set-line-items-and-total` action to all the transitions that create a
booking. Using Flex CLI and the default nightly process, add the action
to the `transition/request-payment` and
`transition/request-payment-after-enquiry` transitions:

```diff
{:name :transition/request-payment,
 :actor :actor.role/customer,
 :actions
 [{:name :action/create-booking,
   :config {:observe-availability? true}}
- {:name :action/calculate-tx-nightly-total-price}
+ {:name :action/set-line-items-and-total}
  {:name :action/calculate-tx-provider-commission,
   :config {:commission 0.1M}}
  {:name :action/stripe-create-payment-intent}],
 :to :state/pending-payment}
{:name :transition/request-payment-after-enquiry,
 :actor :actor.role/customer,
 :actions
 [{:name :action/create-booking,
   :config {:observe-availability? true}}
- {:name :action/calculate-tx-nightly-total-price}
+ {:name :action/set-line-items-and-total}
  {:name :action/calculate-tx-provider-commission,
   :config {:commission 0.1M}}
  {:name :action/stripe-create-payment-intent}],
 :from :state/enquiry,
 :to :state/pending-payment}
```

To learn more about how to change the transaction process using Flex
CLI, see the
[Getting started with Flex CLI](/flex-cli/getting-started-with-flex-cli/)
tutorial.

> **Note**: `set-line-items-and-total` cannot be combined with other
> pricing actions that rely on the booking length or the quantity of
> units. In order to take custom pricing into use, price calculations
> that rely on booking length or quantity of units also need to be
> converted into using custom pricing. Commissions and price negotiation
> however don't require any changes as they can be combined with custom
> pricing.

## 2. Listing extended data

Custom pricing can be based on a lot of variables but one practical way
to build it is to base it on information stored as extended data in
listings. See the
[Extend listing data in FTW](/cookbook-data-model/extend-listing-data-in-ftw/)
cookbook to read how to extend the listing data model with extended
data.

For the sake of being able to follow this guide, you could add
hard-coded cleaningFee to EditListingPricingPanel:

```shell
└── src
    └── components
        └── EditListingPricingPanel
            └── EditListingPricingPanel.js
```

On submit, save price and cleaningFee:

```diff
   const form = priceCurrencyValid ? (
     <EditListingPricingForm
       className={css.form}
       initialValues={{ price }}
-      onSubmit={onSubmit}
+      onSubmit={values => {
+        const { price } = values;
+        const updatedValues = {
+          price,
+          publicData: { cleaningFee: { amount: 2000, currency: 'USD' } },
+        };
+        onSubmit(updatedValues);
+      }}
       onChange={onChange}
       saveActionMsg={submitButtonText}
       disabled={disabled}
```

## 3. Change current booking model to use custom pricing

The first step to do in FTW is to modify the current booking creation so
that custom pricing is used instead of the nightly or daily pricing. For
custom pricing, the booking is not constructed in the API based on
`bookingStart` and `bookinEnd` but it's based on line items that the
client sends in the booking initiation request.

Instead of the just listing ID, now we're going to pass the actual line
items in the transaction initiate request. To achieve this
`CheckoutPage` has to be modified a bit.

```shell
└── src
    └── containers
        └── CheckoutPage
            └── CheckoutPage.js
```

Add the following lines to the current imports at the top of the file:

```js
import { nightsBetween, daysBetween } from '../../util/dates';
import { types as sdkTypes } from '../../util/sdkLoader';

const { Money } = sdkTypes;
```

Then add the following method to the `CheckoutPageComponent` class:

```js
/**
 * Constructs a request params object that can be used when creating bookings
 * using custom pricing.
 * @param {} params An object that contains bookingStart, bookingEnd and listing
 * @return a params object for custom pricing bookings
 */

customPricingParams(params) {
  const { bookingStart, bookingEnd, listing, ...rest } = params;
  const { amount, currency } = listing.attributes.price;

  const unitType = config.bookingUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;

  const quantity = isNightly
    ? nightsBetween(bookingStart, bookingEnd)
    : daysBetween(bookingStart, bookingEnd);

  return {
    listingId: listing.id,
    bookingStart,
    bookingEnd,
    lineItems: [
      {
        code: unitType,
        unitPrice: new Money(amount, currency),
        quantity,
      },
    ],
    ...rest,
  };
}

```

When it's in place and the method is bind to `this` in constructor, it
can be used to resolve new kind of request params.

In the `loadInitialData` method:

```js
fetchSpeculatedTransaction(
  this.customPricingParams({
    listing,
    bookingStart: bookingStartForAPI,
    bookingEnd: bookingEndForAPI,
  })
);
```

And in `orderParams`. Note that instead of listing id you should add the
whole listing:

```js
const orderParams = this.customPricingParams({
  listing: pageData.listing,
  bookingStart: tx.booking.attributes.start,
  bookingEnd: tx.booking.attributes.end,
  ...optionalPaymentParams,
});
```

## 4. Add cleaning fee to the listing page UI

Next step is to modify the listing page UI so that a user can add a
cleaning fee to an order. After these changes the booking section of the
listing page in your marketplace looks like this:

![Booking dates form](./booking-dates-form.png)

This guide expects that the cleaning fee price is stored in listing
public data in an object with two keys: `amount` and `currency`. The
`amount` attribute holds the price in subunits whereas `currency` holds
the currency code. For example, with a cleaning fee of \$20 the subunit
amount is 2000 cents.

```js
publicData: {
  cleaningFee: { amount: 2000, currency: 'USD' }
}
```

Begin with making a few changes to the `util/types.js` and `en.json`
files (or some other transaltion file in case English is not the
language of your marketplace). In `util/types.js`, add a new line-item
code for the cleaning fee:

```shell
└── src
    └── util
        └── types.js
```

```js
export const LINE_ITEM_CLEANING_FEE = 'line-item/cleaning-fee';
```

> **Note**: When selecting a code for your custom line-item, remember
> that Flex requires the codes to be prefixed with _line-item/_ and the
> maximum length including the prefix is 64 characters. Other than that
> there are no restrictions but it's suggested that _kebab-case_ is used
> when the code consists of multiple words.

<extrainfo title="Should I add the LINE_ITEM_CLEANING_FEE to LINE_ITEMS array?">

If the line-item isn't included to the LINE_ITEMS array, it will be
rendered with `LineItemUnknownItemsMaybe` component in the
`BookingBreakdown` component. If you add the new line-item to the list,
it is considered as known item. In that case, you need to create your
own presentational component for it inside the `BookingBreakdown`
component.

</extrainfo>

We'll be adding an "Add cleaning" checkbox to the booking section on
listing page. Therefore, add the following translation to `en.json`:

```shell
└── src
    └── translations
        └── en.json
```

```json
"BookingDatesForm.cleaningFee": "Add cleaning",
```

In order to add the cleaning fee option to the booking form on listing
page, first add the following lines to the bottom of the imports in the
`BookingPanel` component:

```shell
└── src
    └── components
        └── BookingPanel
            └── BookingPanel.js
```

```js
import { types as sdkTypes } from '../../util/sdkLoader';
const { Money } = sdkTypes;
```

In the same `BookingPanel` component add the following code to the top
of the component, right under where the props object is destructured. It
will resolve the the price of the cleaning fee if one is defined for the
current listing:

```js
const cleaningFeeData = listing.attributes.publicData
  ? listing.attributes.publicData.cleaningFee
  : null;
const { amount: cleaningAmount, currency: cleaningCurrency } =
  cleaningFeeData || {};
const cleaningFee =
  cleaningAmount && cleaningCurrency
    ? new Money(cleaningAmount, cleaningCurrency)
    : null;
```

Also in `BookingPanel` add a submit handler function that converts a
checkbox form value into the actual cleaning fee of this listing:

```js
const handleSubmit = values => {
  const selectedCleaningFee =
    values &&
    values.additionalItems &&
    values.additionalItems[0] === 'cleaningFee'
      ? cleaningFee
      : null;
  onSubmit({
    ...values,
    cleaningFee: selectedCleaningFee,
  });
};
```

Pass `cleaningFee` and `handleSubmit` to the `BookingDatesForm`
component as follows:

```diff
    <BookingDatesForm
      className={css.bookingForm}
      formId="BookingPanel"
      submitButtonWrapperClassName={css.bookingDatesSubmitButtonWrapper}
      unitType={unitType}
-     onSubmit={onSubmit}
+     onSubmit={handleSubmit}
      price={price}
      isOwnListing={isOwnListing}
      timeSlots={timeSlots}
      fetchTimeSlotsError={fetchTimeSlotsError}
+     cleaningFee={cleaningFee}
    />
```

In the `BookingDatesForm` component file import the `FieldCheckbox`
component and the `formatMoney` utility function:

```shell
└── src
    └── forms
        └── BookingDatesForm
            └── BookingDatesForm.js
```

```diff
 import config from '../../config';
-import { Form, PrimaryButton, FieldDateRangeInput } from '../../components';
+import {
+  Form,
+  PrimaryButton,
+  FieldDateRangeInput,
+  FieldCheckbox,
+} from '../../components';
+import { formatMoney } from '../../util/currency';
 import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
```

Add a new entry to the component props map: `cleaningFee`. It holds the
price of the listing's cleaning fee in a `Money` object. Also we need to
resolve the current value for an `additionalItems` input in the form and
a label from the translations so that we can add an input for cleaning
fee to the form.

```diff
      timeSlots,
      fetchTimeSlotsError,
+     cleaningFee,
    } = fieldRenderProps;
    const { startDate, endDate } = values && values.bookingDates ? values.bookingDates : {};
```

To resolve the cleaning fee input's value from the form's value object,
add the following lines to the `render` function of the `FinalForm`
element in `BookingDatesForm`:

```js
const selectedCleaningFee =
  values &&
  values.additionalItems &&
  values.additionalItems.find(i => i === 'cleaningFee')
    ? cleaningFee
    : null;
```

Add the resolved `selectedCleaningFee` as a `cleaningFee` attribute to
the bookingData object:

```diff
const bookingData =
  startDate && endDate
    ? {
        unitType,
        unitPrice,
        startDate,
        endDate,

        // NOTE: If unitType is `line-item/units`, a new picker
        // for the quantity should be added to the form.
        quantity: 1,
+       cleaningFee: selectedCleaningFee,
      }
    : null;
```

Also add the following line inside the `BookingDatesForm` component
before the `return` statement:

```js
const cleaningFeeLabel = intl.formatMessage({
  id: 'BookingDatesForm.cleaningFee',
});
```

Now we can add an input for selecting a cleaning fee to be added to a
booking, for example right after the `FieldDateRangeInput` inside the
`Form` element:

<!-- prettier-ignore -->
```jsx
{cleaningFee ? (
  <div className={css.cleaningFee}>
    <FieldCheckbox
      className={css.cleaningFeeLabel}
      id={`${formId}.cleaningFee`}
      label={cleaningFeeLabel}
      name={'additionalItems'}
      value={'cleaningFee'}
    />
    <span className={css.cleaningFeeAmount}>{formatMoney(intl, cleaningFee)}</span>
  </div>
) : null}
```

The input can be styled by adding the following style definitions to
`BookingDatesForm.css`:

```css
.cleaningFee {
  margin: 0 24px 38px 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;

  @media (--viewportMedium) {
    margin: 0 0 38px 0;
  }
}

.cleaningFeeAmount {
  @apply --marketplaceListingAttributeFontStyles;
  font-weight: 600;
  margin: 0 0 0 10px;

  @media (--viewportMedium) {
    font-weight: 700;
    margin: 0 0 0 10px;
  }
}
```

The next task is to modify the `EstimatedBreakdownMaybe` component to
support the cleaning fee and add a new line item type to the booking
breakdown.

```shell
└── src
    └── forms
        └── BookingDatesForm
            └── EstimatedBreakdownMaybe.js
```

In the `EstimatedBreakdownMaybe` component:

- Import `LINE_ITEM_CLEANING_FEE` from `util/types.js`
- Spread the `cleaningFee` out of `props.bookingData`:

  ```js
    const EstimatedBreakdownMaybe = props => {
      const { unitType, unitPrice, startDate, endDate, quantity, cleaningFee } = props.bookingData;
  ```

- Add `cleaningFee` to the parameter list in the `estimatedTransaction`
  function definition and invocation.

  <!-- prettier-ignore -->
  ```js
  const tx = estimatedTransaction(unitType, startDate, endDate, unitPrice, quantity, cleaningFee);
  ```

Now the `estimatedTotalPrice` function can be renamed as
_"estimatedRentalPrice"_:

```diff
- const estimatedTotalPrice = (unitPrice, unitCount) => {
+ const estimatedRentalPrice = (unitPrice, unitCount) => {
    const numericPrice = convertMoneyToNumber(unitPrice);
    const numericTotalPrice = new Decimal(numericPrice).times(unitCount).toNumber();
    return new Money(
      convertUnitToSubUnit(numericTotalPrice, unitDivisor(unitPrice.currency)),
      unitPrice.currency
    );
  };
```

Then create a new `estimatedTotalPrice` function that includes
`cleaningFee`:

```js
const estimatedTotalPrice = (unitPrice, unitCount, cleaningFee) => {
  const numericPrice = convertMoneyToNumber(unitPrice);
  const cleaningFeePrice = cleaningFee
    ? convertMoneyToNumber(cleaningFee)
    : null;
  const numericTotalPrice = cleaningFeePrice
    ? new Decimal(numericPrice)
        .times(unitCount)
        .plus(cleaningFeePrice)
        .toNumber()
    : new Decimal(numericPrice).times(unitCount).toNumber();
  return new Money(
    convertUnitToSubUnit(
      numericTotalPrice,
      unitDivisor(unitPrice.currency)
    ),
    unitPrice.currency
  );
};
```

And the function invocation respectively:

```js
const totalPrice = estimatedTotalPrice(
  unitPrice,
  unitCount,
  cleaningFee
);
```

The line items list can now be resolved as follows inside the
`estimatedTransaction` function:

```js
const cleaningFeeLineItem = {
  code: LINE_ITEM_CLEANING_FEE,
  includeFor: ['customer', 'provider'],
  unitPrice: cleaningFee,
  quantity: new Decimal(1),
  lineTotal: cleaningFee,
  reversal: false,
};
const cleaningFeeLineItemMaybe = cleaningFee
  ? [cleaningFeeLineItem]
  : [];

const lineItems = [
  ...cleaningFeeLineItemMaybe,
  {
    code: unitType,
    includeFor: ['customer', 'provider'],
    unitPrice: unitPrice,
    quantity: new Decimal(unitCount),
    lineTotal: estimatedRentalPrice(unitPrice, unitCount),
    reversal: false,
  },
];
```

Finally add the `lineItems` array to the object returned by the
function.

```diff
  payoutTotal: totalPrice,
- lineItems: [
-   {
-     code: unitType,
-     includeFor: ['customer', 'provider'],
-     unitPrice: unitPrice,
-     quantity: new Decimal(unitCount),
-     lineTotal: totalPrice,
-     reversal: false,
-    },
-  ],
+  lineItems,
   transitions: [

```

Now the estimated transaction is updated with the cleaning fee. FTW by
default will render the added line item in the booking breakdown. It
manages that by humanizing the line item code and printing the line
total as the price on that row. The cleaning fee line item is also taken
into account in the possibly rendered sub total and refund rows. In case
you require a more complex handling for your line item in the booking
breakdown, you can achieve that by creating a new component for it and
placing it in the
[BookingBreakdown](https://github.com/sharetribe/flex-template-web/blob/master/src/components/BookingBreakdown/BookingBreakdown.js)
component. You can look for inspiration from the `LineItem*` component
files in the same folder. If you decide to customize the way your line
item is rendered in the breakdown, remember to add the line item code to
the `LINE_ITEMS` array in `util/types.js` so FTW will not treat it with
the default rendering.

The next step will be to pass the cleaning fee data to the transaction
initiation request.

## 5. Add the cleaning fee to the transaction

Now it's time to add the cleaning fee line item to the transaction
initiation request and then we're all set!

Import `LINE_ITEM_CLEANING_FEE` from `util/types.js` to the
`CheckoutPage.js` file and update the `customPricingParams` method we
added in step 3. to resolve the cleaning fee line item based on a
`cleaningFee` value passed in the method params:

```js
/**
 * Constructs a request params object that can be used when creating bookings
 * using custom pricing.
 * @param {} params An object that contains bookingStart, bookingEnd and listing
 * @return a params object for custom pricing bookings
 */

customPricingParams(params) {
  const { bookingStart, bookingEnd, listing, cleaningFee, ...rest } = params;
  const { amount, currency } = listing.attributes.price;

  const unitType = config.bookingUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;

  const quantity = isNightly
    ? nightsBetween(bookingStart, bookingEnd)
    : daysBetween(bookingStart, bookingEnd);

  const cleaningFeeLineItem = cleaningFee
    ? {
        code: LINE_ITEM_CLEANING_FEE,
        unitPrice: cleaningFee,
        quantity: 1,
      }
    : null;

  const cleaningFeeLineItemMaybe = cleaningFeeLineItem ? [cleaningFeeLineItem] : [];

  return {
    listingId: listing.id,
    bookingStart,
    bookingEnd,
    lineItems: [
      ...cleaningFeeLineItemMaybe,
      {
        code: unitType,
        unitPrice: new Money(amount, currency),
        quantity,
      },
    ],
    ...rest,
  };
}
```

Resolve the cleaning fee passed to `customPricingParams` before calling
it in `loadInitialData` and `handleSubmit` methods:

In `loadInitialData`:

```js
const cleaningFee = pageData.bookingData.cleaningFee;

fetchSpeculatedTransaction(
  this.customPricingParams({
    listing,
    bookingStart: bookingStartForAPI,
    bookingEnd: bookingEndForAPI,
    cleaningFee,
  })
);
```

Add the cleaning fee also to the `orderParams`:

```js
const cleaningFeeLineItem = speculatedTransaction.attributes.lineItems.find(
  item => item.code === LINE_ITEM_CLEANING_FEE
);
const cleaningFee = cleaningFeeLineItem
  ? cleaningFeeLineItem.unitPrice
  : null;

const orderParams = this.customPricingParams({
  listing: pageData.listing,
  bookingStart: tx.booking.attributes.start,
  bookingEnd: tx.booking.attributes.end,
  ...optionalPaymentParams,
  cleaningFee,
});
```

## 6. Validate booking price on transaction page

Custom pricing is a powerful tool that can be used for a plethora of
different pricing schemes. However, because the client side code can
freely construct the line items we can't fully trust that the price
calculation follows the model intended in the marketplace. In theory, a
marketplace user could make a direct API call to the Flex Marketplace
API and start a transaction with modified line items. To guard against
this, we recommend that you add a price validation component that will
notify the provider on the transaction page in case it seems that the
total payout of the booking does not follow the listing pricing.

Add the price validatio component by creating a new file named
`InvalidPriceMessageMaybe.js` in the `src/componets/TransactionPanel`
directory:

```shell
└── src
    └── componets
        └── TransactionPanel
            └── InvalidPriceMessageMaybe.js
```

```jsx
import React from 'react';
import Decimal from 'decimal.js';
import {
  LINE_ITEM_NIGHT,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';
import { nightsBetween, daysBetween } from '../../util/dates';
import { convertMoneyToNumber } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './TransactionPanel.css';

const { Money } = sdkTypes;

const InvalidPriceMessageMaybe = props => {
  const { transaction, listing, transactionRole, intl } = props;
  const loaded =
    transaction &&
    transaction.id &&
    transaction.booking &&
    transaction.booking.id;
  if (!loaded) {
    return null;
  }

  const unitType = config.bookingUnitType;

  const isProvider = transactionRole === 'provider';
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const { start, end } = transaction.booking.attributes;
  const quantity = isNightly
    ? nightsBetween(start, end)
    : daysBetween(start, end);

  // expected booking total
  const listingUnitPrice = listing.attributes.price;
  const listingNumericUnitPrice = convertMoneyToNumber(
    listingUnitPrice
  );
  const listingUnitTotal = new Decimal(listingNumericUnitPrice)
    .times(quantity)
    .toNumber();

  // expected cleaning fee total
  const listingCleaningFeeData =
    listing.attributes.publicData.cleaningFee;
  const { amount: cleaningAmount, currency: cleaningCurrency } =
    listingCleaningFeeData || {};
  const listingCleaningFeePrice =
    cleaningAmount && cleaningCurrency
      ? new Money(cleaningAmount, cleaningCurrency)
      : null;
  const listingCleaningFeeTotal = listingCleaningFeePrice
    ? convertMoneyToNumber(listingCleaningFeePrice)
    : null;

  // provider commission
  const providerCommissionLineItem = transaction.attributes.lineItems.find(
    item =>
      item.code === LINE_ITEM_PROVIDER_COMMISSION && !item.reversal
  );
  const providerCommissionTotal = providerCommissionLineItem
    ? convertMoneyToNumber(providerCommissionLineItem.lineTotal)
    : 0;

  // check that the expected booking total + cleaning fee + provider commission
  // match the payout total of the transaction
  const payoutTotal = convertMoneyToNumber(
    transaction.attributes.payoutTotal
  );
  const expectedPayoutTotal = new Decimal(listingUnitTotal)
    .plus(listingCleaningFeeTotal)
    .plus(providerCommissionTotal)
    .toNumber();
  const priceInvalid = expectedPayoutTotal !== payoutTotal;

  const message = intl.formatMessage({
    id: 'BookingBreakdown.invalidPrice',
  });
  const showMessage = isProvider && priceInvalid;
  return showMessage ? (
    <p className={css.invalidPriceMessage}>{message}</p>
  ) : null;
};

export default InvalidPriceMessageMaybe;
```

For styling and translations add the following styling to
`TransactionPanel.css`:

```css
.invalidPriceMessage {
  color: var(--failColor);

  margin: 16px 24px 0 24px;

  @media (--viewportLarge) {
    margin: 0 48px 32px 48px;
    padding: 5px 0 0 0;
  }
}
```

and the following line to `en.json`:

```json
"BookingBreakdown.invalidPrice": "The booking price does not match the listing. Please, check that the prices are correct!",
```

Take the component into use by importing it into `TransactionPanel` and
using it in two locations:

Inside the `<div className={css.bookingDetailsMobile}>` element, below
`BreakdownMaybe` for mobile screens:

<!-- prettier-ignore -->
```jsx
<div className={css.bookingDetailsMobile}>
  <AddressLinkMaybe
    rootClassName={css.addressMobile}
    location={location}
    geolocation={geolocation}
    showAddress={stateData.showAddress}
  />
  <BreakdownMaybe transaction={currentTransaction} transactionRole={transactionRole} />
  <InvalidPriceMessageMaybe
    transaction={currentTransaction}
    listing={currentListing}
    transactionRole={transactionRole}
    intl={intl}
  />
</div>
```

And the same snippet again under the second `BreakdownMaybe` inside the
<br />**`<div className={css.asideDesktop}>`** element for larger
viewports.

And that's it! Now the a cleaning fee line item can be added to a
transaction and it is treated just like the other line items when it
comes to cancellations and refunds.