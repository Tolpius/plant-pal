import { useState } from "react";
import useSWR from "swr";

export default function FunFactDisplay() {
    const { data, isLoading } = useSWR(`/api/funfacts`);
  const [funFactPopUp, setFunFactPopUp] = useState(false);
  const [lastIndex, setLastIndex] = useState(null);

    if (isLoading) {
      return <p>Loading Funfact...</p>;
    }

  function getRandomIndex(lastIndex, length) {
    if (data.length <= 1) return 0;
    const newIndex = Math.floor(Math.random() * length);

    if (newIndex === lastIndex) {
      return getRandomIndex(lastIndex, length);
    }

    return newIndex;
  }

  function handleClick() {
    if (!data || data.length === 0) {
      setLastIndex(null);
    } else {
      const newIndex = getRandomIndex(lastIndex, data.length);
      setLastIndex(newIndex);
    }
    setFunFactPopUp(!funFactPopUp);
  }

  return (
    <>
      <button onClick={handleClick}>💡</button>
      {}
      {funFactPopUp && (
        <div>
          {!data || data.length === 0 ? (
            <p>Sorry no Funfacts here 🥺</p>
          ) : (
            lastIndex !== null && data[lastIndex].text
          )}
        </div>
      )}
    </>
  );
}
