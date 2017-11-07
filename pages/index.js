import React from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { Heading, Paragraph } from 'grommet';

import Layout from '../components/layout';

const IntroParagraph = styled(Paragraph)`
  max-width: 460px;
`;

export default () => (
  <Layout>
    <Heading level={2} margin={{ top: 'none' }}>
      Welcome
    </Heading>
    <IntroParagraph margin={{ vertical: 'none', top: 'small' }}>
      This app posts immutable &ldquo;pastes&rdquo; to&nbsp;
      <a href='//pastebin.com' target='_blank' rel='noopener noreferrer'>
        Pastebin.com
      </a>
      .<br /><br />
      You will be given a link that contains a hash of your text
      so its integrity can be verified at a later point in time.
      <br /><br />
      This allows you to store unlimited amounts of text-based data
      in immutable structures such as blockchains, for instance.
      <br /><br />
      Ready to begin?
      Head over to <Link href='/create'><a>Create</a></Link> or <Link href='/verify'><a>Verify</a></Link>.
    </IntroParagraph>
  </Layout>
);
