import { BoardModel, ClientModel } from "@swooche/models";
import { z } from "zod";
import { protectedProcedure } from "../procedures";
import { router } from "../trpc";

export const clientRouter = router({
  // Get all clients for the current user's account
  getClients: protectedProcedure.query(async ({ ctx }) => {
    try {
      const clients = await ClientModel.find({
        accountId: ctx.user.accountId,
      }).sort({ name: 1 });

      return {
        success: true,
        clients: clients.map((client) => ({
          _id: client._id.toString(),
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
          createdAt: client.createdAt,
        })),
      };
    } catch (error) {
      console.error("❌ Error fetching clients:", error);
      throw new Error("Failed to fetch clients");
    }
  }),

  // Create a new client
  createAClient: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Client name must be at least 2 characters"),
        email: z.string().email().or(z.literal("")).optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("👤 Creating new client:", input);

        const client = await ClientModel.create({
          accountId: ctx.user.accountId,
          name: input.name,
          email: input.email || undefined,
          phone: input.phone || undefined,
          company: input.company || undefined,
          createdBy: ctx.user._id,
        });

        console.log("✅ Client created successfully:", client._id);

        return {
          success: true,
          client: {
            _id: client._id.toString(),
            name: client.name,
            email: client.email,
            phone: client.phone,
            company: client.company,
            createdAt: client.createdAt,
          },
        };
      } catch (error) {
        console.error("❌ Error creating client:", error);
        throw new Error("Failed to create client");
      }
    }),

  // Update an existing client
  updateClient: protectedProcedure
    .input(
      z.object({
        clientId: z.string().min(1, "Client ID is required"),
        name: z.string().min(2, "Client name must be at least 2 characters"),
        email: z.string().email().or(z.literal("")).optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("✏️ Updating client:", input);

        // Find the client and ensure it belongs to the user's account
        const client = await ClientModel.findOne({
          _id: input.clientId,
          accountId: ctx.user.accountId,
        });

        if (!client) {
          throw new Error("Client not found or access denied");
        }

        // Update the client
        const updatedClient = await ClientModel.findByIdAndUpdate(
          input.clientId,
          {
            name: input.name,
            email: input.email || undefined,
            phone: input.phone || undefined,
            company: input.company || undefined,
          },
          { new: true }
        );

        if (!updatedClient) {
          throw new Error("Failed to update client");
        }

        console.log("✅ Client updated successfully:", updatedClient._id);

        return {
          success: true,
          client: {
            _id: updatedClient._id.toString(),
            name: updatedClient.name,
            email: updatedClient.email,
            phone: updatedClient.phone,
            company: updatedClient.company,
            createdAt: updatedClient.createdAt,
          },
        };
      } catch (error) {
        console.error("❌ Error updating client:", error);
        throw new Error("Failed to update client");
      }
    }),

  // Delete a client
  deleteClient: protectedProcedure
    .input(
      z.object({
        clientId: z.string().min(1, "Client ID is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🗑️ Deleting client:", input.clientId);

        // Find the client and ensure it belongs to the user's account
        const client = await ClientModel.findOne({
          _id: input.clientId,
          accountId: ctx.user.accountId,
        });

        if (!client) {
          throw new Error("Client not found or access denied");
        }

        // Delete all boards associated with the client
        await BoardModel.deleteMany({
          clientId: client._id,
          accountId: ctx.user.accountId,
        });

        // Delete the client
        await ClientModel.findByIdAndDelete(client._id);

        console.log("✅ Client deleted successfully:", input.clientId);

        return {
          success: true,
          message: "Client deleted successfully",
        };
      } catch (error) {
        console.error("❌ Error deleting client:", error);
        throw new Error("Failed to delete client");
      }
    }),
});
