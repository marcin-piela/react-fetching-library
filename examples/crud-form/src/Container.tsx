import React from 'react';
import { Box } from '@chakra-ui/core';

const Container: React.FC = ({ children }) => (
  <Box py={3}>
    <Box maxW={960} mx="auto" px={3}>
      {children}
    </Box>
  </Box>
);

export default Container;
