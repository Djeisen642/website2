import { Timestamp } from 'firebase/firestore';
import type { BlogPost } from './types';
import hljs from '@/utils/highlightjs';

export function postTimestamps(
  post: Pick<BlogPost, 'postedAt' | 'updatedAt' | 'createdAt'>,
  noTime = false,
) {
  if (!post.createdAt || !post.updatedAt) return '';
  const functionName = noTime ? 'toLocaleDateString' : 'toLocaleString';
  const writtenOrPostedOn = post.postedAt
    ? `posted on ${post.postedAt.toDate()[functionName]()}`
    : `written on ${post.createdAt.toDate()[functionName]()}`;

  if (!post.updatedAt || (post.postedAt || post.createdAt).toMillis() === post.updatedAt.toMillis())
    return writtenOrPostedOn;

  return `${writtenOrPostedOn}, updated on ${post.updatedAt.toDate()[functionName]()}`;
}

export function getTimestamps(): Pick<BlogPost, 'postedAt' | 'updatedAt' | 'createdAt'> {
  const nowInS = Math.floor(Date.now() / 1000);
  const milliseconds = Math.floor(Date.now() % 1000);
  return {
    postedAt: new Timestamp(nowInS, milliseconds),
    createdAt: new Timestamp(nowInS, milliseconds),
    updatedAt: new Timestamp(nowInS, milliseconds),
  };
}

export const convertBlogText = (blogText: string) => {
  const text = blogText
    .replace(/&nbsp;/g, ' ')
    .replace(/<p><\/p>/g, '<p><br></p>')
    .replace(/\t/g, '&emsp;');
  if (!text.includes('</pre>')) return text;
  const el = document.createElement('div');
  el.innerHTML = text;
  el.querySelectorAll('pre').forEach(pre => {
    const language = pre.getAttribute('data-language');
    if (!language) return;
    const code = hljs.highlight(pre.innerText, { language });
    pre.innerHTML = code.value;
  });

  return el.innerHTML;
};
