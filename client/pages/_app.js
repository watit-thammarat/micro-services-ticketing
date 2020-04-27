import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header {...pageProps} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const { data } = await buildClient(ctx).get('/api/users/currentuser');
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps: { ...pageProps, currentUser: data?.currentUser } };
};

export default AppComponent;
