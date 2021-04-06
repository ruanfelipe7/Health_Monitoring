import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import BACK_URL from './../Variaveis';
// react-bootstrap components
import {
  ProgressBar,
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";

import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import Alert from 'react-bootstrap/Alert';

function Dashboard() {

  const [temperature, setTemperature] = useState(36);
  const [BPM, setBPM] = useState(65);
  const [ECG, setECG] = useState(0);
  const [oximeter, setOximeter] = useState(96);

  const [vecCharts, setVecCharts] = useState(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
  const [opVecCharts, setOpVecCharts] = useState(3);
  const [titleChart, setTitleChart] = useState("ECG");

  const controlCharts = (value) => {
    setVecCharts(["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]);
    setOpVecCharts(value);    
    switch (value) {
      case 0:
        setTitleChart("Temperature");
        break;
      case 1:
        setTitleChart("BPM");
        break;
      case 2:
        setTitleChart("Oximeter");
	break;
      case 3:
        setTitleChart("ECG");
    }
  }

  const verifyTemperature = (value) => {
    if (value >= 35 && value <= 36) {
      return "success";
    } else if (value > 36 && value < 38) {
      return "warning";
    }  else {
      return "danger"
    }
  }
  const verifyBPM = (value) => {
    if (value >= 60 && value <= 90) {
      return "success";
    } else if (value > 50 && value < 60) {
      return "warning";
    } else {
      return "danger"
    }
  }
  const verifyOximeter = (value) => {
    if (value >= 95 && value <= 100) {
      return "success";
    } else if (value >= 90 && value < 95) {
      return "warning";
    } else {
      return "danger"
    }    
  }
  useEffect(() => {
    const socket = socketIOClient(BACK_URL());
    socket.on("Temperature", data => {
    if(data.temperature < 70 ) {
      setTemperature(data.temperature);
      if (opVecCharts == 0) {
        setVecCharts(oldArray => [oldArray[1], oldArray[2], oldArray[3], oldArray[4], oldArray[5], oldArray[6], oldArray[7], oldArray[8], oldArray[9], oldArray[10], oldArray[11], oldArray[12], oldArray[13], oldArray[14], oldArray[15], oldArray[16], oldArray[17], oldArray[18], oldArray[19], oldArray[20], oldArray[21], oldArray[22], oldArray[23], oldArray[24], data.temperature]);
      }
    }      
    });

    socket.on("BPM", data => {
    if(data.BPM < 120) {
      setBPM(data.BPM);
      if (opVecCharts == 1) {
        setVecCharts(oldArray => [oldArray[1], oldArray[2], oldArray[3], oldArray[4], oldArray[5], oldArray[6], oldArray[7], oldArray[8], oldArray[9], oldArray[10], oldArray[11], oldArray[12], oldArray[13], oldArray[14], oldArray[15], oldArray[16], oldArray[17], oldArray[18], oldArray[19], oldArray[20], oldArray[21], oldArray[22], oldArray[23], oldArray[24], data.BPM]);
      }
    }
      
    });  

    socket.on("Oximeter", data => {
      if(data.oximeter <= 100) {
         setOximeter(data.oximeter);
         if (opVecCharts == 2) {
        setVecCharts(oldArray => [oldArray[1], oldArray[2], oldArray[3], oldArray[4], oldArray[5], oldArray[6], oldArray[7], oldArray[8], oldArray[9], oldArray[10], oldArray[11], oldArray[12], oldArray[13], oldArray[14], oldArray[15], oldArray[16], oldArray[17], oldArray[18], oldArray[19], oldArray[20], oldArray[21], oldArray[22], oldArray[23], oldArray[24], data.oximeter]);
      }
      }
      
    });

    socket.on("ECG", data => {
      setECG(data.ECG);
      if (opVecCharts == 3) {
        setVecCharts(oldArray => [oldArray[1], oldArray[2], oldArray[3], oldArray[4], oldArray[5], oldArray[6], oldArray[7], oldArray[8], oldArray[9], oldArray[10], oldArray[11], oldArray[12], oldArray[13], oldArray[14], oldArray[15], oldArray[16], oldArray[17], oldArray[18], oldArray[19], oldArray[20], oldArray[21], oldArray[22], oldArray[23], oldArray[24], data.ECG]);
      }
    });  

  }, [opVecCharts]);



  function alertTemperature() {
  
    if (temperature > 37.5 || temperature < 35) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Danger!</Alert.Heading>
          <p>
          Your are presenting a temperature problem.
        </p>
        </Alert>
      );
    }
  }

  function alertBPM() {
  
    if (BPM > 90 || BPM <= 50) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Danger!</Alert.Heading>
          <p>
            Your are presenting a heart problem.
        </p>
        </Alert>
      );
    }
  }

  function alertOximeter() {
  
    if (oximeter < 90) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Danger!</Alert.Heading>
          <p>
          Your are presenting a oxygen problem.
        </p>
        </Alert>
      );
    }
  }


  return (
    <>
      <Container fluid>
        {alertTemperature()}
        {alertBPM()}
        {alertOximeter()}
        <Row>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warnings">
                      <img
                        src={require("assets/img/iconCard/thermometer.png").default}
                        alt="..."
                      />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Temperature</p>
                      <Card.Title as="h4">{temperature}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated 
                  <br></br>
                  <CustomLinearProgress
                    variant="determinate"
                    color= {verifyTemperature(temperature)}
                    value={100}
                    style={{ width: ""+temperature+"%", display: "inline-block" }}
                  />                  
                </div>
              </Card.Footer>
            </Card>

          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warnings">
                      <img
                        src={require("assets/img/iconCard/cardiogram.png").default}
                        alt="..."
                      />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">BPM</p>
                      <Card.Title as="h4">{BPM}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated
                  <br></br>
                  <CustomLinearProgress
                    variant="determinate"
                    color= {verifyBPM(BPM)}
                    value={100}
                    style={{ width: ""+BPM+"%", display: "inline-block" }}
                  />
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warnings">
                      <img
                        src={require("assets/img/iconCard/oximetro.png").default}
                        alt="..."
                      />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Oximeter</p>
                      <Card.Title as="h4">{oximeter} %</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated
                  <br></br>
                  <CustomLinearProgress
                    variant="determinate"
                    color={verifyOximeter(oximeter)}
                    value={100}
                    style={{ width: ""+oximeter+"%", display: "inline-block" }}
                  />
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header className="adjustments-line d-flex align-items-center justify-content-between">
                <Card.Title as="h4">{titleChart}</Card.Title>
                <Dropdown >
                  <Dropdown.Toggle
                    style={{ border: "0", color: "#444" }}
                    data-toggle="dropdown"
                    id="dropdown-67443507"
                    variant="default"
                    className="m-0"
                  >
                    <i className="nc-icon nc-chart-bar-32"> Health Variable</i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => controlCharts(3)}
                    >
                      ECG
                </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => controlCharts(0)}
                    >
                      Temperature
                </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => controlCharts(1)}
                    >
                      BPM
                </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => controlCharts(2)}
                    >
                      Oximeter
                </Dropdown.Item>
                
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      // labels: [
                      //   "9:00AM",
                      //   "12:00AM",
                      //   "3:00PM",
                      //   "6:00PM",
                      //   "9:00PM",
                      //   "12:00PM",
                      //   "3:00AM",
                      //   "3:00AM",
                      //   "3:00AM",
                      // ],
                      series: [
                        vecCharts,
                      ],
                    }}
                    type="Line"
                    options={{
                      low: Math.min(vecCharts),
                      high: Math.max(vecCharts),
                      showArea: false,
                      height: "320px",
                      axisX: {
                        showGrid: false,
                      },
                      lineSmooth: true,
                      showLine: true,
                      showPoint: false,
                      fullWidth: true,
                      chartPadding: {
                        right: 50,
                      },
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  {titleChart}
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default Dashboard;
