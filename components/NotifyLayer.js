import React from 'react';

import { Layer, Box, Heading, Text, Button } from 'grommet';
import { Validate, Alert } from 'grommet-icons';

const NotifyLayer = ({ message, isSuccess, onClose, size }) => (
  message ?
    <Layer align='top' onEsc={onClose} size={size || 'medium'}>
      <Box pad={{ horizontal: 'medium', top: 'medium' }}>
        <Heading level={2} margin='medium'>
          {isSuccess ?
            <Validate size='large' /> :
            <Alert size='large' />
          }&nbsp;
        </Heading>
        <Box margin={{ horizontal: 'none' }}>
          <Text>
            {message}
          </Text>
          <Box align='start' margin={{ vertical: 'medium', top: 'large' }}>
            <Button primary={true} label='Okay' onClick={onClose} />
          </Box>
        </Box>
      </Box>
    </Layer> : null);

export default NotifyLayer;
