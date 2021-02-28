import * as React from 'react';

import { Form, Input } from 'antd';

const FormItem = Form.Item;

class ExtractedTextForm extends React.Component<any> {

  public render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const showCoverLetterText: boolean = !!getFieldValue('letterText');

    return (
      <Form onSubmit={(e: any) => { e.preventDefault(); }}>
        <FormItem hasFeedback label="Resume Text">
          {getFieldDecorator('resumeText', {
            rules: [{
              required: true,
              message: 'Resume Text cannot be empty!',
            }]
          })(
            <Input.TextArea rows={10} />
          )}
        </FormItem>
        <FormItem hasFeedback label="Cover Letter Text" style={{ display: showCoverLetterText ? 'block' : 'none' }}>
          {getFieldDecorator('letterText', showCoverLetterText ?
            {
              rules: [{
                required: true,
                message: 'Cover Letter Text cannot be empty!',
              }]
            }
            : {})(
              <Input.TextArea rows={10} />
            )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ExtractedTextForm);
