import React, { Component } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import styled from 'styled-components';
import { AddCircle, FingerPrint } from 'grommet-icons';
import { Grommet, Responsive, Box, Heading, Text } from 'grommet';

import { WidthCappedContainer } from './WidthCappedContainer';

const FlexNav = styled.nav`
  display: flex;
`;

const PlainAnchor = styled.a`
  cursor: pointer;
  text-decoration: none;
`;

const BoldAnchor = styled(PlainAnchor)`
  font-weight: bold;
`;

class Layout extends Component {
  state = {
    responsiveState: 'wide',
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onResponsiveChange = (responsiveState) => {
    this.setState({ responsiveState });
  }

  render() {
    const { title, children } = this.props;
    const { responsiveState } = this.state;

    return ([
      <Head key='Head'>
        <title>{ title || 'Chain Line Pastebin' }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='mobile-web-app-capable' content='yes' />
        <style>
          {'html, body, #content { height: 100%; }'}
          {'body { margin: 0; background: #444444; }'}
        </style>
      </Head>,
      <Grommet key='Grommet'>
        <Responsive onChange={this.onResponsiveChange}>
          <header>
            <Box
              background={{ dark: true, image: '#916bd6' }}
              direction='row'
              justify='end'
              align='center'
              pad={{ horizontal: 'large' }}
            >
              <WidthCappedContainer justify='space-between' direction='row'>
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
          <Box pad='large' margin={{ bottom: 'large' }}>
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
              pad={{ horizontal: 'none', vertical: 'medium' }}
              justify='between'
              margin={{ horizontal: 'large' }}
            >
              <WidthCappedContainer size='xlarge' direction='row' justify='space-between'>
                <Text margin='none'>
                  © 2017 Luke Plaster.&nbsp;
                  MIT Licensed.
                </Text>
              </WidthCappedContainer>
            </Box>
          </Box>
        </footer>

      </Grommet>,
    ]);
  }
}

export default Layout;
