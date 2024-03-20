const db = require("../db/db");

exports.createEvent = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const eventData = req.body;

		const result = await collection.insertOne(eventData);

		console.log(`Successfully inserted event with _id: ${result.insertedId}`);
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(201).send({ message: "Event created successfully" });
	} catch (error) {
		console.error("Error inserting event:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

exports.getEvents = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const userEmail = req.query.userEmail;
		let events;

		if (userEmail) {
			events = await collection.find({ userEmail: userEmail }).toArray();
		} else {
			events = await collection.find().toArray();
		}

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(events);
	} catch (error) {
		console.error("Error retrieving events:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

exports.getEventsByEmail = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const userEmail = req.query.userEmail;
		let events;

		if (userEmail) {
			events = await collection.find({ userEmail: userEmail }).toArray();
		} else {
			res.status(400).send({ message: "No userEmail provided" });
			return;
		}

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(events);
	} catch (error) {
		console.error("Error retrieving events:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

exports.requestToJoinEvent = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;
  
	try {
	  const event = await Event.findById(eventId);
	  if (!event) {
		return res.status(404).json({ message: 'Event not found' });
	  }
  
	  // Add the user's email to the participants array
	  event.participants.push(userEmail);
	  await event.save();
  
	  console.log(`User ${userEmail} joined event ${eventId}`);
	  res.status(200).json({ message: 'Join request successful', event: event });
	} catch (error) {
	  console.error('Error joining event:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
};
  