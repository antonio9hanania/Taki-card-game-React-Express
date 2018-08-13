import React from 'react';
import ReactDOM from 'react-dom';
import Taki_Cards_Game_Logo from './resources/Taki_Cards_Game_Logo.png';
import haimShafir from './resources/haimShafir.jpg';

export default class LoginModal extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            errMessage: ""
        }

        this.handleLogin = this.handleLogin.bind(this);
    }

    render() {
        return (
            <div id="openingPage">
                <img src={Taki_Cards_Game_Logo} id="Taki_imeg" />
                <div id="Y&Alogo">
                    <h1>Y&A STUDIOS</h1>
                </div>
                <div className="login-page-wrapper">
                    <form onSubmit={this.handleLogin}>
                        <label className="username-label" htmlFor="userName"> name: </label>
                        <input className="username-input" name="userName" />
                        <input className="submit-btn btn" type="submit" value="Login" />
                    </form>
                </div>
                <div id="niceToKnow">
                    <img src={haimShafir} id="Haim_imeg" />
                    <h3>
                        An Israeli card game developed by the game developer Haim Shafir
					</h3>
                    <h4>
                        Immediately upon its publication in 1983, it became a bestseller
						and sold successfully in several countries, primarily Israel
					</h4>
                </div>
            </div>
        );
    }

    handleLogin(e) {
        e.preventDefault();
        const userName = e.target.elements.userName.value;
        if (userName == "")
            alert('Have to write uniq user name');
        else {

            fetch('/users/addUser', { method: 'POST', body: userName, credentials: 'include' })
                .then(response => {
                    if (response.ok) {
                        this.setState(() => ({ errMessage: "" }));
                        this.props.loginSuccessHandler();
                    } else {
                        if (response.status === 403) {
                            this.setState(() => ({ errMessage: "User name already exist, please try another one" }));
                        }
                        this.props.loginErrorHandler();
                    }
                });
        }
        return false;
    }
}