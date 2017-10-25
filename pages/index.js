import React from 'react';

import Link from 'next/link';
import { Heading, Paragraph } from 'grommet';
import Layout from '../components/layout';

export default () => (
  <Layout>
    <Heading level={2} margin={{ top: 'none' }}>
      Welcome
    </Heading>
    <Paragraph margin={{ vertical: 'none', top: 'small' }}>
      This service stores text on&nbsp;
      <a href='//pastebin.com' target='_blank' rel='noopener noreferrer'>
        Pastebin.com
      </a>
      .<br /><br />
      You will be given a link that contains a hash of your text
      so its integrity can be verified at a later point in time.<br /><br />
      This allows you to store external data in immutable storage such as a blockchain,
      for instance. Please use the &ldquo;Verify&rdquo; page to validate a hash.
      <br /><br />
      Ready to begin? Head over to <Link href='/create'><a>Create</a></Link>.
    </Paragraph>
  </Layout>
);
