// controllers/conversationController.js

import Conversation from '../model/conversation.model.js';
import User from '../model/usermodel.js'; // Import your User model

// Controller function for creating conversations
export const createConversation = async (req, res) => {
    try {
        let clientId, freelancerId;
        // Assuming req.user.role contains the user's role (e.g., "admin", "client", "freelancer")
        if (req.role === "client") {
            clientId = req.id; // Current user is the client
            freelancerId = req.body.to;
        } else if (req.role === "freelancer") {
            clientId = req.body.to;
            freelancerId = req.id; // Current user is the freelancer
        } else {
            return res.status(400).json({ message: "Invalid user role" });
        }

        console.log("freelancerId :" + freelancerId + " client Id : " +clientId);
/*
        // Ensure that the client and freelancer roles are correct
        if (req.role === "client" && req.body.toRole !== "freelancer") {
            return res.status(400).json({ message: "Conversation can only be created with a freelancer" });
        }
        if (req.role === "freelancer" && req.body.toRole !== "client") {
            return res.status(400).json({ message: "Conversation can only be created with a client" });
        }
*/

        // Check if the client and freelancer exist
        const [client, freelancer] = await Promise.all([
            User.findById(clientId),
            User.findById(freelancerId)
        ]);

        if (!client || !freelancer) {
            return res.status(404).json({ message: "Client or freelancer not found" });
        }

        // Generate a unique conversation ID
        const conversationId = clientId + freelancerId;
        // Create the conversation object
        const conversation = new Conversation({
            id: conversationId,
            clientId: clientId,
            freelancerId: freelancerId
        });
        // Save the conversation
        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const getConversation = async (req, res, next) => {
    try {
        const { conversationId } = req.params; // Extract conversation ID from request parameters
        const { userId, role } = req; // Extract user ID and role from request

        // Define the query based on the user's role
        const query = role === 'client' ? { clientId: userId } : { freelancerId: userId };

        // Find the conversation in the database by its ID and the user's role
        const conversation = await Conversation.findOne({ id: conversationId, ...query });

        // If the conversation is not found or the user is unauthorized, return a 404 or 403 error response
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // If the user is authorized, return the conversation in the response
        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

