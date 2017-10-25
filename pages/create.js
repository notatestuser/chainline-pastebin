import React from 'react';

import { Box, Heading, Button, Paragraph, TextInput, CheckBox } from 'grommet';
import styled from 'styled-components';

import { WidthCappedContainer } from '../components/WidthCappedContainer';
import Layout from '../components/layout';
import Field from '../components/Field';

const BorderlessTextarea = styled.textarea`
  border: 0;
  font-size: 16px;
  padding: 16px;
`;

export default () => (
  <Layout>
    <WidthCappedContainer>
      <form
        name='create-form'
        onSubmit={(ev) => {
          ev.preventDefault();
          return false;
        }}
      >
        <Box>
          <Heading level={2} margin='none'>
            Create a new paste
          </Heading>
          <Box margin={{ vertical: 'medium', horizontal: 'none', bottom: 'large' }}>
            <Paragraph margin={{ bottom: 'medium' }}>
              Create a new pastebin entry. <br />
              Please enter your text and choose a fitting title.
            </Paragraph>
            <Field label='Title'>
              <TextInput plain={true} />
            </Field>
            <Field label='Content'>
              <BorderlessTextarea placeholder='Enter some text' />
            </Field>
            <Field>
              <Box pad='small' margin={{ bottom: 'small' }}>
                <CheckBox
                  label='A checkbox'
                  onChange={() => {
                    return null;
                  }}
                />
              </Box>
            </Field>
            <Box margin={{ top: 'medium' }}>
              <Button primary={true} type='submit' label='Submit' />
            </Box>
          </Box>
        </Box>
      </form>
    </WidthCappedContainer>
  </Layout>
);
