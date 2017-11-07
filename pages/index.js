import React from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { Heading, Paragraph } from 'grommet';

import Layout from '../components/layout';

const IntroParagraph = styled(Paragraph)`max-width: 460px;`;
const Anchor = styled.a`
  color: #5429a3;
  cursor: pointer;
  text-decoration: underline;
`;

const createLink = <Link href='/create'><Anchor>Create</Anchor></Link>;
const verifyLink = <Link href='/verify'><Anchor>Verify</Anchor></Link>;

export default () => (
  <Layout>
    <Heading level={2} margin={{ top: 'none' }}>
      Welcome
    </Heading>
    <IntroParagraph margin={{ vertical: 'none', top: 'small' }}>
      This app posts immutable &ldquo;pastes&rdquo; to&nbsp;
      <Anchor href='//pastebin.com' target='_blank' rel='noopener noreferrer'>
        Pastebin.com
      </Anchor>
      .<br /><br />
      You will be given a link that contains a hash of your text
      so its integrity can be verified at a later point in time.
      <br /><br />
      This is ideal for storing unlimited amounts of text-based data
      in immutable structures such as blockchains.
      <br /><br />
      Ready to begin?
      Head over to {createLink} or {verifyLink}.
    </IntroParagraph>
  </Layout>
);
