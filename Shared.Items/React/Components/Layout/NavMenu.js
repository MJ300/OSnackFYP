import React, { PureComponent } from "react";
import {
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./NavMenu.css";

import { LOGO_URL, AccessClaims } from "../../_CoreFiles/CommonJs/AppConst.Shared";
import { AdminNav, StaffNav, DefaultNav, ManagerNav } from './NavMenuItems';

import { getLogout } from '../../Redux/Actions/AuthenticationAction';


// Navigation menu component
class NavMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            smScreenNavIsOpen: false,
            myAccDropdownBool: false,
            HideMeLine: "",
            HideMeMango: " hideMe",
            CurrentNavItems: [],
            refreshNavItems: true
        };
        // used for auto hiding nav-bar and its drop-down list
        // in small screens
        this.toggleContainerNavBar = React.createRef(0);
        this.toggleContainerDropdown = React.createRef(1);

        // bind props with methods
        this.logout = this.logout.bind(this);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
    }
    componentDidMount() {
        window.addEventListener("click", this.onClickOutsideHandler);
    }
    componentWillUnmount() {
        window.removeEventListener("click", this.onClickOutsideHandler);
    }
    onClickOutsideHandler(event) {
        const { myAccDropdownBool, smScreenNavIsOpen } = this.state;
        // only if the drop-down menu is activated and the user clicks away from the menu
        try {
            if (
                myAccDropdownBool &&
                !this.toggleContainerDropdown.current.contains(event.target)
            ) {
                this.setState({ myAccDropdownBool: false });
            }
        } catch (e) { }

        // close Navigation menu in small screen when user clicks away from the menu (When user is logged in)
        // this is used so that the navigation menu is not closed when the drop-down items are selected
        try {
            if (
                smScreenNavIsOpen &&
                !this.toggleContainerDropdown.current.contains(event.target) &&
                !this.toggleContainerNavBar.current.contains(event.target)
            ) {
                this.setState({
                    smScreenNavIsOpen: !this.state.smScreenNavIsOpen,
                });
                this.setState({
                    HideMeLine: " ",
                    HideMeMango: " hideMe",
                });
            }
        } catch (e) {
            // if the user is NOT logged in the error is thrown
            // then try to hide the navigation menu in small screen
            try {
                if (
                    smScreenNavIsOpen &&
                    !this.toggleContainerNavBar.current.contains(event.target)
                ) {
                    this.setState({
                        smScreenNavIsOpen: !this.state.smScreenNavIsOpen,
                    });
                    this.setState({
                        HideMeLine: " ",
                        HideMeMango: " hideMe",
                    });
                }
            } catch (e) { }
        }
    }
    // Used to change the mobile nav span icon
    toggleNavbar() {
        this.setState({
            smScreenNavIsOpen: !this.state.smScreenNavIsOpen,
        });
        if (!this.state.smScreenNavIsOpen) {
            this.setState({
                HideMeLine: " hideMe",
                HideMeMango: "",
            });
        } else {
            this.setState({
                HideMeLine: "",
                HideMeMango: " hideMe",
            });
        }
    }

    async logout() {
        await this.props.getLogout();
        this.setState({ CurrentNavItems: DefaultNav, refreshNavItems: false });
    }

    render() {
        if (this.state.refreshNavItems) {
            /// Check which menu items to show for the user
            switch (this.props.Authentication.accessClaim) {
                case AccessClaims.Admin:
                    this.state.CurrentNavItems = AdminNav;
                    break;
                case AccessClaims.Manager:
                    this.state.CurrentNavItems = ManagerNav;
                    break;
                case AccessClaims.Staff:
                    this.state.CurrentNavItems = StaffNav;
                    break;
                default:
                    this.state.CurrentNavItems = DefaultNav;
                    break;
            }
        } else {
            this.state.refreshNavItems = true;
        }

        return (
            <header>
                <Navbar
                    className="bg-transparent navbar-expand-md navbar-toggleable-md mb-3 mt-0 pt-0"
                    light
                >
                    {/* Logo */}
                    <NavbarBrand tag={Link} to="/" className="logo-container">
                        <img src={LOGO_URL} alt="OSnack" className="Logo" />
                    </NavbarBrand>
                    {/* Small screen nav-bar toggle */}
                    <div ref={this.toggleContainerNavBar} className="w-100">
                        <NavbarToggler className="float-right">
                            <img
                                src={`/Images/MangoMenu.png`}
                                alt="Menu"
                                className={`Logo-sm ${this.state.HideMeMango}`}
                                onClick={this.toggleNavbar}
                            />
                            <span
                                className={`navbar-toggler-icon ${this.state.HideMeLine}`}
                                onClick={this.toggleNavbar}
                            ></span>
                        </NavbarToggler>
                        {/* Navbar items */}
                        <Collapse isOpen={this.state.smScreenNavIsOpen} navbar
                            className="d-lg-inline-flex flex-lg-row nav-text-container float-right" >
                            {/* user links */}
                            {this.state.CurrentNavItems.map(link => {
                                return (<NavLink key={link.id} tag={Link} className="text-dark text-nav word-break" to={link.path}>{link.displayName}</NavLink>);
                            })}
                            {this.props.Authentication.isAuthenticated &&
                                <div className="dropdown" ref={this.toggleContainerDropdown}>
                                    <NavLink className="text-nav align-middle text-underline dropdown-toggle"
                                        onClick={() => this.setState({ myAccDropdownBool: !this.state.myAccDropdownBool })}>
                                        My Account
                                    </NavLink>
                                    {this.state.myAccDropdownBool && (
                                        <span className={"dropdown-menu text-center dropdown-menu-right dropdown-span show"}>
                                            <Link className="dropdown-item text-nav"
                                                to="/MyAccount"
                                                children="Modify Account" />

                                            <a className="dropdown-item text-nav"
                                                onClick={this.logout}
                                                children='Logout' />
                                        </span>
                                    )}
                                </div>
                            }
                        </Collapse>
                    </div>
                </Navbar>
            </header>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        Authentication: state.Authentication
    };
};
const mapDispatchToProps = {
    getLogout
};
export default connect(mapStateToProps, (dispatch) =>
    bindActionCreators(mapDispatchToProps, dispatch)
)(NavMenu);
