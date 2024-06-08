import Conversation from "../../../../db/model/chatmodel.js";
import Message from "../../../../db/model/messagemodel.js";
//import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);
		/*
	
			// SOCKET IO FUNCTIONALITY WILL GO HERE
			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				// io.to(<socket_id>).emit() used to send events to specific client
				io.to(receiverSocketId).emit("newMessage", newMessage);
			}
		*/

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getChat = async (req, res) => {
	try {

		const conversation = await Conversation.findById(req.params.id).populate('participants').populate('messages');
		if (!conversation) {
			return res.status(404).json({ message: 'Chat not found' });
		}
		res.json(conversation);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error' });
	}
};

export const lastMessage = async (req, res) => {
	try {
		const conversation = await Conversation.findById(req.params.id).populate({
			path: 'messages',
			options: { sort: { createdAt: -1 }, limit: 1 } // Sort messages by createdAt field in descending order to get the last one
		});
		if (!conversation || conversation.messages.length === 0) {
			return res.status(404).json({ message: 'Chat or message not found' });
		}
		res.json(conversation.messages[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error' });
	}
};

export const userChats = async (req, res) => {
	try {
		const userId = req.params.userId;
		const conversations = await Conversation.find({ participants: userId }).populate('participants').populate({
			path: 'messages',
			options: { sort: { createdAt: -1 }, limit: 1 } // Get the last message in each chat
		});
		res.json(conversations);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error' });
	}
};
