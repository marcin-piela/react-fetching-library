import React, { Component } from 'react';
import { QueryError } from '../../client/errors/QueryError';
import { ErrorQueryBoundaryProps, ErrorQueryBoundaryState } from './QueryErrorBoundary.types';

export class QueryErrorBoundary extends Component<ErrorQueryBoundaryProps, ErrorQueryBoundaryState> {
  static getDerivedStateFromError(error: Error) {
    if (error instanceof QueryError) {
      return { hasError: true, status: error.status };
    }
  }
  state: ErrorQueryBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorQueryBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError && this.state.status && this.props.statuses.includes(this.state.status)) {
      return this.props.fallback(this.state.status);
    }

    return this.props.children;
  }
}
