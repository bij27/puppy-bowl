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

// == Updates state with all players from API ==

async function getPlayers() {
  try {
    const res = await fetch(API);
    const result = await res.json();
    players = result.data.players;
    render();
  } catch (err) {
    console.error("Error fetching parties:", err);
  }
}

// == Updates state with a single player from the API

async function getPlayer(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedPlayer = result.data.player;
    render();
  } catch (err) {
    console.error(err);
  }
}
