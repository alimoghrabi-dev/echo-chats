import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
          <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />

          <h1 className="text-2xl font-semibold text-gray-800">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-600 mt-2">
            Try refreshing the page or come back later.
          </p>

          <button
            onClick={this.handleReload}
            className="mt-5 px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
