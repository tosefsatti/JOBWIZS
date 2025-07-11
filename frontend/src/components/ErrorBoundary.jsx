import React from "react";

export default class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Oops—something went wrong.
                    </h2>
                    <p>Please refresh or try again later.</p>
                </div>
            );
        }
        return this.props.children;
    }
}
