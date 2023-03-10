/**
 * @function checkIfImageExists
 * @description Checks if image exists in the URL address provided in the first parameter.
 * @param { string } url - Url.
 * @author Kallil Belmonte
 * @see CodePen {@link https://codepen.io/kallil-belmonte/full/KKKRoyx}
 */

const checkIfImageExists = (url: string): Promise<boolean> => {
  const img = new Image();
  img.src = url;

  return new Promise(resolve => {
    if (img.complete) {
      resolve(true);
    } else {
      img.onload = () => {
        resolve(true);
      };

      img.onerror = () => {
        resolve(false);
      };
    }
  });
};

export { checkIfImageExists };
