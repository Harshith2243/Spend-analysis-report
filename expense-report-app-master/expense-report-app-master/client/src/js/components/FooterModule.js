import React, { Component } from 'react';
import { Footer } from 'react-materialize';

import '../../styles/component-styles/Footer.css';

class FooterModule extends Component {
  render() {
    return (
      <Footer
        copyrights="© 2026 ExpenseFlow"
        moreLinks={
          <a className="footer-link" href="#!">Need help?</a>
        }
        links={
          <ul>
            <li><a className="footer-link" href="https://facebook.com">Facebook</a></li>
            <li><a className="footer-link" href="http://instagram.com">Instagram</a></li>
            <li><a className="footer-link" href="https://gmail.com">Email</a></li>
          </ul>
        }
        className="modern-footer"
      >
        <h5 className="white-text">Stay on top of every expense</h5>
        <span className="grey-text text-lighten-4">A calmer, clearer way to manage your spending.</span>
      </Footer>
    );
  }
}

export default FooterModule;
