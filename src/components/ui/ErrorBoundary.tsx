"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log to console in development
        if (process.env.NODE_ENV === "development") {
            console.group("Error Boundary Details");
            console.error("Error:", error);
            console.error("Error Info:", errorInfo);
            console.error("Component Stack:", errorInfo.componentStack);
            console.groupEnd();
        }
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen bg-brutalist-black flex items-center justify-center">
                    <div className="text-center p-8 border-3 border-brutalist-yellow bg-brutalist-light-gray">
                        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-4 text-black">
                            Something Went Wrong
                        </h2>
                        <p className="font-mono text-sm text-gray-700 mb-4">
                            Don't worry, this is just a temporary issue. The page should work normally.
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: undefined });
                                window.location.reload();
                            }}
                            className="px-6 py-3 bg-brutalist-yellow border-3 border-black font-mono font-bold text-black hover:bg-black hover:text-brutalist-yellow transition-colors duration-200"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
    const handleError = (error: Error, context?: string) => {
        console.error(`Error in ${context || 'component'}:`, error);

        // In development, you might want to show a toast or notification
        if (process.env.NODE_ENV === "development") {
            console.group("Error Details");
            console.error("Error:", error);
            console.error("Stack:", error.stack);
            console.error("Context:", context);
            console.groupEnd();
        }
    };

    return { handleError };
}; 