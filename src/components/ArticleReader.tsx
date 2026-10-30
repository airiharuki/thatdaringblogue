import React, { useState } from 'react';
import katex from 'katex';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ArticleItem } from '../data/types';

interface ArticleReaderProps {
  article: ArticleItem;
  onBack: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onBack }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const renderMathAndText = (text: string): React.ReactNode => {
    // Split by inline math $...$ and inline code `...` and bold **...**
    const parts = text.split(/(\$[^\$]+\$|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1);
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={i}>{part}</code>;
        }
      }
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

  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const nodes: React.ReactNode[] = [];
    let inCode = false;
    let codeLang = '';
    let codeBuffer: string[] = [];
    let codeCount = 0;
    let listBuffer: string[] = [];
    let inList = false;

    const flushList = () => {
      if (inList && listBuffer.length > 0) {
        nodes.push(
          <ul key={`list-${nodes.length}`}>
            {listBuffer.map((item, idx) => (
              <li key={idx}>{renderMathAndText(item)}</li>
            ))}
          </ul>
        );
        listBuffer = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code blocks
      if (trimmed.startsWith('```')) {
        flushList();
        if (!inCode) {
          inCode = true;
          codeLang = trimmed.replace(/^```/, '') || 'plaintext';
          codeBuffer = [];
        } else {
          inCode = false;
          const codeText = codeBuffer.join('\n');
          const idx = codeCount++;
          nodes.push(
            <div key={`code-${i}`} className="morrow-code-block-wrapper">
              <div className="morrow-code-header">
                <span className="morrow-code-lang">{codeLang}</span>
                <button
                  type="button"
                  className="morrow-copy-btn"
                  onClick={() => copyCode(codeText, idx)}
                  aria-label="Copy code"
                >
                  {copiedIndex === idx ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="morrow-code-content">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCode) {
        codeBuffer.push(line);
        continue;
      }

      // Display math $$ ... $$
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
        flushList();
        const math = trimmed.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          nodes.push(
            <div
              key={`math-${i}`}
              className="katex-display"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          nodes.push(<pre key={`math-${i}`}>{math}</pre>);
        }
        continue;
      }

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***') {
        flushList();
        nodes.push(<hr key={`hr-${i}`} />);
        continue;
      }

      // Headings
      if (trimmed.startsWith('# ')) {
        flushList();
        nodes.push(<h1 key={`h1-${i}`}>{renderMathAndText(trimmed.slice(2))}</h1>);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        nodes.push(<h2 key={`h2-${i}`}>{renderMathAndText(trimmed.slice(3))}</h2>);
        continue;
      }
      if (trimmed.startsWith('### ')) {
        flushList();
        nodes.push(<h3 key={`h3-${i}`}>{renderMathAndText(trimmed.slice(4))}</h3>);
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        flushList();
        nodes.push(
          <blockquote key={`quote-${i}`}>
            <p>{renderMathAndText(trimmed.slice(2))}</p>
          </blockquote>
        );
        continue;
      }

      // Unordered lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        inList = true;
        listBuffer.push(trimmed.slice(2));
        continue;
      }

      flushList();

      // Empty line
      if (!trimmed) {
        continue;
      }

      // Paragraph
      nodes.push(<p key={`p-${i}`}>{renderMathAndText(trimmed)}</p>);
    }

    flushList();
    return nodes;
  };

  return (
    <article className="morrow-reader-page">
      <button
        type="button"
        className="morrow-text-action-btn"
        onClick={onBack}
        style={{ marginBottom: 24, padding: 0, background: 'none', border: 'none' }}
      >
        <ArrowLeft size={16} />
        <span>All articles</span>
      </button>

      <header className="morrow-reader-header">
        <p className="morrow-eyebrow">
          {article.category} / {article.readTime}
        </p>
        <h1 className="morrow-headline">{article.title}</h1>
        <p className="morrow-body-secondary">{article.summary}</p>
        <time className="morrow-eyebrow" dateTime={article.date}>
          {article.date}
        </time>
        <div className="morrow-article-tags">
          {article.tags.map((tag) => (
            <span key={tag} className="morrow-tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="morrow-markdown">{renderContent(article.content)}</div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          className="morrow-text-action-btn"
          onClick={onBack}
          style={{ padding: 0, background: 'none', border: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>All articles</span>
        </button>
      </div>
    </article>
  );
};
