import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/schibsted-grotesk";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";

// The same font packages as the app (frontend/package.json). Every capsule calls
// useFontsReady() before measuring text: measured with a fallback face, the layout of the
// first frames would be wrong and jump.

const FACES = [
  '400 100px "Schibsted Grotesk Variable"',
  '500 100px "Schibsted Grotesk Variable"',
  '600 100px "Bricolage Grotesque Variable"',
  '700 100px "Bricolage Grotesque Variable"',
];
// Makes the browser fetch the subsets the copy needs: accents, ’, …, −
const SAMPLE = "AaÉéèêàçôù’…—0123456789:−";

let ready: Promise<unknown> | null = null;
const loadFonts = () => {
  ready ??= Promise.all(FACES.map((face) => document.fonts.load(face, SAMPLE))).then(() => document.fonts.ready);
  return ready;
};

/** False until both faces are loaded; the render waits for them. */
export const useFontsReady = () => {
  const [loaded, setLoaded] = useState(false);
  const [handle] = useState(() => delayRender("Loading the AutoTrim fonts"));
  useEffect(() => {
    loadFonts().then(
      () => {
        setLoaded(true);
        continueRender(handle);
      },
      (error) => cancelRender(error)
    );
  }, [handle]);
  return loaded;
};
