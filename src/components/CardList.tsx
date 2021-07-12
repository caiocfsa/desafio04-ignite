import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onClose, onOpen } = useDisclosure();
  // TODO SELECTED IMAGE URL STATE
  const [selectedImage, setSelectedImage] = useState('');
  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(imageUrl: string): void {
    setSelectedImage(imageUrl);
    onOpen();
  }

  return (
    <>
      <SimpleGrid gap="4">
        {cards.map(card => (
          <Card data={card} viewImage={() => handleViewImage(card.url)} />
        ))}
      </SimpleGrid>
      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={selectedImage}
      />
    </>
  );
}
