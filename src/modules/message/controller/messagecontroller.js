import Message from '../../../../db/model/message.model.js';
import Conversation from '../../../../db/model/conversation.model.js';

export const createMessage = async (req, res, next) => {
    const { conversationId, desc } = req.body;
    const { id, role } = req;

    try {
        // Create a new message
        const newMessage = new Message({
            conversationId,
            userId: id,
            desc,
        });

        // Save the new message
        const savedMessage = await newMessage.save();

        // Update conversation based on sender's role
        let updateFields = {};
        if (role === 'client') {
            updateFields = {
                readByClient: true,
                readByFreelancer: false,
                lastMessage: desc,
            };
        } else if (role === 'freelancer') {
            updateFields = {
                readByClient: false,
                readByFreelancer: true,
                lastMessage: desc,
            };
        } else {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        // Update conversation in the database using $set operator to preserve existing fields
        const updatedConversation = await Conversation.findOneAndUpdate(
            { id: conversationId },
            { $set: updateFields },
            { new: true }
        );

        res.status(201).json({ message: 'Message created', savedMessage, updatedConversation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Fetch messages for the given conversation ID
        const messages = await Message.find({ conversationId });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

