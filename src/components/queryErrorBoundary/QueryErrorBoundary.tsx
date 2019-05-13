import React, { Component } from 'react';
import { ErrorQueryBoundaryState, ErrorQueryBoundaryProps } from './QueryErrorBoundary.types';
import { QueryError } from '../../client/errors/QueryError';

export class QueryErrorBoundary extends Component<ErrorQueryBoundaryProps, ErrorQueryBoundaryState> {
  state: ErrorQueryBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorQueryBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    if (error instanceof QueryError) {
      return { hasError: true, status: error.status };
    }
  }

  render() {
    if (this.state.hasError && this.state.status && this.props.statuses.includes(this.state.status)) {
      return this.props.fallback(this.state.status);
    }

    return this.props.children;
  }
}
