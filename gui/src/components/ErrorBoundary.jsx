// ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      // If an error was caught, try re-rendering the children after a delay
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 10000); // 10 seconds
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Retrying...</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
