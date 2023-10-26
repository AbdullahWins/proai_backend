// Controllers/deviceTrackerContorller.js
const { deviceTrackersCollection } = require("../../config/database/db");
const { Timekoto } = require("timekoto");

//get single deviceTracker
const getOnedeviceTracker = async (req, res) => {
  try {
    const deviceId = req?.params?.deviceId;
    const deviceTracker = await deviceTrackersCollection.findOne({
      deviceId: deviceId,
    });
    if (!deviceTracker) {
      res.status(500).send({ message: "deviceTracker not found" });
    } else {
      res.send(deviceTracker);
      console.log(deviceTracker);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

//add new deviceTracker
const addOnedeviceTracker = async (req, res) => {
  try {
    const data = req?.body;
    if (data === null) {
      return res.status(400).send("No data sent");
    }
    const { deviceId, imageCounter, textCounter } = data;
    //validate inputs
    if (!deviceId) {
      return res.status(400).send("Incomplete Inputs");
    }
    const query = { deviceId: deviceId };
    //formatdata
    let formattedData = {
      deviceId,
      imageCounter,
      textCounter,
      updatedAt: Timekoto(),
    };
    //check if deviceTracker already exists
    const deviceTrackerExists = await deviceTrackersCollection.findOne({
      deviceId: deviceId,
    });
    if (deviceTrackerExists) {
      const updatedData = { ...data };
      const result = await deviceTrackersCollection.updateOne(query, {
        $set: updatedData,
      });
      if (result?.acknowledged === false) {
        return res.status(500).send({ message: "Failed to add deviceTracker" });
      } else {
        const tracker = { ...deviceTrackerExists, ...formattedData };
        console.log(tracker);
        return res.send(tracker);
      }
    } else {
      //store data on database
      formattedData = { ...formattedData, createdAt: Timekoto() };
      const result = await deviceTrackersCollection.insertOne(formattedData);
      if (result?.acknowledged === false) {
        return res.status(500).send({ message: "Failed to add deviceTracker" });
      }
      console.log(formattedData);
      return res.send(formattedData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to add deviceTracker" });
  }
};

const updatedeviceTrackerById = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const query = { deviceId: deviceId };

    // Retrieve the full document from the database
    const existingDocument = await deviceTrackersCollection.findOne(query);

    if (!existingDocument) {
      return res.status(404).send({ message: "Device not found" });
    }

    const data = req?.body;
    let formattedData = { ...existingDocument, ...data, updatedAt: Timekoto() };

    // Update the full document in the database
    const result = await deviceTrackersCollection.replaceOne(
      query,
      formattedData
    );
    if (result?.acknowledged === false) {
      return res
        .status(500)
        .send({ message: "Failed to update deviceTracker" });
    }
    res.send(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to update deviceTracker" });
  }
};

//delete one deviceTracker
const deleteOnedeviceTrackerById = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const query = { deviceId: deviceId };
    const result = await deviceTrackersCollection.deleteOne(query);
    console.log(result);
    if (result?.deletedCount === 0) {
      console.log("no deviceTracker found with this id:", deviceId);
      res.send({ message: "no deviceTracker found with this id!" });
    } else {
      console.log("deviceTracker deleted:", deviceId);
      res.status(200).send({ message: "deviceTracker deleted!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to delete deviceTracker!" });
  }
};

module.exports = {
  getOnedeviceTracker,
  addOnedeviceTracker,
  updatedeviceTrackerById,
  deleteOnedeviceTrackerById,
};
