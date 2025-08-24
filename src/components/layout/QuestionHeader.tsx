import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import './QuestionHeader.css';

interface QuestionHeaderProps {
  onOpenPopUp: () => void;
  lines?: [string, string, string];
  answer?: string;
}

const QuestionHeader = forwardRef<HTMLDivElement, QuestionHeaderProps>(
  ({ onOpenPopUp, lines = ['E', 'AGORA', '?'], answer }, ref) => {
    const [questionCueIndex, setQuestionCueIndex] = useState<number | null>(null);

    const handleClickTargetKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenPopUp();
        }
      },
      [onOpenPopUp],
    );

    useEffect(() => {
      let cancelled = false;
      let timerId = 0 as unknown as number;
      const PULSE_DURATION_MS = 2400;

      const scheduleNextCue = () => {
        const delayMs = 2500 + Math.random() * 2500;
        timerId = window.setTimeout(() => {
          if (cancelled) return;
          const index = Math.floor(Math.random() * 3);
          setQuestionCueIndex(index);
          window.setTimeout(() => setQuestionCueIndex(null), PULSE_DURATION_MS);
          if (!cancelled) scheduleNextCue();
        }, delayMs);
      };

      scheduleNextCue();
      return () => {
        cancelled = true;
        window.clearTimeout(timerId);
      };
    }, []);

    return (
      <div className="question" ref={ref}>
        <p className="rotate1 l1 shadow-link">
          <span
            className={`click-target ${questionCueIndex === 0 ? 'pulse-once' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Abrir detalhes"
            onKeyDown={handleClickTargetKeyDown}
            onClick={onOpenPopUp}
          >
            {lines[0]}
          </span>
        </p>
        <p className="l2 shadow-link">
          <span
            className={`click-target ${questionCueIndex === 1 ? 'pulse-once' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Abrir detalhes"
            onKeyDown={handleClickTargetKeyDown}
            onClick={onOpenPopUp}
          >
            {lines[1]}
          </span>
        </p>
        <p className="rotate2 l3 shadow-link">
          <span
            className={`click-target ${questionCueIndex === 2 ? 'pulse-once' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Abrir detalhes"
            onKeyDown={handleClickTargetKeyDown}
            onClick={onOpenPopUp}
          >
            {lines[2]}
          </span>
        </p>
        {answer && (
          <div
            className="answer-bubble"
            role={'button'}
            aria-live="polite"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenPopUp();
              }
            }}
            onClick={onOpenPopUp}
          >
            <span className="answer-tail" aria-hidden="true">
              ↳
            </span>
            <span>{answer}</span>
          </div>
        )}
      </div>
    );
  },
);

export default QuestionHeader;
