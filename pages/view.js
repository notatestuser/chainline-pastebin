import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Error from 'next/error';

import styled from 'styled-components';
import { Box, Heading, Text } from 'grommet';
import { Alert, Checkmark } from 'grommet-icons';

import Layout from '../components/layout';

import { getVerifyHash } from '../utils/hash';

const AlertBox = styled(Box)`
  padding: 24px 20px 25px 40px;
  margin-bottom: 20px;

  & h3 {
    margin-bottom: 15px;
    margin-top: 0;
    font-weight: 500;
    padding-left: 20px;
  }

  & span {
    padding-left: 20px;
  }

  & svg {
    fill: black;
    stroke: black;
    padding-top: 3px;
    transform: scale(1.3);
    transform-origin: 50% 50%;
  }
`;

const Pre = styled.pre`
  font-size: 16px;
`;

export default class ViewPage extends Component {
  static async getInitialProps({ req, query: { id, hash } }) {
    let url;
    if (req) {
      url = `${req.protocol}://${req.get('host')}/api/paste/${id}`;
    } else {
      url = `${window.location.protocol}//${window.location.host}/api/paste/${id}`;
    }
    try {
      const res = await fetch(url);
      const statusCode = res.statusCode > 200 ? res.statusCode : false;
      if (statusCode) return { statusCode };
      const { text } = await res.json();
      const thisHash = getVerifyHash(text);
      return { text, hash, match: thisHash === hash };
    } catch (err) {
      console.error('Paste fetch error!', id, err);
      return { statusCode: 404 };
    }
  }

  render() {
    if (this.props.statusCode) {
      return <Error statusCode={this.props.statusCode} />;
    }

    const { text, hash, match } = this.props;

    let alert = null;
    if (!hash) {
      alert = (
        <AlertBox background={{ dark: false, image: '#FFD602' }} direction='row'>
          <Alert />
          <Box>
            <Heading level={3}>No hash provided</Heading>
            <Text>
              A verification hash was not provided.
              The content&apos;s integrity cannot be verified.
            </Text>
          </Box>
        </AlertBox>);
    } else if (hash.length && !match) {
      alert = (
        <AlertBox background={{ dark: false, image: '#FFD602' }} direction='row'>
          <Alert />
          <Box>
            <Heading level={3}>Verification failed</Heading>
            <Text>
              The hash provided in the URL does not match the content.
              Be careful and exercise caution.
            </Text>
          </Box>
        </AlertBox>);
    } else if (hash.length && match) {
      alert = (
        <AlertBox background={{ dark: false, image: '#8CC800' }} direction='row'>
          <Checkmark />
          <Box>
            <Heading level={3}>Verification passed</Heading>
            <Text>
              All good. The integrity of the content shown below was verified.
            </Text>
          </Box>
        </AlertBox>);
    }

    return (
      <Layout title='View Paste'>
        {alert}
        <Pre>{text}</Pre>
      </Layout>);
  }
}
