/**
 * @typedef Player
 * @property {number} id
 * @property {string} name
 * @property {string} breed
 * @property {string} status
 * @property {string} imageUrl
 * @property {string} teamId
 */

// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2508-BIJAN";
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

// === STATE ===

let players = [];
let selectedPlayer;
