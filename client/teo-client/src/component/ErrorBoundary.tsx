import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    //@ts-expect-error
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center">
          <p>Something went wrong.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
