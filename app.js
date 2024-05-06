const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const app = express()

const databasePath = path.join(__dirname, 'cricketTeam.db')

app.use(express.json())

let database = null

const initlizeDbAndReverse = async () =>{
    try {
        database = await open({
            fileName : databasePath,
            driver : sqlite3.Database,
        })
        app.listen(3000= ()=>
        console.log(`Server Running at http://localhost:3000/`))

    }catch(error){
        console.log(`DB Error: ${error.message}`)
        process.exit(1)

    }
}
initlizeDbAndReverse()

const convertDbObjectToReverseObject = DbObject =>{
    return{
        playerId : DbObject.player_id,
        playerName : DbObject.player_name,
        jerseyNumber : DbObject.jersey_number,
        role : DbObject.role,
    }
}


app.get("/players/", async(request, response)=>{
    const getPlayerQuery = `
    SELECT
    *
    FROM 
    cricket_team;`

    const playerArray = await database.all(getPlayerQuery)
    response.send(playerArray.map(eachPlayer=>convertDbObjectToReverseObject(eachPlayer)))
})

app.get("players/:playerId", async(request, response)=>{
    const {playerId} = request.params
    const getPlayersQuery = `
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id = ${playerId};`

    const player = await database.get(getPlayersQuery)
    response.send(convertDbObjectToReverseObject(player))
})

app.post('/players/', async(requesrt, response)=>{
    const {playerName, jerseyNumber, role} = request.body
    const postPlayerQuery = `
    INSERT INTO
    cricket_team(player_name, jersey_number, role)
    VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`

    const players = await database.run(postPlayerQuery)
    response.send("Players added a Team")
})

app.put('/players/:playerId', async(request, response)=>{
    const {playerName, jerseyNumber, role} = request.body
    const {playerId} = request.params

    const updatePlayerQuery = `
    UPDATE FORM 
    cricket_team
    SET 
    player_name='${playerName}',
    jersey_number = '${jerseyNumber},
    role = '${role};`

    await database.run(updatePlayerQuery)
    response.send("Player Details Updated")

})

app.delete("players/:playerId", async(request, response)=>{
    const deletePlayerQuery = `
    DELETE FORM
    cricket_team
    WHERE 
    player_id = ${playerId};`

    const player = await database.run(deletePlayerQuery)
    response.send("Player Removed")
})

module.exports = app