import React from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import ReactModal from "react-modal";
import ErrorMessage from "./errorMessage.jsx";
// import { Mixpanel } from "./mixpanel.jsx";
import { Auth, PaymentHelper } from "../helpers";
import TermsofUse from "./termsofUse.jsx";
import ResponsiveLogo from "./responsiveLogo.jsx";
import API from "../api";
import notify from "../helpers/notifier";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "60vh",
    maxWidth: "50vw",
    overflow: "auto"
  }
};

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSigninOnChange = this.handleSigninOnChange.bind(this);
    this.handleSigninOnSubmit = this.handleSigninOnSubmit.bind(this);
    this.handleSigninOnKeyPress = this.handleSigninOnKeyPress.bind(this);
    this.handleOpenOutlookModal = this.handleOpenOutlookModal.bind(this);
    this.handleCloseOutlookModal = this.handleCloseOutlookModal.bind(this);
    this.handleCloseOutlookModalGranted = this.handleCloseOutlookModalGranted.bind(
      this
    );
    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
      isError: false,
      showModal: false,
      showOutlookModal: false,
      outlookAuth: false,
      isLoading: true,
      attachUrl: "",
      error: ""
    };
  }

  handleOpenOutlookModal() {
    // Mixpanel.track("Outlook permission modal opened signin");
    this.setState({
      showOutlookModal: true
    });
  }

  handleCloseOutlookModal() {
    // Mixpanel.track("Outlook permission modal closed taken from signin");
    this.setState({
      showOutlookModal: false
    });
  }

  handleCloseOutlookModalGranted() {
    // Mixpanel.track("Outlook permission modal closed taken to outlook signin");
    //location.href = `${this.state.attachUrl}`
  }

  handleSigninOnChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSigninOnSubmit(event) {
    event.preventDefault();
    this.postSignin();
  }

  handleSigninOnKeyPress(event) {
    const code = event.keyCode || event.which;
    if (code === 13) {
      // 13 is the enter keycode
      this.postSignin();
    }
  }

  handleOpenModal() {
    // Mixpanel.track("Terms of use opened in Sign in");
    this.setState({
      showModal: true
    });
  }

  handleCloseModal() {
    // Mixpanel.track("Terms of use closed in Sign in");
    this.setState({
      showModal: false
    });
  }

  postSignin() {
    const { username, password } = this.state;
    Auth.signin(username, password)
      .then(result => {
        if (result.status === 200) {
          // Mixpanel.identify(username);
          localStorage.clear();
          const accessToken = result.data.access_token;
          localStorage.setItem("token", result.data.access_token);
          localStorage.setItem("refreshToken", result.data.refresh_token);
          console.log(accessToken);
          API.get("user/status/", {
            headers: { Authorization: `Bearer ${accessToken}` }
          }).then(result => {
            notify('Login Success!', 'Hi ' + result.data.attachedEmail);
            if (result.data.isAttached === false) {
              API.get("payment/subscription/", {
                headers: { Authorization: `Bearer ${accessToken}` }
              }).then(result => {
                if (result.data.subscription_status !== "active") {
                  API.get("user/settings/", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                  }).then(result => {
                    // this.setState(
                    //   {
                    //     debugMode: result.data.debugMode
                    //   },
                    //   () => {
                    //     if (!this.state.debugMode) {
                    //       this.setState({
                    //         outlookAuth: true
                    //       });
                    //     }
                    //   }
                    // );
                  });
                }
              });
            } else {
              this.setState({
                outlookAuth: true
              });
            }
          });

          if (localStorage.getItem("token") !== undefined) {
            PaymentHelper.getSubscription().then(paymentResult => {
              if (paymentResult.status === 200) {
                Cookies.set(
                  "subscription_status",
                  paymentResult.data.subscription_status
                );
              }
              this.setState({ isLoading: false });
            });

            this.setState({
              isLoggedIn: true
            });
          }
        } else {
          this.setState({
            isError: true,
            error: "username or password is incorrect"
          });
        }
      })
      .catch(e => {
        console.log(e);
        this.setState({
          isError: true,
          error: e.response.data.error_description
        });
      });
  }

  componentDidMount() {
    // console.log("Signin");
    // Mixpanel.track("Sign in page opened");
  }

  render() {
    if (this.state.isLoggedIn && !this.state.isLoading) {
      return <Redirect to="/" />;
    }

    const { username, password } = this.state;

    return (
      <div style={{ padding: "100px" }} className="columns">
        <div className="column is-4 is-offset-4">
          <div className="container signin__container">
            <div className="has-text-centered">
              <a
                onClick={() => {
                  // Mixpanel.track("Went to zepto-ai.com from Sign in");
                  //location.href = 'https://www.zepto-ai.com/'
                }}
              >
                <ResponsiveLogo />
              </a>
            </div>
            <form style={{ marginTop: "10vh" }} className="signin__form">
              {this.state.isError && <ErrorMessage error={this.state.error} />}
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input__signin"
                        name="username"
                        value={username}
                        onChange={this.handleSigninOnChange}
                        type="email"
                        placeholder="Email Address"
                        onKeyPress={this.handleSigninOnKeyPress}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input__signin"
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.handleSigninOnChange}
                        placeholder="Password"
                        onKeyPress={this.handleSigninOnKeyPress}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="columns is-mobile">
                <div className="column has-text-centered">
                  <Link
                    to="/home"
                    className="button button--signin is-large"
                    onClick={this.handleSigninOnSubmit}
                    href="/home"
                  >
                    <span className="is-size-6">Log in</span>
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <div style={{ marginTop: "5vh" }}>
            <p
              onClick={this.handleOpenModal}
              className="has-text-black has-text-centered"
            >
              <a className="has-text-black has-text-weight-bold">
                Terms of use. Privacy policy
              </a>
            </p>
            <h1>asdas</h1>
          </div>
          <ReactModal
            isOpen={this.state.showModal}
            style={customStyles}
            contentLabel="Minimal Modal Example"
            onRequestClose={this.handleCloseModal}
          >
            <TermsofUse handle={this.handleCloseModal} />
          </ReactModal>
        </div>
      </div>
    );
  }
}
export default Signin;
