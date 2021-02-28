import * as React from 'react';
import { Row, Col, Card, Icon, Spin, Tag } from 'antd';
import { inject, observer } from 'mobx-react';
import groupBy from 'lodash/groupBy';
import forOwn from 'lodash/forOwn';
import './index.less';

import UserProfileStore from '../../stores/userProfileStore';
import Stores from '../../stores/storeIdentifier';
import { Entity, Keyword, Category } from '../../services/userProfiles/dto/discoveryResult';

export interface IAnalysisProps {
  userProfileStore?: UserProfileStore;
}

export interface IAnalysisState {
  ready: boolean;
  userGroupedEntities: any;
  userCategories: Category[];
  userKeywords: Keyword[];
}

@inject(Stores.UserProfileStore)
@observer
export class Analysis extends React.Component<IAnalysisProps, IAnalysisState> {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      userGroupedEntities: {},
      userCategories: [],
      userKeywords: []
    }
  }

  async componentDidMount() {

    const { userProfileStore } = this.props;
    //Load user resume analysis result if not loaded
    if (!userProfileStore!.nluResults) {
      await userProfileStore!.getUserProfile();
    }

    //parse entities from user resume 
    const parsedResults = JSON.parse(userProfileStore!.nluResults);
    const userEntities: Entity[] = parsedResults['entities'] as Entity[];
    const userCategories: Category[] = parsedResults['categories'] as Category[];
    const userKeywords: Keyword[] = parsedResults['keywords'] as Keyword[];

    const groupedEntities = groupBy(userEntities, (entity: Entity) => {
      return entity.type;
    });

    this.setState({ ready: true, userGroupedEntities: groupedEntities, userCategories: userCategories, userKeywords: userKeywords });
  }


  formatScore(score: number) {
    return parseInt((score * 100).toString()) + '%';
  }

  formatSkill(skillType) {
    //replace _ and capital letters with spaces
    return skillType.replace(/(_)/g, ' ').replace(/([A-Z])/g, ' $1')
      .replace('Self Described', 'Self-Described').replace('Technical Skills', 'Hard/Technical Skills');
  }

  //Gets a color based on the score/confidence
  getColor(score: number) {
    if (score > 0.9) {
      return "geekblue";
    }
    else if (score > 0.8) {
      return "blue";
    }
    else if (score > 0.7) {
      return "green";
    }
    else if (score > 0.6) {
      return "cyan";
    }
    else {
      return "";
    }
  }

  render() {
   
    let keywordsCount: number = 0;
    let hardSkillsCount: number = 0;
    let softSkillsCount: number = 0;
    let categoriesCount: number = 0;

    const { userGroupedEntities } = this.state;

    if (userGroupedEntities) {
      hardSkillsCount = userGroupedEntities['TechnicalSkills'] ? userGroupedEntities['TechnicalSkills'].length : 0;
      softSkillsCount = userGroupedEntities['SelfDescribedSkills'] ? userGroupedEntities['SelfDescribedSkills'].length : 0;
    }
    if (this.state.userKeywords) {
      keywordsCount = this.state.userKeywords.length;
    }
    if (this.state.userCategories) {
      categoriesCount = this.state.userCategories.length;
    }

    const skills: any[] = [];
    forOwn(userGroupedEntities, (entities, type) => {

      let tags = entities.map((entity: Entity) => {
        if (entity.type !== 'Person') {
          return (
            <Tag className="mb-sm" color={this.getColor(entity.confidence)}>
              {entity.text} {this.formatScore(entity.confidence)}</Tag>
          );
        }
        else { return null }
      });

      skills.push(
        <Col span={12}>
          <h3 className="mb-sm">{this.formatSkill(type)}</h3>
          {tags}
        </Col>
      );

    });

    return (
      <React.Fragment>
        <Row gutter={16}>
          <Col
            className={'dashboardCard'}
            xs={{ offset: 1, span: 22 }}
            sm={{ offset: 1, span: 22 }}
            md={{ offset: 1, span: 11 }}
            lg={{ offset: 1, span: 11 }}
            xl={{ offset: 0, span: 6 }}
            xxl={{ offset: 0, span: 6 }}
          >
            <Card className={'dasboardCard-task'} bodyStyle={{ padding: 10 }} loading={this.state.ready === false} bordered={false}>
              <Col span={8}>
                <Icon className={'dashboardCardIcon'} type="rocket" />
              </Col>
              <Col span={16}>
                <p className={'dashboardCardName'}>
                  Hard Skills Identified
                </p>
                <label className={'dashboardCardCounter'}>
                  {hardSkillsCount}
                </label>
              </Col>
            </Card>
          </Col>
          <Col
            className={'dashboardCard'}
            xs={{ offset: 1, span: 22 }}
            sm={{ offset: 1, span: 22 }}
            md={{ offset: 1, span: 11 }}
            lg={{ offset: 1, span: 11 }}
            xl={{ offset: 0, span: 6 }}
            xxl={{ offset: 0, span: 6 }}
          >
            <Card className={'dasboardCard-ticket'} bodyStyle={{ padding: 10 }} loading={this.state.ready === false} bordered={false}>
              <Col span={8}>
                <Icon className={'dashboardCardIcon'} type="star" />
              </Col>
              <Col span={16}>
                <p className={'dashboardCardName'}>
                  Soft Skills Identified
                </p>
                <label className={'dashboardCardCounter'}>
                  {softSkillsCount}
                </label>
              </Col>
            </Card>
          </Col>
          <Col
            className={'dashboardCard'}
            xs={{ offset: 1, span: 22 }}
            sm={{ offset: 1, span: 22 }}
            md={{ offset: 1, span: 11 }}
            lg={{ offset: 1, span: 11 }}
            xl={{ offset: 0, span: 6 }}
            xxl={{ offset: 0, span: 6 }}
          >
            <Card className={'dasboardCard-comment'} bodyStyle={{ padding: 10 }} loading={this.state.ready === false} bordered={false}>
              <Col span={8}>
                <Icon className={'dashboardCardIcon'} type="key" />
              </Col>
              <Col span={16}>
                <p className={'dashboardCardName'}>
                  Keywords
                </p>
                <label className={'dashboardCardCounter'}>
                  {keywordsCount}
                </label>
              </Col>
            </Card>
          </Col>
          <Col
            className={'dashboardCard'}
            xs={{ offset: 1, span: 22 }}
            sm={{ offset: 1, span: 22 }}
            md={{ offset: 1, span: 11 }}
            lg={{ offset: 1, span: 11 }}
            xl={{ offset: 0, span: 6 }}
            xxl={{ offset: 0, span: 6 }}
          >
            <Card className={'dasboardCard-visitor'} bodyStyle={{ padding: 10 }} loading={this.state.ready === false} bordered={false}>
              <Col span={8}>
                <Icon className={'dashboardCardIcon'} type="appstore" />
              </Col>
              <Col span={16}>
                <p className={'dashboardCardName'}>
                  Categories
                </p>
                <label className={'dashboardCardCounter'}>
                  {categoriesCount}
                </label>
              </Col>
            </Card>
          </Col>
        </Row>

        <Row>
          <Card className={'dashboardBox'} title="My Resume Analysis" loading={this.state.ready === false} bordered={false}>
            {skills}
          </Card>
        </Row>

        <Row>
          <Card className={'dashboardBox'} title="Categories" loading={this.state.ready === false} bordered={false}>
            {this.state.userCategories.map(category =>
              <Tag className="mb-sm" color={this.getColor(category.score)}>{category.label} {this.formatScore(category.score)}</Tag>)}
          </Card>
        </Row>

        <Row>
          <Card className={'dashboardBox'} title="Keywords" loading={this.state.ready === false} bordered={false}>
            {this.state.userKeywords.map(keyword =>
              <Tag className="mb-sm" color={this.getColor(keyword.relevance)}>{keyword.text} ({keyword.count}) {this.formatScore(keyword.relevance)}</Tag>)}
          </Card>
        </Row>
        

        {this.state.ready === false &&
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
      </React.Fragment>
    );
  }
}

export default Analysis;
