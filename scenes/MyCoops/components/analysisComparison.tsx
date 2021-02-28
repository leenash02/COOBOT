import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs, Table, Tag, Spin } from 'antd';
import groupBy from 'lodash/groupBy';
import forOwn from 'lodash/forOwn';

import UserProfileStore from '../../../stores/userProfileStore';
import Stores from '../../../stores/storeIdentifier';
import { WatsonDiscoveryResult, Entity, Category, Keyword } from '../../../services/userProfiles/dto/discoveryResult';


export interface IAnalysisComparisonProps {
  userProfileStore?: UserProfileStore;
  jobId: number;
}

export interface IAnalysisComparisonState {
  entitiesData: IEntityRow[];
  keywordsData: IKeywordRow[];
  categoriesData: ICategoryRow[];
  jobTitle: string;
  tableReady: boolean;
}

export interface IEntityRow {
  type: string;
  job: Entity[];
  resume: Entity[];
}
export interface ICategoryRow {
  job: Category[];
  resume: Category[];
}
export interface IKeywordRow {
  job: Keyword[];
  resume: Keyword[];
}

@inject(Stores.UserProfileStore)
@observer
class AnalysisComparison extends React.Component<IAnalysisComparisonProps, IAnalysisComparisonState> {

  constructor(props) {
    super(props);
    this.state = {
      entitiesData: [],
      keywordsData: [],
      categoriesData: [],
      jobTitle: '',
      tableReady: false
    };
  }


  async componentDidMount() {

    let entitiesData: IEntityRow[] = [];
    let keywordsData: IKeywordRow[] = [];
    let categoriesData: ICategoryRow[] = [];

    const { userProfileStore, jobId } = this.props;
    //Load user resume analysis result if not loaded
    if (!userProfileStore!.nluResults) {
      await userProfileStore!.getUserProfile();
    }

    //Load NLU results for the current job. 
    //Cast a copy of userProfileStore!.coops (type object) to type WatsonDiscoveryResult, so it's easier to handle.
    //Throughtout, we'll be copying anything coming from mobx store (objects and arrays) beacuse the mobx adds extra
    //un-needed properties to make the objects observable.
    const coops: WatsonDiscoveryResult = Object.assign({}, userProfileStore!.coops) as WatsonDiscoveryResult;
    const job = coops.results.find(r => r.extracted_metadata.filename === jobId + '.json');
    if (job) {
      //group by entity type. Result is {'type1': [entity, entity], 'type2': [entity], ...}
      const groupedJobEntities = groupBy(job.enriched_description.entities.slice(), (entity: Entity) => {
        return entity.type;
      });

      //parse entities from user resume 
      const userEntities: Entity[] = JSON.parse(userProfileStore!.nluResults)['entities'] as Entity[];
      const userCategories: Category[] = JSON.parse(userProfileStore!.nluResults)['categories'] as Category[];
      const userKeywords: Keyword[] = JSON.parse(userProfileStore!.nluResults)['keywords'] as Keyword[];

      //loop over the entity types
      forOwn(groupedJobEntities, (entities, type) => {
        //get the corresponding entity type from the resume and add it to the result
        //exclude Location and Person entities, because they're not needed here
        if (type !== "Location" && type !== "Person") {
          entitiesData.push({
            type: type,
            job: entities,
            resume: userEntities.filter(e => e.type === type)
          } as IEntityRow);
        }
      });

      //Get categories
      categoriesData.push({
        job: job.enriched_description.categories.slice(), /*slice() copies the array*/
        resume: userCategories
      } as ICategoryRow);

      //Get keywords
      keywordsData.push({
        job: job.enriched_description.keywords.slice(),
        resume: userKeywords
      } as IKeywordRow);

      //Save data to state
      this.setState({
        entitiesData: entitiesData, keywordsData: keywordsData, categoriesData: categoriesData,
        jobTitle: job.title, tableReady: true
      });

    }
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

  formatScore(score: number) {
    return parseInt((score * 100).toString()) + '%';
  }

  formatSkill(skillType) {
    //replace _ and capital letters with spaces
    return skillType.replace(/(_)/g, ' ').replace(/([A-Z])/g, ' $1')
      .replace('Self Described', 'Self-Described').replace('Technical Skills', 'Hard/Technical Skills');
  }

  render() {
    
    const entityColumns = [
      {
        title: 'The Job',
        render: (text, row, index) => {
          return (<div>
            <h4>{this.formatSkill(row['type'])}</h4>
            {row['job'].map(entity =>
              <Tag color={this.getColor(entity.confidence)}>{entity.text} {this.formatScore(entity.confidence)}</Tag>)}
          </div>);
        },
      },
      {
        title: 'Your Resume',
        dataIndex: 'job',
        render: (text, row, index) => {
          return (<div>
            <h4>{this.formatSkill(row['type'])}</h4>
            {row['resume'].map(entity =>
              <Tag color={this.getColor(entity.confidence)}>{entity.text} {this.formatScore(entity.confidence)}</Tag>)}
          </div>);
        },
      }
    ];

    const keywordsColumns = [
      {
        title: 'The Job',
        render: (text, row, index) => {
          return (<div>
            {row['job'].map(keyword =>
              <Tag color={this.getColor(keyword.relevance)}>{keyword.text} {this.formatScore(keyword.relevance)}</Tag>)}
          </div>);
        },
      },
      {
        title: 'Your Resume',
        dataIndex: 'job',
        render: (text, row, index) => {
          return (<div>
            {row['resume'].map(keyword =>
              <Tag color={this.getColor(keyword.relevance)}>{keyword.text} {this.formatScore(keyword.relevance)}</Tag>)}
          </div>);
        },
      }
    ];

    const CategoriesColumns = [
      {
        title: 'The Job',
        render: (text, row, index) => {
          return (<div>
            {row['job'].map(category =>
              <Tag color={this.getColor(category.score)}>{category.label} {this.formatScore(category.score)}</Tag>)}
          </div>);
        },
      },
      {
        title: 'Your Resume',
        dataIndex: 'job',
        render: (text, row, index) => {
          return (<div>
            {row['resume'].map(category =>
              <Tag color={this.getColor(category.score)}>{category.label} {this.formatScore(category.score)}</Tag>)}
          </div>);
        },
      }
    ];

    return (
      <React.Fragment>
        <h3>{this.state.jobTitle}</h3>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Skills" key="1">
            <Table columns={entityColumns} dataSource={this.state.entitiesData} bordered size="small" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Keywords" key="2">
            <Table columns={keywordsColumns} dataSource={this.state.keywordsData} bordered size="small" />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Categories" key="3">
            <Table columns={CategoriesColumns} dataSource={this.state.categoriesData} bordered size="small" />
          </Tabs.TabPane>
        </Tabs>
        {this.state.tableReady === false &&
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

export default AnalysisComparison;
