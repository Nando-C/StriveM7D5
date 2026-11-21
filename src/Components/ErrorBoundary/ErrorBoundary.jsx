import { Component } from "react";
import { Link } from "react-router";
import "./ErrorBoundary.css";

// Catches an error thrown while a page renders (a response missing a field
// the page reads, for instance), so the page shows a message and the rest of
// the app, the player included, keeps working. Error boundaries have to be
// class components. Give it a `key` that changes with the address, so moving
// to another page clears the error.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="ErrorBoundary p-4" role="alert">
        <h1>Something went wrong showing this page</h1>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }
}

export default ErrorBoundary;
