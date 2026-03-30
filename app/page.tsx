"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

interface SendResult {
  id: string;
  status: string;
  createdAt: string;
  consoleUrl: string;
}

interface SendError {
  error: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendInvoice = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/send-invoice", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError((data as SendError).error || "Something went wrong");
      } else {
        setResult(data as SendResult);
      }
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Send your first Peppol invoice
          </h1>
          <p className="text-muted-foreground text-lg">
            No XML. No UBL. No headaches.
          </p>
        </div>

        {/* Send button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={sendInvoice}
            disabled={loading}
            className="text-base px-8 py-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Demo Invoice"
            )}
          </Button>
        </div>

        {/* Success result */}
        {result && (
          <Card className="border-success/30 bg-success/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <CardTitle className="text-lg">Invoice Sent!</CardTitle>
              </div>
              <CardDescription>
                Your demo invoice is now on the Peppol sandbox network.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ID</span>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {result.id}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary">{result.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {new Date(result.createdAt).toLocaleString()}
                </span>
              </div>

              {/* The wow moment */}
              <a
                href={result.consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <div>
                  <div>View in getpeppr Console</div>
                  <div className="text-xs text-muted-foreground font-normal mt-0.5">
                    {result.consoleUrl}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 ml-2" />
              </a>

              <p className="text-xs text-muted-foreground text-center pt-1">
                This is a real invoice on the Peppol sandbox network, not a
                mock.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error result */}
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure your <code>GETPEPPR_API_KEY</code> is set in{" "}
                <code>.env.local</code>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://docs.getpeppr.dev"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </a>
          <span>·</span>
          <a
            href="https://www.npmjs.com/package/@getpeppr/sdk"
            className="hover:text-foreground transition-colors"
          >
            SDK
          </a>
          <span>·</span>
          <a
            href="https://console.getpeppr.dev"
            className="hover:text-foreground transition-colors"
          >
            Console
          </a>
        </div>
      </div>
    </main>
  );
}
