import type { QuerySnapshot } from 'firebase/firestore';
import { deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { v5 as uuidV5 } from 'uuid';

import { useNuxtApp } from '#app';

import { UUID_NAMESPACE } from '~/utils/constants';
import { checkIfImageExists, getFavicon } from '~/utils/helpers';
import type { LinkDetails } from '~/utils/types';

const nuxtApp = useNuxtApp();

export type LinkStoreState = {
  links: Array<LinkDetails>;
  loaded: boolean;
};

export const useLinkStore = defineStore('links', {
  state: (): LinkStoreState => ({
    links: [],
    loaded: false,
  }),
  actions: {
    async _handleSnapshot(querySnapshot: QuerySnapshot<LinkDetails>) {
      const links: Array<LinkDetails> = [];

      for (const doc of querySnapshot.docs) {
        const linkObject = doc.data();
        linkObject.imageExists = await checkIfImageExists(getFavicon(linkObject.link));
        links.push(linkObject);
      }
      this.links = links;
      this.loaded = true;
    },

    init() {
      onSnapshot(query(nuxtApp.$collections.links), querySnapshot => {
        this._handleSnapshot(querySnapshot);
      });
    },

    async addlink(newLink: LinkDetails) {
      try {
        await setDoc(
          doc(nuxtApp.$collections.links, uuidV5(newLink.title, UUID_NAMESPACE)),
          newLink,
        );
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
        throw handledError;
      }
    },

    async deleteLink(link: LinkDetails) {
      try {
        await deleteDoc(doc(nuxtApp.$collections.links, uuidV5(link.title, UUID_NAMESPACE)));
      } catch (error) {
        const handledError = error instanceof Error ? error : new Error('Unexpected error');
        nuxtApp.$logError(handledError);
      }
    },
  },
});
