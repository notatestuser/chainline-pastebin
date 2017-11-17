import React, { Component } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import styled from 'styled-components';
import { AddCircle, FingerPrint } from 'grommet-icons';
import { Grommet, Responsive, Box, Heading, Text, Anchor } from 'grommet';

import { WidthCappedContainer } from './WidthCappedContainer';

import { name, repository } from '../package.json';

const FlexNav = styled.nav`
  display: flex;
`;

const PlainAnchor = styled.a`
  cursor: pointer;
  text-decoration: none;
`;

const UnderlinedAnchor = styled(Anchor)`
  text-decoration: underline;
`;

const BoldAnchor = styled(PlainAnchor)`
  font-weight: bold;
  text-decoration: underline;
`;

class Layout extends Component {
  state = {
    responsiveState: 'wide',
    sourceCodeUrl: repository,
  }

  async componentWillMount() {
    if (this.state.sourceCodeUrl !== repository) return;
    let sourceCodeUrl;
    // rendering server-side?
    if (process && process.env.NOW_URL) {
      const [, appId] = process.env.NOW_URL.match(/([a-z0-9]+)\.now/);
      sourceCodeUrl = `//${name}-${appId}.now.sh/_src`;
    } else {
      const res = await fetch('/code-url');
      sourceCodeUrl = await res.json();
    }
    if (!sourceCodeUrl) return;
    this.setState({ sourceCodeUrl });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onResponsiveChange = (responsiveState) => {
    this.setState({ responsiveState });
  }

  render() {
    const { title, children } = this.props;
    const { responsiveState, sourceCodeUrl } = this.state;
    return ([
      <Head key='Head'>
        <title>{ title || 'Immutable Pastebin' }</title>
      </Head>,
      <Grommet key='Grommet' theme={{ global: { colors: { brand: '#69B8D6' } } }}>
        <Responsive onChange={this.onResponsiveChange}>
          <header>
            <Box
              background={{ dark: true, image: '#69B8D6' }}
              direction='row'
              justify='end'
              align='center'
              pad={{ horizontal: 'large' }}
            >
              <WidthCappedContainer justify={responsiveState === 'wide' ? 'space-between' : 'center'} direction='row'>
                {responsiveState === 'wide' &&
                <Heading>
                  <Link href='/'>
                    <PlainAnchor>
                      Pastebin
                    </PlainAnchor>
                  </Link>
                </Heading>}
                <FlexNav>
                  <Box align='center' direction='row'>
                    <Box align='start' direction='row' pad='small' margin={{ right: 'medium' }}>
                      <Box margin={{ right: 'small' }}>
                        <Link href='/create'>
                          <BoldAnchor>
                            Create
                          </BoldAnchor>
                        </Link>
                      </Box>
                      <AddCircle />
                    </Box>
                    <Box align='start' direction='row' pad='small'>
                      <Box margin={{ right: 'small' }}>
                        <Link href='/verify'>
                          <BoldAnchor>
                            Verify
                          </BoldAnchor>
                        </Link>
                      </Box>
                      <FingerPrint />
                    </Box>
                  </Box>
                </FlexNav>
              </WidthCappedContainer>
            </Box>
          </header>
        </Responsive>

        <main>
          <Box pad='large' margin={{ bottom: 'medium' }}>
            <WidthCappedContainer>
              { children }
            </WidthCappedContainer>
          </Box>
        </main>

        <footer>
          <Box
            background='#444444'
            direction='column'
            justify='start'
            margin='none'
          >
            <Box
              direction='row'
              align='start'
              pad={{ vertical: 'medium' }}
              justify='between'
              margin={{ horizontal: 'large' }}
            >
              <WidthCappedContainer size='xlarge' direction='row' justify='space-between'>
                <Text margin='none'>
                  © 2017 Luke Plaster.&nbsp;
                  MIT Licensed.
                </Text>
                {responsiveState === 'wide' ? (
                  <Text margin='none'>
                    <UnderlinedAnchor href={sourceCodeUrl} target='_blank'>
                      Source Code
                    </UnderlinedAnchor>
                  </Text>) : null}
              </WidthCappedContainer>
            </Box>
          </Box>
        </footer>

      </Grommet>,
    ]);
  }
}

export default Layout;
