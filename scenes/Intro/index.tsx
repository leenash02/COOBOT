import * as React from 'react';
import { Col, Row, Carousel } from 'antd';

import CoobotLogo from '../../images/coobot-logo-large.png';
import Conenctions from '../../images/coobot-connecting-ppl.png';
import { Link } from 'react-router-dom';

export interface IIntroState {
  step: number;
}

export class Into extends React.Component<any, IIntroState> {

  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };
  }


  onAfterChange(current) {
    this.setState({ step: current });
  }

  render() {

    return (
      <div className="carousel-wrapper">
        <Row>
          <Col>
            <Carousel
              className="bg-light-grey"
              effect="fade"
              dotPosition="right"
              afterChange={(current) => this.onAfterChange(current)}>
              <div className="carousel-slide">
                <Col span={12} className="bg-primary">
                  <Row type="flex" justify="space-around" align="middle">
                    <Col className="p-lg">
                      <h1>Welcome to COOBOT</h1>
                      <h2>A smart coop recommender</h2>
                      <Link to="/user/login" className="ant-btn ant-btn-default btn-slider">Get Started</Link>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col className="p-lg">
                      <img src={CoobotLogo} style={{ width: '100%' }} />
                    </Col>
                  </Row>
                </Col>
              </div>
              <div className="carousel-slide">
                <Col span={12} className="bg-primary">
                  <Row type="flex" justify="space-around" align="middle">
                    <Col className="p-lg">
                      <h1>Coop hunting made easy!</h1>
                      <h2>Our AI powered solution will help you narrow down your search by recommending the best coop opportunities</h2>
                      <Link to="/user/login" className="ant-btn ant-btn-default btn-slider">Try it out</Link>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col className="p-lg">
                      <img src={Conenctions} style={{ width: '100%' }} />
                    </Col>
                  </Row>
                </Col>
                </div>
              <div className="carousel-slide">
                <Col span={12} className="bg-primary">
                  <Row type="flex" justify="space-around" align="middle">
                    <Col className="p-lg">
                      <h1>What are you waiting for?</h1>
                      <h2>Start your journey to success</h2>
                      <Link to="/user/login" className="ant-btn ant-btn-default btn-slider">Try it out!</Link>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row type="flex" justify="space-around" align="middle">
                    <Col className="p-lg">
                      <img src={CoobotLogo} style={{ width: '100%' }} />
                    </Col>
                  </Row>
                </Col>
                </div>
            </Carousel>
            <div className="carousel-bg">
              <svg style={{ transform: `translateX(${((-1546 * this.state.step)) * 0.5}px)`, transition: "transform .5s cubic-bezier(.54, .01, .01, .97)", width: "4608px" }} height="812" viewBox="0 0 1334 812" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.04" cx="7.45492" cy="10.5942" r="29.9606" transform="rotate(-17.1266 7.45492 10.5942)" fill="#45788f"></circle>
                <circle opacity="0.04" r="21.3958" transform="matrix(-0.955656 0.294484 0.294484 0.955656 796.74 708.064)" fill="#45788f"></circle>
                <path opacity="0.1" d="M1334 422.136C1334 591.688 1196.55 729.136 1027 729.136C958.144 729.136 894.584 706.469 843.374 668.19C819.055 650.012 783.608 651.205 758.64 668.481C725.233 691.595 684.697 705.136 640.998 705.136C607.445 705.136 575.756 697.153 547.728 682.983C520.25 669.09 484.293 672.973 462.465 694.69C408.762 748.117 334.736 781.136 252.999 781.136C131.949 781.136 27.8134 708.718 -18.4473 604.843C-30.8698 576.948 -62.7405 560.426 -93.2684 561.095C-94.5094 561.123 -95.7537 561.136 -97.0011 561.136C-99.969 561.136 -102.919 561.059 -105.849 560.906C-143.502 558.94 -189.097 582.514 -206.144 616.145C-240.125 683.187 -309.697 729.136 -390.001 729.136C-448.794 729.136 -501.834 704.507 -539.366 665.002C-559.045 644.29 -591.103 636.586 -619.448 640.162C-624.542 640.805 -629.733 641.136 -635.001 641.136C-636.273 641.136 -637.541 641.117 -638.804 641.079C-668.551 640.175 -701.574 651.514 -717.596 676.594C-769.283 757.495 -859.877 811.136 -963 811.136C-1123.71 811.136 -1254 680.851 -1254 520.136C-1254 359.422 -1123.71 229.137 -963 229.137C-861.147 229.137 -771.516 281.464 -719.524 360.702C-703.197 385.584 -670.04 396.511 -640.307 395.249C-638.548 395.174 -636.779 395.136 -635.001 395.136C-628.007 395.136 -621.149 395.72 -614.473 396.842C-586.298 401.575 -553.959 395.195 -533.457 375.297C-496.366 339.299 -445.771 317.137 -390.001 317.137C-370.743 317.137 -352.103 319.779 -334.423 324.721C-298.115 334.87 -249.952 317.162 -225.989 288.058C-195.36 250.857 -148.951 227.137 -97.0011 227.137C-66.3984 227.137 -37.7183 235.368 -13.0541 249.738C13.3048 265.095 49.1008 266.051 73.3831 247.585C123.261 209.653 185.5 187.137 252.999 187.137C342.433 187.137 422.634 226.667 477.084 289.208C497.305 312.434 532.9 318.89 561.319 307.028C585.845 296.79 612.761 291.137 640.998 291.137C656.155 291.137 670.93 292.765 685.16 295.858C714.85 302.31 748.153 289.986 763.83 263.96C817.545 174.783 915.306 115.137 1027 115.137C1196.55 115.137 1334 252.585 1334 422.136Z" fill="#45788f"></path>
                <circle opacity="0.04" r="72.0831" transform="matrix(-0.955656 0.294484 0.294484 0.955656 520.11 161.251)" fill="#45788f"></circle>
              </svg>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Into;
