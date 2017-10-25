import React, { Component } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import { Grommet, Responsive, Box, Heading } from 'grommet';
import { AddCircle, View } from 'grommet-icons';
import styled from 'styled-components';

import { WidthCappedContainer } from './WidthCappedContainer';

const FlexNav = styled.nav`
  display: flex;
`;

const PlainAnchor = styled.a`
  cursor: pointer;
  text-decoration: none;
`;

const BoldAnchor = styled.a`
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
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
      <Head>
        <title>{ title || 'Chain Line Pastebin' }</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='mobile-web-app-capable' content='yes' />
        <style>
          {'html, body, #content { height: 100%; }'}
          {'body { margin: 0; }'}
        </style>
      </Head>,
      <Grommet>
        <Responsive onChange={this.onResponsiveChange}>
          <header>
            <Box background={{ dark: true, image: '#69B8D6' }}>
              <Box
                background={{ dark: true }}
                direction='row'
                justify='end'
                align='center'
                pad={{ vertical: 'none', horizontal: 'large' }}
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
                          <Link href='/browse'>
                            <BoldAnchor>
                              Browse
                            </BoldAnchor>
                          </Link>
                        </Box>
                        <View />
                      </Box>
                    </Box>
                  </FlexNav>
                </WidthCappedContainer>
              </Box>
            </Box>
          </header>
        </Responsive>

        <Box pad='large'>
          { children }
        </Box>

      </Grommet>,
    ]);
  }
}

export default Layout;
