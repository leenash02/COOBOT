import * as React from 'react';
import { inject, observer } from 'mobx-react';

import UserProfileStore from '../../stores/userProfileStore';
import Stores from '../../stores/storeIdentifier';
import { List, Avatar, Card, Typography, Tag, Button, Icon, Drawer, Tabs, Spin } from 'antd';
import CoopStore from '../../stores/coopStore';
import CustomBarChart from '../Dashboard/components/BarChartExample';
import AnalysisComparison from './components/analysisComparison';


export interface IMyCoopsProps {
  userProfileStore?: UserProfileStore;
  coopStore?: CoopStore;
}

export interface IMyCoopsState {
  piDrawerOpen: boolean;
  nluDrawerOpen: boolean;
  drawerReady: boolean;
  noPIDateForCurrentJob: boolean;
  big5ChartData: any;
  valuesChartData: any;
  needsChartData: any;
  maxResultCount: number;
  skipCount: number;
  currentJobId: number;
}

@inject(Stores.UserProfileStore, Stores.CoopStore)
@observer
export class MyCoops extends React.Component<IMyCoopsProps, IMyCoopsState> {

  drawerContainerRef: any;

  constructor(props) {
    super(props);
    this.state = {
      piDrawerOpen: false,
      nluDrawerOpen: false,
      drawerReady: false,
      noPIDateForCurrentJob: false,
      big5ChartData: [],
      valuesChartData: [],
      needsChartData: [],
      maxResultCount: 5,
      skipCount: 0,
      currentJobId: 0
    };
  }

  async componentDidMount() {
    await this.getCoopsIfNeeded();
  }

  async getCoopsIfNeeded() {
    const { userProfileStore } = this.props;
    if (!userProfileStore!.coops && userProfileStore!.isLoading === false) {
      await userProfileStore!.getCoopsForUser({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount });
    }
  }

  async getJobInsights(filename) {
    //Open the drawer to show the comparison
    this.setState({ piDrawerOpen: true, drawerReady: false });

    let big5ChartData: any[] = [];
    let needsChartData: any[] = [];
    let valuesChartData: any[] = [];

    const { userProfileStore, coopStore } = this.props;
    //Load user personality insights - if not loaded
    if (!userProfileStore!.personalityInsights) {
      await userProfileStore!.getUserProfile();
    }
    //Load personality insights of the selected job
    let jobId = filename.split('.')[0];
    await coopStore!.getCoopInsights(jobId);

    const jobInsight = coopStore!.coopInsights.find(j => j.jobId == jobId);
    if (!jobInsight || !jobInsight!.personalityInsights) {
      this.setState({ noPIDateForCurrentJob: true, drawerReady: true });
      return;
    }
    //parse the json string
    let job;
    try {
      job = JSON.parse(jobInsight!.personalityInsights);
    }
    catch (err) {
      this.setState({ noPIDateForCurrentJob: true, drawerReady: true });
      return;
    }

    const traits = job['personality'];
    const values = job['values'];
    const needs = job['needs'];

    //Get the user's big5, values and needs
    const userBig5 = userProfileStore!.getUserBig5;
    const userValues = userProfileStore!.getUserValues;
    const userNeeds = userProfileStore!.getUserNeeds;

    //merge the user and the job scores
    for (let i = 0; i < userBig5.length; i++) {
      //Get corresponding big 5 measure from job
      let jobPI = traits.find(j => j['trait_id'] === userBig5[i]['trait_id']);
      big5ChartData.push({ ...userBig5[i], Job: (parseFloat(jobPI['raw_score']) * 100).toFixed(2) });
    }

    for (let i = 0; i < userValues.length; i++) {
      let jobPI = values.find(j => j['trait_id'] === userValues[i]['trait_id']);
      valuesChartData.push({ ...userValues[i], Job: (parseFloat(jobPI['raw_score']) * 100).toFixed(2) });
    }

    for (let i = 0; i < userNeeds.length; i++) {
      let jobPI = needs.find(j => j['trait_id'] === userNeeds[i]['trait_id']);
      needsChartData.push({ ...userNeeds[i], Job: (parseFloat(jobPI['raw_score']) * 100).toFixed(2) });
    }

    this.setState({
      drawerReady: true, noPIDateForCurrentJob: false,
      big5ChartData, needsChartData, valuesChartData, currentJobId: jobId
    });
  }

  getJobAnalysis(filename: string) {
    let jobId = filename.split('.')[0];
    this.setState({ nluDrawerOpen: true, drawerReady: true, currentJobId: parseInt(jobId) });
  }

  //Saves a reference to the container <div> when it loads
  onDrawerContainerRef = (div) => {
    this.drawerContainerRef = div;
  }

  handlePagination = (newPageNumber: number | undefined, pageSize: number | undefined) => {
    if (typeof newPageNumber !== 'undefined') {
      this.setState({ skipCount: (newPageNumber - 1) * this.state.maxResultCount },
        async () => await this.props.userProfileStore!.getCoopsForUser({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount }));
    }
  };

  render() {
    
    const { userProfileStore } = this.props;
    let listData = [];

    if (userProfileStore!.coops && userProfileStore!.coops.matching_results > 0) {
      listData = userProfileStore!.coops.results;
    }

    let total = !!userProfileStore!.coops ? userProfileStore!.coops.matching_results : 0;

    return (
      <div style={{ position: 'relative' }} ref={this.onDrawerContainerRef}>
        <Card title={`Opportunities you might be interested in${total > 0 ? ' (found ' + total + ')' : ''}`}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: this.state.maxResultCount,
              total: total,
              defaultCurrent: 1,
              onChange: this.handlePagination
            }}
            loading={userProfileStore!.isLoading === true}
            dataSource={listData}
            renderItem={item => (
              <List.Item
                key={item['title']}
                actions={[
                  <Button
                    style={{ backgroundColor: '#0072b1', color: '#fff' }}
                    href={item['url']} target="_blank"
                    icon="linkedin">View on Linkedin</Button>,
                  <Button
                    type="primary"
                    onClick={() => this.getJobInsights(item['extracted_metadata']['filename'])}>Personality Insights</Button>,
                  <Button
                    type="primary"
                    onClick={() => this.getJobAnalysis(item['extracted_metadata']['filename'])}>COOBOT's Analysis</Button>
                ]}
                extra={
                  <div className="score-extra">
                    <span>Confidence<br />{parseInt((parseFloat(item['result_metadata']['confidence']) * 100.00).toString())}%</span>
                  </div>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#2d5469', verticalAlign: 'middle' }} icon={<Icon type="profile" />} />}
                  title={<span><a href={item['url']}>{item['title']}</a><small className="ml-md"><Icon type="calendar" /> {item['date']}</small></span>}
                  description={
                    <span><b>{item['company']}</b> - {item['location']}&nbsp;&nbsp;&nbsp;<Tag>{`Level: ${item['level']}`}</Tag>
                      <Tag>{`Type: ${item['type']}`}</Tag>
                    </span>}
                />
                <Typography.Paragraph ellipsis={{ rows: 4 }}>
                  {item['description']}
                </Typography.Paragraph>
              </List.Item>
            )}
          />
        </Card>
        <Drawer
          title="How good of a match am I?"
          placement="right"
          closable={true}
          onClose={() => this.setState({ piDrawerOpen: false, nluDrawerOpen: false })}
          visible={this.state.piDrawerOpen || this.state.nluDrawerOpen}
          style={{ position: 'absolute' }}
          getContainer={this.drawerContainerRef}
          width="800px"
        >
          <div>
            {this.state.piDrawerOpen === true &&
              <div>
                <h3>How it works?</h3>
                <p>
                  Our AI will analyze this job's description to discover its personality traits, needs and values. It'll then compare the results with the ones it got from analyzing your resume.
                </p>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Personality Traits" key="1">
                    <CustomBarChart data={this.state.big5ChartData} dataKey1="You" dataKey2="Job" width={700} height={350} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Needs" key="2">
                    <CustomBarChart data={this.state.needsChartData} dataKey1="You" dataKey2="Job" width={700} height={350} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Values" key="3">
                    <CustomBarChart data={this.state.valuesChartData} dataKey1="You" dataKey2="Job" width={700} height={350} />
                  </Tabs.TabPane>
                </Tabs>
              </div>
            }
            {this.state.nluDrawerOpen === true &&
              <div>
                <AnalysisComparison jobId={this.state.currentJobId} />
              </div>
            }
            {this.state.drawerReady === false &&
              <div className="center-flex-container"
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  top: '0px', bottom: '0px', left: '0px', right: '0px'
                }}>
                <div style={{ paddingTop: 100, textAlign: 'center' }}>
                  <Spin size="large" />
                </div>
              </div>
            }
            {this.state.noPIDateForCurrentJob === true &&
              <div className="center-flex-container"
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  top: '0px', bottom: '0px', left: '0px', right: '0px'
                }}>
                <div style={{ textAlign: 'center', color: 'red' }}>
                <p>Sorry, we could not get the personality insights for this job.</p>
                <p>The likely cause is that the number of words in the job description is less than Watson's minimum.</p>
                </div>
              </div>
            }
          </div>
        </Drawer>
      </div>
    );
  }
}
export default MyCoops;
