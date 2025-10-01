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

// === Components ===

// == Player name that shows more details when clicked ==
function PlayerListItem(player) {
  const $li = document.createElement("li");
  $li.innerHTML = `
  <a href="#selected">${player.name}</a>
  `;
  $li.addEventListener("click", () => getPlayer(player.id));
  return $li;
}

/** A list of names of all players */
function PlayerList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");
  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);
  return $ul;
}

/** Detailed information about the selected player */
function PlayerDetails() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a pup to learn more!";
    return $p;
  }
  const $section = document.createElement("section");
  $section.classList.add("player");
  $section.innerHTML = `
  <figure>
  <img alt="${selectedPlayer.teamId}" src="${selectedPlayer.imageUrl}"
  </figure>
  <p><strong>Name:</strong> ${selectedPlayer.name}</p>
  <p><strong>Breed:</strong> ${selectedPlayer.breed}</p>
  <p><strong>Status:</strong> ${selectedPlayer.status}</p>
  `;
