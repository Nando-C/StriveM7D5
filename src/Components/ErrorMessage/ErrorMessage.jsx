import "./ErrorMessage.css";

// The error state every page and list shows. Pass the query's `refetch` as
// `onRetry` to offer another attempt.
const ErrorMessage = ({ onRetry }) => (
  <div className="ErrorMessage" role="alert">
    <h1 className="p-4">There was an error retrieving the information</h1>
    {onRetry && (
      <button type="button" className="retry-btn" onClick={() => onRetry()}>
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
