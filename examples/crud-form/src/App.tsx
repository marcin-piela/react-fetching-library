import React from 'react';
import { Heading } from '@chakra-ui/core';

import Container from './Container';
import SubmissionFormContainer from './SubmissionFormContainer';

const App: React.FC = () => {
  return (
    <Container>
      <Heading letterSpacing={-0.5}>Send me a message!</Heading>
      <Heading size="md" fontWeight={400} mb={4}>
        I don't bite, I swear!
      </Heading>
      <SubmissionFormContainer />
    </Container>
  );
};

export default App;
