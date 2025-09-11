import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Dialog,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { MdCheck, MdContentCopy, MdShare } from "react-icons/md";
import { toaster } from "./ui/toaster";
import { getBaseWebsiteUrl } from "@/config";

interface PublishBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
  publicUrl?: string;
  onPublishSuccess?: () => void;
}

export const PublishBoardModal: FC<PublishBoardModalProps> = ({
  isOpen,
  onClose,
  boardId,
  boardName,
  publicUrl,
  onPublishSuccess,
}) => {
  const [isCopying, setIsCopying] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const publishBoardMutation = trpc.board.publishBoard.useMutation({
    onSuccess: (data) => {
      console.log("Board published successfully:", data);
      setPublishSuccess(true);
      toaster.create({
        title: "🎉 Board Published!",
        description: "Your board is now live and shareable with the world!",
        type: "success",
      });
      // Call the parent callback to refetch board data
      onPublishSuccess?.();
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
        title: "Link copied!",
        description: "The public board URL has been copied to your clipboard.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toaster.create({
        title: "Failed to copy",
        description: "Could not copy the URL to clipboard.",
        type: "error",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleClose = () => {
    setPublishSuccess(false);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="lg">
          <Dialog.Header>
            <Dialog.Title>
              {publishSuccess
                ? "🎉 Board Published!"
                : `Ready to share "${boardName}" with the world?`}
            </Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            {!publishSuccess ? (
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
                      p={2}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      fontFamily="mono"
                      height="40px"
                      display="flex"
                      alignItems="center"
                      justifyContent="start"
                      fontSize="sm"
                    >
                      {publicUrl ||
                        `${getBaseWebsiteUrl()}/boards/your-board-slug`}
                    </Box>
                  </VStack>
                </VStack>

                <HStack justify="space-between">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="green"
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

                  <VStack gap={2} align="stretch" w="full">
                    <Text fontSize="sm" color="gray.600">
                      Public URL:
                    </Text>
                    <Box
                      p={3}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      fontFamily="mono"
                      fontSize="sm"
                      wordBreak="break-all"
                    >
                      {publicUrl}
                    </Box>
                  </VStack>

                  <HStack gap={2} w="full">
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      loading={isCopying}
                      flex={1}
                    >
                      <Icon as={MdContentCopy} />
                      Copy Link
                    </Button>
                    <Button colorScheme="blue" onClick={handleClose}>
                      Done
                    </Button>
                  </HStack>
                </VStack>
              </VStack>
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
