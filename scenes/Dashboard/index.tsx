import * as React from 'react';
import { Row, Col, Card } from 'antd';
import { inject, observer } from 'mobx-react';
import './index.less';

import PersonalityInsightsChart from './components/PersonalityInsightsChart';
import UserProfileStore from '../../stores/userProfileStore';
import Stores from '../../stores/storeIdentifier';

export interface IDashboardProps {
  userProfileStore?: UserProfileStore;
}

@inject(Stores.UserProfileStore)
@observer
export class Dashboard extends React.Component<IDashboardProps> {

  async componentDidMount() {

    //destructuring: extracting userProfileStore out of this.props. Equivalent to this.props.userProfileStore but shorter!
    const { userProfileStore } = this.props;
    await userProfileStore!.getUserProfile();
  }


  render() {

    return (
      <React.Fragment>
        <Row gutter={16}>
          <Col>
            <Card title="My Personality Insights" className="text-align-center">
              {!!this.props.userProfileStore!.personalityInsights &&
                <div style={{ width: '85%', margin: 'auto' }}>
                  <PersonalityInsightsChart data={JSON.parse(this.props.userProfileStore!.personalityInsights)} />
                </div>
              }
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Dashboard;
