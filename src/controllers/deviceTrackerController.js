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
      res.status(404).send({ message: "deviceTracker not found" });
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
    console.log(data);
    const { deviceId, imageCounter, textCounter } = data;
    //validate inputs
    if (!deviceId || !imageCounter || !textCounter) {
      return res.status(400).send("Incomplete Inputs");
    }
    //check if deviceTracker already exists
    const deviceTrackerExists = await deviceTrackersCollection.findOne({
      deviceId: deviceId,
    });
    if (deviceTrackerExists) {
      return res.status(400).send({ message: "deviceTracker already exists" });
    }
    //formatdata
    let formattedData = {
      deviceId,
      imageCounter,
      textCounter,
      updatedAt: Timekoto(),
    };
    //store data on database
    const result = await deviceTrackersCollection.insertOne(formattedData);
    if (result?.acknowledged === false) {
      return res.status(500).send({ message: "Failed to add deviceTracker" });
    }
    res.send(formattedData);
    console.log(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to add deviceTracker" });
  }
};

//update one deviceTracker
const updatedeviceTrackerById = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const query = { deviceId: deviceId };
    const data = req?.body;
    let formattedData = { ...data };
    if (!formattedData) {
      return res.status(400).send({ message: "Incomplete Inputs" });
    }
    //update data on database
    const result = await deviceTrackersCollection.updateOne(query, {
      $set: formattedData,
    });
    if (result?.modifiedCount === 0) {
      return res.status(500).send({ message: "No modifications were made" });
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
