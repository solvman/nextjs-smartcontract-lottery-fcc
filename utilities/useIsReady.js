import { useState } from "react";

export function useIsReady() {
  const [ready, setReady] = useState(false);

  useState(function () {
    setReady(true);
  }, []);

  return ready;
}
