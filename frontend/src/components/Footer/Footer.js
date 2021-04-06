import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              <a href="#">Health Monitoring</a>, monitoring your health
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
