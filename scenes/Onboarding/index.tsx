import * as React from 'react';
import { Steps, Card, Upload, Icon, Row, Col, Button, Result, message } from 'antd';
import { inject, observer } from 'mobx-react';
import ReactTimeout from 'react-timeout';

import UserUploadStore from '../../stores/userUploadStore';
import Stores from '../../stores/storeIdentifier';
import ExtractedTextForm from './extractedTextForm';
import UserUpload from '../../services/userUploads/dto/userUpload';
import UploadImg from '../../images/upload.jpg';

const { Step } = Steps;

export interface IOnboardingProps {
  userUploadStore?: UserUploadStore;
  history?: any;
  /*props injected by ReactTimeout*/
  setTimeout?: any;
  clearTimeout?: any;
  setInterval?: any;
  clearInterval?: any;
  setImmediate?: any;
  clearImmediate?: any;
  requestAnimationFrame?: any;
  cancelAnimationFrame?: any;
}

export interface IOnboardingState {
  currentStep: number;
  resumeFile: any;
  coverLetterFile: any;
  progress: number;
  resumeUploadFailed: boolean;
  letterUploadFailed: boolean;
  finishedAllSteps: boolean;
}


@inject(Stores.UserUploadStore)
@observer
export class Onboarding extends React.Component<IOnboardingProps, IOnboardingState> {

  //Keeps a reference to the extracted text form so we can submit the form from this component
  formRef: any;

  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      resumeFile: [],
      coverLetterFile: [],
      progress: 0,
      resumeUploadFailed: false,
      letterUploadFailed: false,
      finishedAllSteps: false
    };
  }

  uploadResume = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const { userUploadStore } = this.props;

    const fmData = new FormData();
    const onUploadProgress = event => {
      const percent = Math.floor((event.loaded / event.total) * 100);
      this.setState({ progress: percent });
      onProgress({ percent: (event.loaded / event.total) * 100 });
    };
    fmData.append("file", file);
    fmData.append("uploadType", 'resume');
    userUploadStore!.uploadResume(fmData, onUploadProgress)
      .then(() => {
        //Uploaded succeeded
        onSuccess("Ok");
        message.success('Success!');
        this.setState({ progress: 0, resumeUploadFailed: false, currentStep: 1 });
      })
      .catch((err) => {
        onError({ err });
        userUploadStore!.resumeUploading = false;
        this.setState({ resumeUploadFailed: true });
      });

  };

  uploadCoverLetter = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const { userUploadStore } = this.props;

    const fmData = new FormData();
    const onUploadProgress = event => {
      const percent = Math.floor((event.loaded / event.total) * 100);
      this.setState({ progress: percent });
      onProgress({ percent: (event.loaded / event.total) * 100 });
    };
    fmData.append("file", file);
    fmData.append("uploadType", 'letter');
    userUploadStore!.uploadCoverLetter(fmData, onUploadProgress)
      .then(() => {
        //Uploaded succeeded
        onSuccess("Ok");
        message.success('Success!');
        this.setState({ progress: 0, letterUploadFailed: false });
        this.moveToFinalStep();
      })
      .catch((err) => {
        onError({ err });
        userUploadStore!.letterUploading = false;
        this.setState({ letterUploadFailed: true });
      });

  };

  moveToFinalStep() {
    const { userUploadStore } = this.props;
    //bind the extracted text form
    this.formRef.props.form.setFieldsValue({
      resumeText: userUploadStore!.resume ? userUploadStore!.resume.extractedText : "",
      letterText: userUploadStore!.coverLetter ? userUploadStore!.coverLetter.extractedText : ""
    });
    this.setState({ currentStep: 2 });
  }

  onFinalStepSubmit = () => {
    //Save the modified extracted text
    const form = this.formRef.props.form;
    const { userUploadStore, history } = this.props;
    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }
      else {
        //update the resume text if it changed
        if (userUploadStore!.resume?.extractedText != values.resumeText) {
          let updated: UserUpload = userUploadStore!.resume as UserUpload;
          updated.extractedText = values.resumeText;
          await userUploadStore!.update(updated);
        }

        //update the cover letter if there's one
        if (userUploadStore!.coverLetter && userUploadStore!.coverLetter.extractedText != values.letterText) {
          let updated: UserUpload = userUploadStore!.coverLetter as UserUpload;
          updated.extractedText = values.letterText;
          await userUploadStore!.update(updated);
        }

        this.setState({ finishedAllSteps: true });

        //wait a few seconds (for the user to see the success message) then redirect to profile page
        setTimeout(() => history.push('/profile'), 2000);
      }
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  render() {
    const { userUploadStore } = this.props;

    return (
      <Card title="Welcome Aboard!">
        <Row>
          <Col span={24}>
            <Steps
              current={this.state.currentStep}
              initial={0}
            >
              <Step title="Resume"
                {...this.state.resumeUploadFailed ? { status: 'error' } : {}}
                {...userUploadStore!.resumeUploading ? { icon: <Icon type="loading" /> } : {}}
              />
              <Step title="Cover Letter"
                {...this.state.letterUploadFailed ? { status: 'error' } : {}}
                {...userUploadStore!.letterUploading ? { icon: <Icon type="loading" /> } : {}}
              />
              <Step title="Review" />
            </Steps>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.state.currentStep === 0 &&
              <div className="mt-lg">
                <h2>Upload Your Resume</h2>
                <p>Only Microsoft Word and PDF files are accepted!</p>
                <Upload.Dragger
                  accept=".docx, .pdf"
                  name="resume"
                  multiple={false}
                  customRequest={this.uploadResume}
                  onChange={({ file, fileList, event }) => {
                    this.setState({
                      resumeFile: fileList
                    });
                  }}
                  listType="text"
                  defaultFileList={this.state.resumeFile}
                >
                  <p className="ant-upload-drag-icon">
                    <img src={UploadImg} className="wizard-img" />
                  </p>
                  <p className="ant-upload-text">Click or drag a file to this area to upload</p>
                </Upload.Dragger>
              </div>
            }
            {this.state.currentStep === 1 &&
              <div className="mt-lg">
                <h2>Upload A Cover Letter</h2>
                <p>While optional, providing COOBOT with more text to analyize will give you better results.</p>
                <Upload.Dragger
                  accept=".docx, .pdf"
                  name="letter"
                  multiple={false}
                  customRequest={this.uploadCoverLetter}
                  onChange={({ file, fileList, event }) => {
                    this.setState({
                      coverLetterFile: fileList
                    });
                  }}
                  listType="text"
                  defaultFileList={this.state.coverLetterFile}
                >
                  <p className="ant-upload-drag-icon">
                    <img src={UploadImg} className="wizard-img" />
                  </p>
                  <p className="ant-upload-text">Click or drag a file to this area to upload</p>
                </Upload.Dragger>
                <Button
                  {...userUploadStore!.letterUploading ? { disabled: true } : {}}
                  className="mt-md"
                  type="default"
                  onClick={() => this.moveToFinalStep()}>Skip</Button>
              </div>
            }
            <div className="mt-lg" style={{ display: this.state.currentStep === 2 ? 'block' : 'none' }}>
              {this.state.finishedAllSteps ?
                <Result
                  status="success"
                  title="Success!"
                  subTitle="We'll redirect you to your profile shortly..."
                />
                :
                <div>
                  <h2>Review</h2>
                  <p>COOBOT has made its best to extract the text from your files, but sometimes the results are not optimal.</p>
                  <p>If you see any text that looks garbled or jumbled up (e.g. missing spaces between words), this is your chance to fix it!</p>
                  <ExtractedTextForm wrappedComponentRef={this.saveFormRef} />
                  <div className="text-align-center">
                    <Button block type="primary" onClick={() => this.onFinalStepSubmit()}>Looks Good. Let's Go!</Button>
                  </div>
                </div>
              }

            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
export default ReactTimeout(Onboarding);
