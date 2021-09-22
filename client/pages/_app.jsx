import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);

    console.log("app.jsx getInitialProps called")
    console.log("app Context: ", appContext);
    console.log("Client: ", client);

    const response = await client.get('/api/users/currentuser').catch(err => console.log(err));

    // console.log("response from server: ", response);

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            client,
            response.data.currentUser
        );

        console.log("Components getInitialProps called")
    }

    return {
        pageProps,
        ...response.data,
    };
};

export default AppComponent;
