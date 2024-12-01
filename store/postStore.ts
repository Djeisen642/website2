import type { QuerySnapshot } from 'firebase/firestore';
import { deleteDoc, doc, onSnapshot, query, setDoc, serverTimestamp } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { v5 as uuidV5 } from 'uuid';

import { useNuxtApp } from '#app';

import { UUID_NAMESPACE } from '~/utils/constants';
import type { User } from 'firebase/auth';

export type PostStoreState = {
  posts: Array<BlogPost>;
  loaded: boolean;
};

export const usePostStore = defineStore('posts', {
  state: (): PostStoreState => ({
    posts: [],
    loaded: false,
  }),
  actions: {
    _handleSnapshot(querySnapshot: QuerySnapshot<BlogPost>) {
      const posts: Array<BlogPost> = [];

      for (const doc of querySnapshot.docs) {
        posts.push({ ...doc.data(), id: doc.id });
      }
      console.log('posts', posts);
      this.posts = posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      this.loaded = true;
    },

    async init() {
      if (this.loaded) return;
      const { promise, resolve } = Promise.withResolvers<boolean>();
      const nuxtApp = useNuxtApp();
      onSnapshot(query(nuxtApp.$collections.posts), querySnapshot => {
        this._handleSnapshot(querySnapshot);
        resolve(true);
      });

      await promise;
    },

    async addPost(newPost: Omit<BlogPost, 'createdAt' | 'updatedAt' | 'id'>, user: User) {
      const nuxtApp = useNuxtApp();
      if (!user) throw new Error('User is not authenticated');
      if (!user.displayName) throw new Error('User display name is not set');
      try {
        const postId = uuidV5(newPost.title, UUID_NAMESPACE);
        await setDoc(doc(nuxtApp.$collections.posts, postId), {
          ...newPost,
          author: user.displayName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'draft',
        });
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
        throw handledError;
      }
    },

    async publishPost(postId: string) {
      const nuxtApp = useNuxtApp();
      try {
        await setDoc(
          doc(nuxtApp.$collections.posts, postId),
          {
            status: 'published',
            postedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
        throw handledError;
      }
    },

    async updatePost(post: BlogPost) {
      const nuxtApp = useNuxtApp();
      if (!post.id) throw new Error('Post ID is required for update');

      try {
        await setDoc(
          doc(nuxtApp.$collections.posts, post.id),
          {
            ...post,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
        throw handledError;
      }
    },

    async deletePost(post: BlogPost) {
      const nuxtApp = useNuxtApp();
      if (!post.id) throw new Error('Post ID is required for deletion');

      try {
        await deleteDoc(doc(nuxtApp.$collections.posts, post.id));
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
        throw handledError;
      }
    },
  },
});
