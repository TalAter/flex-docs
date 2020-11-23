import React from 'react';
import { Carousel, CarouselSlide as Slide } from '../../components';

import IMG_TRANSACTION_STATES from './transaction-states.png';
import IMG_REQUESTED from './transaction-page-requested.png';
import IMG_REQUEST from './transaction-page-request.png';

const CarouselTxnProcessUX = props => {
  return (
    <Carousel {...props} maxWidth="480px">
      <Slide imgSrc={IMG_TRANSACTION_STATES} imgAlt="asdf">
        <h3>Transaction States</h3>
        <p>
          According to the graph, this user interaction, or transaction, has reached the preauthorized state. The next possible steps are to an accepted or declined state.{''}
        </p>
      </Slide>
      <Slide imgSrc={IMG_REQUESTED} imgAlt="asdf">
        <h3>Sellers' perpective</h3>
        <p>
          Here we see what a transaction in a preauthorized state looks like in Saunatime. Specifically, we are in the inbox of the transaction’s provider. The buyer has just made a request to book our sauna.
        </p>
        <p>
          As our transaction process determines, the provider has  three options: they can accept the booking (moving the transaction to  accepted) or decline it (moving the transaction to declined). They can also not do anything, and the transaction will move to the declined state in the transaction process. 
        </p>
      </Slide>
      <Slide imgSrc={IMG_REQUEST} imgAlt="asdf">
        <h3>Buyers' perspective</h3>
        <p>
          This is what the customer’s inbox looks like at the same time. The buyer can message the provider, but they have no way to transition the transaction. Our graph clarifies why this is: preauthorized state does not expect any customer initiated transitions. 
        </p>
      </Slide>
    </Carousel>
  );
};

export default CarouselTxnProcessUX;
