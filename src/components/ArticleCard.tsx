import React from 'react';
import { ArticleItem } from '../data/types';

interface ArticleCardProps {
  article: ArticleItem;
  onSelect: (article: ArticleItem) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  return (
    <article
      className="morrow-article-card"
      onClick={() => onSelect(article)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(article);
        }
      }}
      aria-label={`Read ${article.title}`}
    >
      <div className="morrow-article-meta">
        <span className="morrow-eyebrow morrow-article-cat">{article.category}</span>
        <span className="morrow-project-dot">·</span>
        <span className="morrow-eyebrow">{article.date}</span>
        <span className="morrow-project-dot">·</span>
        <span className="morrow-eyebrow morrow-read-time">{article.readTime}</span>
      </div>

      <h3 className="morrow-article-title">{article.title}</h3>
      <p className="morrow-article-summary">{article.summary}</p>

      <div className="morrow-article-footer">
        <div className="morrow-article-tags">
          {article.tags.map((tag) => (
            <span key={tag} className="morrow-tag-pill">
              #{tag}
            </span>
          ))}
        </div>
        <span className="morrow-read-link">
          Read Article <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
};
