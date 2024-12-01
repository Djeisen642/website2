import { Timestamp } from 'firebase/firestore';
import type { BlogPost } from './types';

export function postTimestamps(post: BlogPost, noTime = false) {
  if (!post.createdAt || !post.updatedAt) return '';
  const functionName = noTime ? 'toLocaleDateString' : 'toLocaleString';
  const writtenOrPostedOn = post.postedAt
    ? `posted on ${post.postedAt.toDate()[functionName]()}`
    : `written on ${post.createdAt.toDate()[functionName]()}`;

  if (!post.updatedAt || (post.postedAt || post.createdAt).toMillis() === post.updatedAt.toMillis())
    return writtenOrPostedOn;

  return `${writtenOrPostedOn}, updated on ${post.updatedAt.toDate()[functionName]()}`;
}

export function getTimestamps() {
  const nowInS = Math.floor(Date.now() / 1000);
  const milliseconds = Math.floor(Date.now() % 1000);
  return {
    postedAt: new Timestamp(nowInS, milliseconds),
    createdAt: new Timestamp(nowInS, milliseconds),
    updatedAt: new Timestamp(nowInS, milliseconds),
  };
}
