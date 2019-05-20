import React, { Component } from 'react';
import { QueryError } from '../../client/errors/QueryError';
import { ErrorQueryBoundaryProps, ErrorQueryBoundaryState } from './QueryErrorBoundary.types';

export class QueryErrorBoundary extends Component<ErrorQueryBoundaryProps, ErrorQueryBoundaryState> {
  static getDerivedStateFromError(error: Error) {
    if (error instanceof QueryError) {
      return { hasError: true, response: error.response };
    }
  }

  state: ErrorQueryBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorQueryBoundaryProps) {
    super(props);
    this.state = { hasError: false, response: undefined };
  }

  restart = () => {
    this.setState({
      hasError: false,
      response: undefined,
    });
  };

  render() {
    if (
      this.state.hasError &&
      this.state.response &&
      this.state.response.status &&
      this.props.statuses.includes(this.state.response.status)
    ) {
      return this.props.fallback(this.state.response, this.restart);
    }

    return this.props.children;
  }
}
