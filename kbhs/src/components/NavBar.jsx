import React from "react";
import "../assets/css/NavBar.css";
import { logo, navBarItems } from "../api-services/navBarItems";
import FadeInSection from "./FadeInSection";
import Home from "../pages/home/Home";
import {FaArrowDown} from "react-icons/fa";

const NavBar = ({ onClick }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = () => {
    setShowMenu(false);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const items = Object.entries(navBarItems);
  const visibleItems = items.slice(0, 5);
  const hiddenItems = items.slice(5);

  return (
    <FadeInSection>
      <div className="navbar">
        <nav className="navbar navbar-expand-lg navbar-dark">
          {/* Logo */}
          <a className="navbar-brand" href="/">
            <img className="logo-img" src={logo.src} alt={logo.alt} />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={showMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse justify-content-end ${
              showMenu ? "show" : ""
            }`}
            id="navbarNav"
            style={{ zIndex: 9999 }}
          >
            <ul className="navbar-nav">
              {visibleItems.map(([key, value]) => (
                <li className="nav-item" key={key} onClick={handleLinkClick}>
                  <a className="nav-link" href={`#${key}`}>
                    {value.toUpperCase()}
                  </a>
                </li>
              ))}
              {hiddenItems.length > 0 && (
                <li className="nav-item">
                  <button
                    className="nav-link-dropdown-button"
                    onClick={toggleDropdown}
                    aria-haspopup="true"
                    aria-expanded={showDropdown}
                  >
                    <FaArrowDown className="dropdown-icon" />
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu show">
                      {hiddenItems.map(([key, value]) => (
                        <a
                          className="dropdown-item"
                          href={`#${key}`}
                          key={key}
                          onClick={handleLinkClick}
                        >
                          {value.toUpperCase()}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
      <div className="d-md-none">
        <section id="home">
          <Home />
        </section>
      </div>
      <div className="d-none d-md-block">
        <section id="home">
          <Home />
        </section>
      </div>
    </FadeInSection>
  );
};

export default NavBar;