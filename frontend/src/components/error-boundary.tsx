"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              오류가 발생했습니다.
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {this.state.error?.message ?? "알 수 없는 오류"}
            </p>
            <Button onClick={this.handleReset}>다시 시도</Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
