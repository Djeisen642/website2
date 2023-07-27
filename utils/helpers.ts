/**
 * @function checkIfImageExists
 * @description Checks if image exists in the URL address provided in the first parameter.
 * @param { string } url - Url.
 * @author Kallil Belmonte
 * @see CodePen {@link https://codepen.io/kallil-belmonte/full/KKKRoyx}
 */

export function checkIfImageExists(url: string): Promise<boolean> {
  const img = new Image();
  img.src = url;

  return new Promise(resolve => {
    if (img.complete) {
      resolve(true);
      return;
    }
    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };
  });
}

export function getFavicon(url: string): string {
  return `${new URL(url).origin}/favicon.ico`;
}
