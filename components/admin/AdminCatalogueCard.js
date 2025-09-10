import styled from "styled-components";
import Link from "next/link";
import DeletePopUp from "@/components/DeletePopUp";
import { useState } from "react";
export default function AdminCatalogueCard({
  plant,
  onDelete,
  onTogglePublic,
}) {
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <Card>
      <LinkWrapper href={`/plants/${plant._id}`}>
        <Image src={plant.imageUrl} alt={plant.name} />
        <NameContent>
          <h3>{plant.name}</h3>
          <p>{plant.isPublic ? "Public" : "Private"}</p>
        </NameContent>
      </LinkWrapper>
      <CRUDContent>
        <Link className="edit" href={`/plants/${plant._id}/edit`}>
          edit
        </Link>
        <button
          className="delete"
          onClick={() => {
            setShowPopUp(true);
          }}
          aria-label="Delete this plant"
        >
          Delete
        </button>
        <button
          className="togglepublic"
          onClick={() => onTogglePublic(plant._id)}
        >
          make {plant.isPublic ? "private" : "public"}
        </button>
      </CRUDContent>
      {showPopUp && (
        <DeletePopUp
          onDelete={() => {
            setShowPopUp(false);
            onDelete(plant._id);
          }}
          onCancel={() => setShowPopUp(false)}
        />
      )}
    </Card>
  );
}

const Card = styled.div`
  border: var(--border-sm-dark);
  padding: var(--padding-bg-sm);
  margin-bottom: 10px;
  border-radius: var(--radius-md);
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--color-neutral-base);
  background-color: var(--color-secondary-dark);
`;

const LinkWrapper = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  flex: 2;
  text-decoration: none;
  color: inherit;
  &:visited {
    color: inherit;
  }
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
`;

const NameContent = styled.div`
  margin-left: 10px;
`;
const CRUDContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "edit delete"
    "togglepublic togglepublic";
  gap: 10px;
  flex: 1;
  align-items: center;
  & > button,
  & > a {
    width: 100%;
    padding: var(--padding-small) 0;
    border-radius: var(--radius-md);
    border: var(--border-sm-dark);
    background: var(--color-secondary);
    color: var(--color-text-dark);
    font-size: var(--font-size-md);
    text-align: center;
    text-decoration: none;
    display: block;
  }

  & > .edit {
    grid-area: edit;
  }
  & > .delete {
    grid-area: delete;
  }
  & > .togglepublic {
    grid-area: togglepublic;
  }
`;
