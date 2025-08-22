import useLocalStorage from "use-local-storage";

export default function HeartButton() {
  const { ownedPlantIds, setOwnedPlantIds } = useLocalStorage(
    "ownedPlantIds",
    []
  );
  return (
    <HerzButton type="button" onClick={handleToggleOwned}>
      {isOwend === false ? "🩶" : "❤️"}
    </HerzButton>
  );
}

const HerzButton = styled.button`
  position: absolute;
  font-size: 1.25rem;
  border-style: none;
  width: 2em;
  height: 2em;
  bottom: -15px;
  transform: translateX(-50%);
  left: 50%;
  background: white;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  z-index: 2;
`;
