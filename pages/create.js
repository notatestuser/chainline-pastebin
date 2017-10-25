import React, { Component } from 'react';

import styled from 'styled-components';
import { Box, Heading, Button, TextInput, Select, CheckBox, RadioButton } from 'grommet';

import Layout from '../components/layout';
import Field from '../components/Field';

const EXPIRY_OPTIONS = {
  '1 hour': '1H',
  '1 day': '1D',
  '1 week': '1W',
  '1 month': '1M',
  '3 months': '3M',
  '6 months': '6M',
  '1 year': '1Y',
};

const BorderlessTextarea = styled.textarea`
  border: 0;
  font: inherit;
  padding: 16px 12px;
  min-height: 128px;
  outline: 0;

  &::placeholder {
    color: #aaa;
  }
`;

class CreateForm extends Component {
  state = {
    private: true,
    expireSelect: true,
    expireNever: false,
    selectedExpiry: '1 day',
  }

  render() {
    return (
      <Layout>
        <form
          name='create-form'
          onSubmit={(ev) => {
            ev.preventDefault();
            const form = document.forms['create-form'];
            const inputs = form.getElementsByTagName('input');
            const textareas = form.getElementsByTagName('textarea');
            const [titleInput] = inputs;
            const [contentTextArea] = textareas;
            const title = titleInput.value;
            const content = contentTextArea.value || contentTextArea.textContent;
            alert(title);
            alert(content);
            return false;
          }}
        >
          <Box>
            <Heading level={2} margin={{ top: 'none' }}>
              Create a new paste
            </Heading>
            <Box margin='none'>
              <Field label='Title'>
                <TextInput plain={true} placeholder='e.g. My blockchain haiku' />
              </Field>
              <Field label='Content'>
                <BorderlessTextarea placeholder='Enter some text' />
              </Field>
              <Field label='Expiry' direction='row'>
                <Box margin='small' direction='row'>
                  <RadioButton
                    label=''
                    checked={this.state.expireSelect}
                    onChange={() => {
                      if (this.state.expireSelect) return; // already selected
                      this.setState({
                        expireSelect: !this.state.expireSelect,
                        expireNever: !this.state.expireNever,
                      });
                    }}
                  />
                  <Select
                    size='medium'
                    options={Object.keys(EXPIRY_OPTIONS)}
                    value={this.state.selectedExpiry}
                    onChange={({ option }) => {
                      this.setState({
                        selectedExpiry: option,
                        expireSelect: true,
                        expireNever: false,
                      });
                    }}
                  />
                </Box>
                <Box margin={{ horizontal: 'small', vertical: 'small', bottom: 'medium' }}>
                  <RadioButton
                    label='Never expire, keep it forever'
                    checked={this.state.expireNever}
                    onChange={() => {
                      if (this.state.expireNever) return; // already selected
                      this.setState({
                        expireNever: !this.state.expireNever,
                        expireSelect: !this.state.expireSelect,
                      });
                    }}
                  />
                </Box>
              </Field>
              <Field label='Privacy'>
                <Box pad='small' margin={{ bottom: 'small' }}>
                  <CheckBox
                    label='Do not list on Pastebin.com'
                    checked={this.state.private}
                    onChange={() => {
                      this.setState({ private: !this.state.private });
                    }}
                  />
                </Box>
              </Field>
              <Box margin={{ top: 'large' }}>
                <Button primary={true} type='submit' label='Submit' />
              </Box>
            </Box>
          </Box>
        </form>
      </Layout>
    );
  }
}

export default CreateForm;
