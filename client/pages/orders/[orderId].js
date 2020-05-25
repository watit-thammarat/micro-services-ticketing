import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  const [timeLef, setTimeLef] = useState(
    Math.ceil((new Date(order.expiresAt) - new Date()) / 1000),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLef(Math.ceil((new Date(order.expiresAt) - new Date()) / 1000));
    }, 1000);
    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, []);

  if (timeLef < 0) {
    return <div>Order Expires</div>;
  }

  return (
    <div>
      Time left to pay: {timeLef} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_nbcfVvmSAGozVXUAucSF2AhP00rysUnqnM'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);
  return { order };
};

export default OrderShow;
