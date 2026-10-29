import React, { useEffect, useState, useRef } from 'react';
import { ArticleItem } from '../data/types';

interface ArticleModalProps {
  article: ArticleItem | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!article) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [article, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const total = el.scrollHeight - el.clientHeight;
    if (total > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (el.scrollTop / total) * 100)));
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    });
  };

  if (!article) return null;

  // Simple, robust Markdown parser tailored for technical articles
  const renderMarkdown = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockCount = 0;

    const formatInline = (text: string): React.ReactNode => {
      // Inline code `code`
      const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="morrow-inline-code">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      // Check code block fence
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace(/^```/, '') || 'plaintext';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const codeText = codeBuffer.join('\n');
          const currentCount = codeBlockCount++;
          const isCopied = copiedCodeIndex === currentCount;

          elements.push(
            <div key={`code-${index}`} className="morrow-code-block-wrapper">
              <div className="morrow-code-header">
                <span className="morrow-code-lang">{codeLanguage}</span>
                <button
                  type="button"
                  className="morrow-copy-btn"
                  onClick={() => copyToClipboard(codeText, currentCount)}
                  aria-label="Copy code to clipboard"
                >
                  {isCopied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="morrow-code-pre">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<div key={`spacer-${index}`} className="morrow-md-spacer" />);
        return;
      }

      if (trimmed === '---') {
        elements.push(<hr key={`hr-${index}`} className="morrow-md-divider" />);
        return;
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="morrow-md-h1">
            {trimmed.replace(/^#\s+/, '')}
          </h1>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="morrow-md-h2">
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="morrow-md-h3">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${index}`} className="morrow-md-quote">
            {formatInline(trimmed.replace(/^>\s+/, ''))}
          </blockquote>
        );
        return;
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <li key={`li-${index}`} className="morrow-md-li">
            <span className="bullet">▹</span>
            <span>{formatInline(trimmed.replace(/^[*\-]\s+/, ''))}</span>
          </li>
        );
        return;
      }

      elements.push(
        <p key={`p-${index}`} className="morrow-md-p">
          {formatInline(trimmed)}
        </p>
      );
    });

    return elements;
  };

  return (
    <div
      className="morrow-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-article-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="morrow-modal-card" ref={containerRef} onScroll={handleScroll}>
        {/* Reading progress indicator */}
        <div
          className="morrow-modal-progress"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {/* Modal sticky top toolbar */}
        <div className="morrow-modal-toolbar">
          <div className="morrow-modal-meta">
            <span className="morrow-eyebrow">{article.category}</span>
            <span className="morrow-project-dot">·</span>
            <span className="morrow-eyebrow">{article.readTime}</span>
          </div>

          <button
            type="button"
            className="morrow-modal-close-btn"
            onClick={onClose}
            aria-label="Close reader overlay"
          >
            <span>Close</span>
            <span className="key-hint">ESC</span>
          </button>
        </div>

        {/* Article Header */}
        <div className="morrow-modal-header">
          <h1 id="modal-article-title" className="morrow-modal-title">
            {article.title}
          </h1>
          <div className="morrow-modal-date-row">
            <span className="morrow-eyebrow">{article.date}</span>
            <div className="morrow-modal-tags">
              {article.tags.map((t) => (
                <span key={t} className="morrow-tag-pill">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="morrow-modal-body">{renderMarkdown(article.content)}</div>

        {/* Modal Footer */}
        <div className="morrow-modal-footer">
          <p className="morrow-eyebrow">
            Written by Morrow · published on thatdaringblogue.me
          </p>
          <button type="button" className="morrow-theme-btn" onClick={onClose}>
            Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
};
