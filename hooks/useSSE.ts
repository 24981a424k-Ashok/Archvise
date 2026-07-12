import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface StreamStep {
  agent: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

const INITIAL_STEPS: StreamStep[] = [
  { agent: 'connecting', label: 'Connecting to agents...', status: 'pending' },
  { agent: 'sre', label: 'Alex reviewing reliability...', status: 'pending' },
  { agent: 'backend', label: 'Maria checking database...', status: 'pending' },
  { agent: 'infrastructure', label: 'James reviewing infrastructure...', status: 'pending' },
  { agent: 'cloud_architect', label: 'Priya estimating costs...', status: 'pending' },
];

export function useAuditStream(jobId: string | null) {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'complete' | 'failed'>('idle');
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setSteps(INITIAL_STEPS);
    setStatus('streaming');

    const es = new EventSource(`${API_URL}/api/audit/stream/${jobId}`, {
      withCredentials: true,
    });

    es.addEventListener('agent_started', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setSteps((prev) =>
        prev.map((s) => (s.agent === data.agent ? { ...s, status: 'active' as const } : s))
      );
    });

    es.addEventListener('agent_complete', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setSteps((prev) =>
        prev.map((s) => (s.agent === data.agent ? { ...s, status: 'complete' as const } : s))
      );
    });

    es.addEventListener('job_complete', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setResultId(data.audit_id);
      setStatus('complete');
      es.close();
    });

    es.addEventListener('job_failed', () => {
      setStatus('failed');
      es.close();
    });

    es.onerror = () => {
      setStatus('failed');
      es.close();
    };

    return () => es.close();
  }, [jobId]);

  return { steps, status, resultId };
}

export function useDesignStream(jobId: string | null) {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'complete' | 'failed'>('idle');
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setSteps(INITIAL_STEPS);
    setStatus('streaming');

    const es = new EventSource(`${API_URL}/api/design/stream/${jobId}`, {
      withCredentials: true,
    });

    es.addEventListener('agent_started', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setSteps((prev) =>
        prev.map((s) => (s.agent === data.agent ? { ...s, status: 'active' as const } : s))
      );
    });

    es.addEventListener('agent_complete', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setSteps((prev) =>
        prev.map((s) => (s.agent === data.agent ? { ...s, status: 'complete' as const } : s))
      );
    });

    es.addEventListener('job_complete', (e: MessageEvent) => {
      setStatus('complete');
      es.close();
    });

    es.addEventListener('job_failed', () => {
      setStatus('failed');
      es.close();
    });

    es.onerror = () => {
      setStatus('failed');
      es.close();
    };

    return () => es.close();
  }, [jobId]);

  return { steps, status, resultId };
}
