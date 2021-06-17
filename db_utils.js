"use strict";
const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "secretserver",
  database: "yja_laravel"
};
const pool = mysql.createPool(config);
const bucket_url = "https://yja-media-feferfre5435jkjkj567wer.s3.amazonaws.com";

async function getEventList() {
  var sql =
    "SELECT id AS event_id, name as event_title, region, start_date, start_time, end_date, end_time, location, city, state, CONCAT(?, SUBSTRING(banner, 9)) AS event_banner FROM events WHERE end_date >= CURDATE() AND status='Live / Upcoming';";
  var inserts = [bucket_url];
  sql = mysql.format(sql, inserts);
  const [rows] = await pool.execute(sql);
  return rows;
}

async function getEventById(eventId) {
  var sql =
    "SELECT id AS event_id, name as event_title, region, CONCAT(address_1, ' ',  COALESCE(address_2, '')) AS event_address, start_date, start_time, end_date, end_time, location, city, state, CONCAT(?, SUBSTRING(banner, 9)) AS event_banner, description FROM events WHERE id=?";
  var inserts = [bucket_url, eventId];
  sql = mysql.format(sql, inserts);
  const [rows] = await pool.execute(sql);
  return rows[0];
}

async function getCommunityList() {
  var sql =
    "SELECT id, title, team, subtitle, image, link, likes FROM community_content;";
  const [rows] = await pool.execute(sql);
  return rows;
}

module.exports = {
  getEventList,
  getEventById,
  getCommunityList
};
