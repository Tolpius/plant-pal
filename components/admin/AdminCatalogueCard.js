import styled from "styled-components";
import Link from "next/link";
export default function AdminCatalogueCard({ plant }) {
  return (
    <Card
      href={{
        pathname: "/plants/[id]",
        query: { id: plant._id, from: "/admin/catalogue" },
      }}
    >
      <Image src={plant.imageUrl} alt={plant.name} />
      <Content>
        <h3>{plant.name}</h3>
        <p>{plant.isPublic ? "Public" : "Private"}</p>
      </Content>
    </Card>
  );
}

const Card = styled(Link)`
  border: var(--border-sm-dark);
  padding: var(--padding-bg-sm);
  margin-bottom: 10px;
  border-radius: var(--radius-md);
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--color-neutral-dark);
  background-color: var(--color-white);
  text-decoration: none;
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

const Content = styled.div`
  flex: 1;
`;
