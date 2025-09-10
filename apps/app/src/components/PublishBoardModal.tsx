import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Dialog,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import {
  MdCheck,
  MdClose,
  MdContentCopy,
  MdShare,
  MdWarning,
} from "react-icons/md";
import { toaster } from "./ui/toaster";
import { getBaseWebsiteUrl } from "@/config";

interface PublishBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
  publicUrl?: string;
}

export const PublishBoardModal: FC<PublishBoardModalProps> = ({
  isOpen,
  onClose,
  boardId,
  boardName,
  publicUrl,
}) => {
  const [isPublished, setIsPublished] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const publishBoardMutation = trpc.board.publishBoard.useMutation({
    onSuccess: (data) => {
      console.log("Board published successfully:", data);
      setIsPublished(true);
      toaster.create({
        title: "🎉 Board Published!",
        description: "Your board is now live and shareable with the world!",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error publishing board:", error);
      toaster.create({
        title: "Failed to Publish Board",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });

  const handlePublish = () => {
    publishBoardMutation.mutate({ boardId });
  };

  const handleCopyLink = async () => {
    if (!publicUrl) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(publicUrl);
      toaster.create({
        title: "Link Copied!",
        description: "The public board link has been copied to your clipboard.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toaster.create({
        title: "Failed to Copy Link",
        description: "Please copy the link manually.",
        type: "error",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleClose = () => {
    setIsPublished(false);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="lg">
          <Dialog.Header>
            <Dialog.Title>
              {isPublished
                ? "🎉 Board Published!"
                : `Ready to share "${boardName}" with the world?`}
            </Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            {!isPublished ? (
              <VStack gap={6} align="stretch">
                <VStack gap={8} align="stretch">
                  <VStack gap={2} align="stretch">
                    <Text fontWeight="semibold">Important</Text>
                    <Text fontSize="sm">
                      Once published, your board will be publicly accessible to
                      anyone with the link. Make sure there's no personal or
                      sensitive information on your board before publishing.
                    </Text>
                  </VStack>

                  <VStack gap={3} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      Your board will be available at:
                    </Text>
                    <Box
                      p={3}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      fontFamily="mono"
                      fontSize="sm"
                    >
                      {publicUrl}
                    </Box>
                  </VStack>
                </VStack>

                <HStack gap={3} justify="end">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handlePublish}
                    loading={publishBoardMutation.isPending}
                    loadingText="Publishing..."
                  >
                    <Icon as={MdShare} mr={2} />
                    Make Public
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <VStack gap={6} align="stretch">
                <VStack gap={4} align="center">
                  <Box
                    p={4}
                    bg="green.50"
                    border="1px solid"
                    borderColor="green.200"
                    borderRadius="full"
                  >
                    <Icon as={MdCheck} color="green.500" boxSize={8} />
                  </Box>

                  <VStack gap={2} align="center">
                    <Heading size="md" textAlign="center">
                      Your board is now live! 🎉
                    </Heading>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Share this link with anyone to let them view your board
                    </Text>
                  </VStack>
                </VStack>

                <VStack gap={3} align="stretch">
                  <Text fontSize="sm" fontWeight="semibold">
                    Public Board URL:
                  </Text>
                  <HStack gap={2}>
                    <Box
                      flex={1}
                      p={3}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      fontFamily="mono"
                      fontSize="sm"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {publicUrl}
                    </Box>
                    <IconButton
                      aria-label="Copy link"
                      onClick={handleCopyLink}
                      loading={isCopying}
                      variant="outline"
                    >
                      <Icon as={MdContentCopy} />
                    </IconButton>
                  </HStack>
                </VStack>

                <HStack gap={3} justify="end">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handleCopyLink}
                    loading={isCopying}
                  >
                    <Icon as={MdContentCopy} />
                    Copy Link
                  </Button>
                </HStack>
              </VStack>
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
