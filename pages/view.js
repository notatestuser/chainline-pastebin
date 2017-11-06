import React, { Component } from 'react';
import Error from 'next/error';
import fetch from 'isomorphic-unfetch';

import Layout from '../components/layout';

export default class ViewPage extends Component {
  static async getInitialProps({ query: { id } }) {
    try {
      const res = await fetch(`/api/paste/${id}`);
      const statusCode = res.statusCode > 200 ? res.statusCode : false;
      if (statusCode) return { statusCode };
      const { text } = await res.json();
      return { text };
    } catch (err) {
      return { statusCode: 404 };
    }
  }

  render() {
    if (this.props.statusCode) {
      return <Error statusCode={this.props.statusCode} />;
    }

    return (
      <Layout title='View Paste'>
        <pre>
          {this.props.text}
        </pre>
      </Layout>);
  }
}
