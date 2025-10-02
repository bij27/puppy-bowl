/**
 * @typedef Player
 * @property {number} id
 * @property {string} name
 * @property {string} breed
 * @property {string} status
 * @property {string} imageUrl
 * @property {string} teamId
 * @property {string} teamName
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

  let teamName = "None (Free Agent)";
  if (selectedPlayer.teamId === 1) {
    teamName = "Team Ruff";
  } else if (selectedPlayer.teamId === 2) {
    teamName = "Team Fluff";
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
    <p><strong>Team Name:</strong> ${teamName}</p>
  <p><strong>Team ID:</strong> ${selectedPlayer.teamId || "N/A"}</p>
  `;

  // === Delete button ==

  const $deleteButton = document.createElement("button");
  $deleteButton.textContent = "Remove puppy :(";

  $deleteButton.addEventListener("click", async function () {
    await deletePlayer(selectedPlayer.id);
  });

  $section.append($deleteButton);
  return $section;
}

/** Form that allows users to input information about a new player */
function NewPlayerForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
        <label><strong>Name:</strong> <input name="name" required></label>
        <label><strong>Breed:<strong> <input name="breed" required></label>
        <label>Status:<select name="status" required>
                <option value="bench">Bench</option>
                <option value="field">Field</option>
            </select>
             </label>
        <label>Image URL:<input name="imageUrl" "required></label>
        <button class="add-btn">Add puppy!</button>
    `;
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData($form);
    addPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: data.get("imageUrl"),
      teamId: null,
    });
    $form.reset();
  });
  return $form;
}

/** Deletes the player with the given ID */
async function deletePlayer(id) {
  try {
    await fetch(API + "/" + id, {
      method: "DELETE",
    });
    selectedPlayer = null;
    await getPlayers();
    render();
  } catch (e) {
    console.error("Error deleting player", e);
    await getPlayers();
    render();
  }
}

async function addPlayer(playerData) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    });
    const json = await res.json();

    if (json.success) {
      console.log("New player added:", json.data.newPlayer);
      await getPlayers();
      render();
    } else {
      console.error("Failed to add player:", json.error || "Unknown error.");
    }
  } catch (err) {
    console.error("Error adding player:", err);
  }
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Players</h2>
        <div id="player-list-container"></div>
        <div id="new-player-form-container"></div>
      </section>
      <section id="selected">
        <h2>Player Details</h2>
        <div id="player-details-container"></div>
      </section>
    </main>
  `;
  $app.querySelector("#player-list-container").replaceWith(PlayerList());
  $app.querySelector("#player-details-container").replaceWith(PlayerDetails());
  $app.querySelector("#new-player-form-container").replaceWith(NewPlayerForm());
}

async function init() {
  await getPlayers();
  render();
}

init();

//== final commit
