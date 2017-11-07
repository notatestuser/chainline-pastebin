import React, { Component } from 'react';
import AutoForm from 'react-auto-form';

import { Box, Heading, Paragraph, Button, TextInput } from 'grommet';

import Layout from '../components/layout';
import Field from '../components/Field';
import NotifyLayer from '../components/NotifyLayer';
import { BorderlessTextarea } from './create';

import { getPaste } from '../utils/api';
import { getVerifyHash } from '../utils/hash';

const URL_MATCH_REGEX = /\/([a-z0-9]+)\/([a-z0-9]+)$/i;
const WAIT_TEXT = 'Please wait…';

export default class VerifyPage extends Component {
  state = {
    loading: false,
    text: '',
    hash: '',
  }

  _onChange = async (ev, name, data) => {
    if (name === 'text') this.setState({ text: data });
    if (name === 'hash') this.setState({ hash: data });
    if (name !== 'url' || !URL_MATCH_REGEX.test(data)) return;
    const matches = data.match(URL_MATCH_REGEX);
    if (matches.length < 3) return;
    this.setState({
      loading: true,
      text: WAIT_TEXT,
      hash: matches[2],
    });
    try {
      const text = await getPaste(matches[1]);
      this.setState({
        loading: false,
        text,
      });
    } catch (err) {
      this.setState({
        loading: false,
        notifySuccess: false,
        notifyMessage: (err && err.message) || 'An unknown error occurred.',
      });
    }
  }

  _onSubmit = (ev) => {
    ev.preventDefault();
    let thisHash;
    try {
      thisHash = getVerifyHash(this.state.text);
    } catch (err) {
      this.setState({
        notifySuccess: false,
        notifyMessage: (err && err.message) || 'An unknown error occurred.',
      });
      return;
    }
    if (thisHash === this.state.hash) {
      this.setState({
        notifySuccess: true,
        notifyMessage: 'Verification passed. The content matches the hash.',
      });
    } else {
      this.setState({
        notifySuccess: false,
        notifyMessage: 'Verification failed. The content does not match the hash.',
      });
    }
  }

  render() {
    const {
      notifyMessage,
      notifySuccess,
      loading,
      text,
      hash,
    } = this.state;

    return (
      <Layout title='Verify Paste'>
        <NotifyLayer
          size='medium'
          message={notifyMessage}
          isSuccess={notifySuccess}
          onClose={() => { this.setState({ notifyMessage: null }); }}
        />
        <AutoForm onChange={this._onChange} onSubmit={this._onSubmit}>
          <Box>
            <Heading level={2} margin={{ top: 'none' }}>
              Verify an existing paste
            </Heading>
            <Box margin='none'>
              <Field label='URL'>
                <TextInput name='url' placeholder='Enter the URL of the paste, e.g. https://pastebin.chainline.co/p/...' plain={true} />
              </Field>
              <Paragraph>
                <strong>OR</strong>
              </Paragraph>
              <Field label='Content'>
                <BorderlessTextarea name='text' placeholder='Enter some text to check' value={text} disabled={loading} />
              </Field>
              <Field label='Hash'>
                <TextInput name='hash' placeholder='Enter the hash (ripemd160)' value={hash} plain={true} />
              </Field>
              <Box margin={{ top: 'large' }}>
                <Button label='Verify' type='submit' primary={true} />
              </Box>
            </Box>
          </Box>
        </AutoForm>
      </Layout>
    );
  }
}
