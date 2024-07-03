const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `
    SELECT
      *
    FROM
      book
    ORDER BY
      book_id;`
  const playerArray = await db.all(getPlayerQuery)
  response.send(playerArray)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseynumber, role} = playerDetails
  const addPlayerQuery = `INSERT INTO cricket_team(playerName,jerseynumber,role)
    VALUES("${playerName}","${jerseynumber}","${role}");`
  const dbResponse = await db.run(addPlayerQuery)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getplayersId = `
    SELECT 
    *
    FROM
    cricket_team
    WHERE
    player_id=${playerId};
    `
  const playerArray = await db.all(getplayersId)
  response.send(playerArray)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playersId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerArray = `
  UPDATE
  cricket_team
  SET
  playerName="${playerName}",
  jerseyNumber="${jerseyNumber}",
  role="${role}"
  WHERE 
  player_id=${playersId};`
  await db.run(updatePlayerArray)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId', async (request, response) => {
  const {playersId} = request.params
  const deleteplayersId = `
    DELETE
    *
    FROM
    cricket_team
    WHERE
    players_id=${playersId};
    `
  await db.run(deleteplayersId)
  response.send('player Removed')
})
module.exports = app
