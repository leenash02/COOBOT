import * as React from 'react';
import { Col, Row } from 'antd';

import connectionview from '../../images/connectionview.png';
import teamwork from '../../images/teamwork.jpg';
import COOBOTDiagram from '../../images/COOBOTDiagram.jpg';

export class About extends React.Component<any> {
  render() {
    return (
      <div className="content-wrapper" style={{ backgroundColor: '#fff' }}>
        <Row>
          <Col span={12}>
            <div className="p-lg">
              <h3>Coop hunting made easy.</h3>
              <p>As fellow grad students, we sympathize with the hussle you have to go through in order to land the best coop placement as quickly as possible.
              We realize the hunting journey is not easy, with a vast realm of companies to look into, a pressue to start your coop semester on time and a looming worry of whether or not company ABC is a good fit for you.
              That is the reason COOBOT exists. Our solution uses artificial intellignce to help you narrow down your scope of search, by recommending you the best suited opportunities based on some quick analysis of your resume/CV.</p>
            </div>
          </Col>
          <Col span={12}>
            <div style={{
              backgroundImage: `url(${connectionview})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPositionX: 'center',
              width: '100%',
              height: '250px'
            }}>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div style={{
              backgroundImage: `url(${teamwork})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPositionX: 'center',
              width: '100%',
              height: '250px'
            }}>
            </div>
          </Col>
          <Col span={12}>
            <div className="p-lg">
              <h3>Yup, it is that simple!</h3>
              <p>All you need to do is upload your resume/CV, optionally a cover letter if you have one at hand, thn sit back relaxed as COOBOT does its behind the scenes and fetches you interesting COOP recommendations.</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-lg p-lg">
              <h1 style={{ color: 'orange', fontSize: '24px', marginTop: '32px'}}>HOW CO.OBOT WORKS</h1>
              <p>
                The AI in COOBOT will analyze your resume twice, once to help you understand a bit more about your personality, values and needs from the way you express yourself in resumes or cover letters. The other analysis is to gain insights on your professional, technical and interpersonal skills. For each analysis, you will be assigned some scores.
                COOBOT will then recommend COOP placements from companies that have similar scores to yours.
                </p>
              <h1 style={{ color: 'orange', fontSize: '24px', marginTop: '32px' }}>
                What kind of personality analysis does COOBOT perform?
                </h1>
              <p>
                Our AI generates insights on your presonality based on the psychological theory of the Big 5 Personlaity Traits or OCEAN model.  A model developed to comprehend the relationship between personality and academic behaviors. These 5 traits are:
                </p>
              <ul>
                <li>Openness to experience (inventive/curious vs. consistent/cautious)</li>
                <li>Conscientiousness (efficient/organized vs. extravagant/careless)</li>
                <li>Extraversion (outgoing/energetic vs. solitary/reserved)</li>
                <li>Agreeableness (friendly/compassionate vs. challenging/callous)</li>
                <li>Neuroticism (sensitive/nervous vs. resilient/confident)</li>
              </ul>
              <div className="text-align-center">
                <img className="mt-lg" src={COOBOTDiagram} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default About;
