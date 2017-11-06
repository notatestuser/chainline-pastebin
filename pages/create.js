import React, { Component } from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { Box, Heading, Text, Button, TextInput, Select, CheckBox, RadioButton, Anchor } from 'grommet';

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

const NonPaddedAnchor = styled(Anchor)`
  padding: 0;
`;

const onSubmit = async (comp) => {
  const { selectedExpiry, expireNever, unlisted } = comp.state;

  const form = document.forms['create-form'];
  const inputs = form.getElementsByTagName('input');
  const textareas = form.getElementsByTagName('textarea');
  const [titleInput] = inputs;
  const [contentTextArea] = textareas;
  const title = titleInput.value;
  const text = contentTextArea.value || contentTextArea.textContent;

  const postBody = {
    title,
    text,
    privacy: unlisted === true ? 1 : 0,
    expiry: expireNever ? 'N' : EXPIRY_OPTIONS[selectedExpiry],
  };

  try {
    const id = await createPaste(postBody);
    const hash = getVerifyHash(text);
    comp.setState({
      loading: false,
      notifySuccess: true,
      notifyMessage: (
        <Text>
          <Heading level={3} margin={{ top: 'none' }}>
            Your paste has been created!
          </Heading>
          Verify code:<br />
          <TextInput plain={true} disabled={true} value={hash} />
          Use this link to share your paste:<br />
          <Box margin={{ top: 'small' }}>
            <NonPaddedAnchor primary={true} href={`/paste/${id}/${hash}`}>
              🡒 View: {id}
            </NonPaddedAnchor>
          </Box>
        </Text>),
    });
  } catch (err) {
    comp.setState({
      loading: false,
      notifySuccess: false,
      notifyMessage: <Text>{(err && err.message) || 'Oops, an error occurred!'}</Text>,
    });
  }
};

export default class CreateForm extends Component {
  state = {
    loading: false,
    unlisted: true,
    expireSelect: true,
    expireNever: false,
    selectedExpiry: '1 day',
  }

  render() {
    const { notifyMessage, notifySuccess, loading } = this.state;
    return (
      <Layout>
        <NotifyLayer
          message={notifyMessage}
          isSuccess={notifySuccess}
          onClose={() => { this.setState({ notifyMessage: null }); }}
        />
        <form
          name='create-form'
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (loading) return false;
            onSubmit(this);
            this.setState({ loading: true });
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
                    checked={this.state.unlisted}
                    onChange={() => {
                      this.setState({ unlisted: !this.state.unlisted });
                    }}
                  />
                </Box>
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
        </form>
      </Layout>
    );
  }
}
