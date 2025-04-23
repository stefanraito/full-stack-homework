import { Component, ReactNode, ErrorInfo } from "react";


export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(_: Error) {
      return { hasError: true };
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Unhandled error:', error, errorInfo);
    }
  
    resetError = () => {
      this.setState({ hasError: false });
    };
  
    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Something went wrong.</h1>
            <button onClick={this.resetError}>Try again</button>
          </div>
        );
      }
      return this.props.children;
    }
  }