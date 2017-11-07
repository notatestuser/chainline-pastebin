import React, { Component } from 'react';
import AutoForm from 'react-auto-form';

import styled from 'styled-components';
import { Box, Heading, Image, Text, Button, TextInput, Select, CheckBox, RadioButton, Anchor } from 'grommet';

import Layout from '../components/layout';
import Field from '../components/Field';
import NotifyLayer from '../components/NotifyLayer';

import { createPaste } from '../utils/api';
import { getVerifyHash } from '../utils/hash';

const EXPIRY_OPTIONS = {
  '10 minutes': '10M',
  '1 hour': '1H',
  '1 day': '1D',
  '1 week': '1W',
  '2 weeks': '2W',
  '1 month': '1M',
};

export const BorderlessTextarea = styled.textarea`
  border: 0;
  font: inherit;
  padding: 16px 12px;
  min-height: 128px;
  outline: 0;

  &::placeholder {
    color: #aaa;
  }
`;

const CaptchaImage = styled(Image)`
  max-width: 180px;
`;

const NonPaddedAnchor = styled(Anchor)`
  padding: 0;
`;

export default class CreateForm extends Component {
  state = {
    loading: false,
    unlisted: true,
    expireSelect: true,
    expireNever: false,
    selectedExpiry: '1 day',
  }

  _onSubmit = async ({ title, text, captcha }) => {
    const { selectedExpiry, expireNever, unlisted } = this.state;
    const postBody = {
      title,
      text,
      privacy: unlisted === true ? 1 : 0,
      expiry: expireNever ? 'N' : EXPIRY_OPTIONS[selectedExpiry],
      captcha,
    };
    try {
      const id = await createPaste(postBody);
      const hash = getVerifyHash(text);
      this.setState({
        loading: false,
        notifySuccess: true,
        notifyMessage: (
          <Text>
            <Heading level={3} margin={{ top: 'none' }}>
              Your paste has been created!
            </Heading>
            Use this link to share your paste:<br />
            <Box margin={{ top: 'small' }}>
              <NonPaddedAnchor primary={true} href={`/p/${id}/${hash}`}>
                ➔ {id}
              </NonPaddedAnchor>
            </Box>
          </Text>),
      });
    } catch (err) {
      this.setState({
        loading: false,
        notifySuccess: false,
        notifyMessage: <Text>{(err && err.message) || 'Oops, an error occurred!'}</Text>,
      });
    }
  }

  render() {
    const { notifyMessage, notifySuccess, loading } = this.state;
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    return (
      <Layout>
        <NotifyLayer
          message={notifyMessage}
          isSuccess={notifySuccess}
          onClose={() => { this.setState({ notifyMessage: null }); }}
        />
        <AutoForm
          onSubmit={(ev, data) => {
            ev.preventDefault();
            if (loading) return false;
            this._onSubmit(data);
            this.setState({ loading: true });
            return false;
          }}
          trimOnSubmit
        >
          <Box>
            <Heading level={2} margin={{ top: 'none' }}>
              Create a new paste
            </Heading>
            <Box margin='none'>
              <Field label='Title'>
                <TextInput
                  name='title'
                  placeholder='Enter a fitting title'
                  defaultValue={`Paste at ${new Date().toLocaleString()} ${timezoneAbbr}`}
                  plain={true}
                />
              </Field>
              <Field label='Content'>
                <BorderlessTextarea name='text' placeholder='Enter some text' />
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
                    checked={this.state.unlisted}
                    onChange={() => {
                      this.setState({ unlisted: !this.state.unlisted });
                    }}
                  />
                </Box>
              </Field>
              <Field label='Human check'>
                <CaptchaImage src='/captcha' />
                <TextInput name='captcha' plain={true} placeholder='Enter the text displayed above' />
              </Field>
              <Box margin={{ top: 'large' }}>
                <Button
                  type={loading ? 'disabled' : 'submit'}
                  label='Submit'
                  primary={true}
                  disabled={loading}
                />
              </Box>
            </Box>
          </Box>
        </AutoForm>
      </Layout>
    );
  }
}
