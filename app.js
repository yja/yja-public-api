"use strict";
const express = require("express");
const app = express();
var cors = require('cors');
const { getEventList, getEventById, getCommunityList } = require("./db_utils");

app.use(cors());

app.get("/community/list", async (req, res) => {
  const community = await getCommunityList();
  return res.json({
    community
  });
});

app.get("/events/list", async (req, res) => {
  const events = await getEventList();
  return res.json({
    events
  });
});

app.get("/event/:eventId", async (req, res) => {
  const event = await getEventById(req.params.eventId);
  if (!event) {
    return res.status(500).send({
      error: "Invalid event id"
    });
  }
  return res.json({
    event
  });
});

// app.listen(4000); // <-- comment this line out from your app

module.exports = app; // export your app so aws-serverless-express can use it
