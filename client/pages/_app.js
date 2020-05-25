import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header {...pageProps} />
      <div className='container'>
        <Component {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data?.currentUser);
  }
  return {
    pageProps: { ...pageProps, currentUser: data?.currentUser },
  };
};

export default AppComponent;
