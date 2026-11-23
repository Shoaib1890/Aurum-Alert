'use client';

import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ManualTriggerButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleTestDispatch = async () => {
    setIsLoading(true);
    setFeedback({ type: null, message: '' });

    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Test alert sent successfully to Telegram chat ${data.recipient}!`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to send Telegram alert.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network failure';
      setFeedback({
        type: 'error',
        message: `Failed to trigger test notification: ${msg}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleTestDispatch}
          isLoading={isLoading}
          disabled={isLoading}
          className="gap-2 bg-sky-600 hover:bg-sky-700 text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Test Telegram Alert</span>
        </Button>
      </div>

      {/* Result feedback */}
      {feedback.type === 'success' && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {feedback.type === 'error' && (
        <div className="flex items-start gap-1.5 text-xs text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 max-w-md">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
