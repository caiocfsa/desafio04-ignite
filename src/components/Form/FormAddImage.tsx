import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, RegisterOptions, Validate } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

type ImageInputFields = {
  image: string;
  title: string;
  description: string;
};

type FormValidations = {
  image: RegisterOptions;
  title: RegisterOptions;
  description: RegisterOptions;
};

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations: FormValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: true,
      validate: {
        lessThan10MB: file => file.size <= 10240,
        acceptedFormats: file =>
          ['image/jpeg', 'image/png', 'image/gif'].some(
            value => value === file.type
          ),
      },
    },
    title: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      required: true,
      maxLength: 65,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newImage: ImageInputFields) => api.post('/api/images', newImage),
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm<ImageInputFields>();
  const { errors } = formState;

  const onSubmit = async (data: ImageInputFields): Promise<void> => {
    try {
      if (!data.image) {
        toast({
          title: 'Image not found!',
          duration: 4000,
          status: 'error',
          isClosable: true,
        });
      }
      mutation.mutate(data);

      toast({
        title: 'Image successfully updated!',
        duration: 4000,
        status: 'success',
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Something went wrong!',
        duration: 4000,
        status: 'error',
        isClosable: true,
      });
    } finally {
      reset();
      closeModal();
      setImageUrl('');
      setLocalImageUrl('');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="image"
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
