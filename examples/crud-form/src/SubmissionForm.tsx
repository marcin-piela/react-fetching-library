import React from 'react';
import { FormikProps, Field, FieldProps } from 'formik';
import { Box, Button, Textarea, FormControl, Input, FormErrorMessage, FormLabel } from '@chakra-ui/core';

import { SubmissionValues } from './SubmissionFormContainer';

interface SubmissionFormProps extends FormikProps<SubmissionValues> {}

const renderNameFormControl = (props: FieldProps) => {
  const { field, form } = props;
  return (
    <FormControl isInvalid={!!form.errors.name}>
      <FormLabel htmlFor="name">First name</FormLabel>
      <Input {...field} id="name" placeholder="Jane Doe" />
      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
    </FormControl>
  );
};

const renderEmailFormControl = (props: FieldProps) => {
  const { field, form } = props;
  return (
    <FormControl isInvalid={!!form.errors.email}>
      <FormLabel htmlFor="email">Email Address</FormLabel>
      <Input {...field} id="email" placeholder="janedoe@gmail.com" type="email" />
      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
    </FormControl>
  );
};

const renderMessageFormControl = (props: FieldProps) => {
  const { field, form } = props;
  return (
    <FormControl isInvalid={!!form.errors.message}>
      <FormLabel htmlFor="message">Message</FormLabel>
      <Textarea {...field} id="message" placeholder="What did you want to talk about?" />
      <FormErrorMessage>{form.errors.message}</FormErrorMessage>
    </FormControl>
  );
};

const SubmissionForm: React.FC<SubmissionFormProps> = ({ handleSubmit, isSubmitting }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Box mb={4}>
        <Field name="name" render={renderNameFormControl} />
      </Box>
      <Box mb={4}>
        <Field name="email" render={renderEmailFormControl} />
      </Box>
      <Box mb={4}>
        <Field name="message" render={renderMessageFormControl} />
      </Box>
      <Button isLoading={isSubmitting} width="100%" variantColor="blue" onClick={() => handleSubmit} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default SubmissionForm;
