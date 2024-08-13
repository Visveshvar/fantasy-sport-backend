var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./models/users.js');
var FantasyPlayers = require('./models/players.js');
var app = express();

var allowedOrigins = ["http://localhost:3000", "https://fantasy-sport-frontend.vercel.app"];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
    })
);
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://VisveshvarSakthivel:vishnusakthi16%40gmail.com@sportsplatform.lgnb3.mongodb.net/PlatformUsers");

var db = mongoose.connection;
db.once("open", () => {
    console.log("MongoDB connection successful");
});

app.get("/", (req, res) => {
    res.send("Welcome to backend Server");
});

app.post("/login", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        let user = await User.findOne({ email: email }) || await User.findOne({ username: username });
        if (user) {
            if (user.password === password) {
                console.log("Login Successful");
                return res.json({ message: "Login Success", username: user.username });
            } else {
                console.log("Invalid password");
                return res.send("Invalid Password");
            }
        }
        console.log("Account doesn't exist");
        return res.send("Account Doesn't Exist");
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
});

app.post("/addplayer", async (req, res) => {
    try {
        const { username, player } = req.body;
        let fantasyPlayerData = await FantasyPlayers.findOne({ username: username });

        if (!fantasyPlayerData) {
            fantasyPlayerData = new FantasyPlayers({ username: username, players: [player] });
        } else {
            if (fantasyPlayerData.players.length >= 11) {
                return res.json({ message: "Player Queue is full! You cannot add more than 11 players." });
            }
            fantasyPlayerData.players.push(player);
        }

        await fantasyPlayerData.save();
        return res.json({ message: "Player added successfully", fantasyplayers: fantasyPlayerData.players });
    } catch (err) {
        console.error("Error adding player:", err);
        return res.json({ message: "An error occurred while adding the player" });
    }
});

app.post("/getplayers", async (req, res) => {
    try {
        const { username } = req.body;
        let fantasyPlayerData = await FantasyPlayers.findOne({ username: username });

        if (fantasyPlayerData) {
            return res.json({ players: fantasyPlayerData.players });
        } else {
            return res.json({ players: [] });
        }
    } catch (err) {
        console.error("Error retrieving players:", err);
        return res.json({ message: "An error occurred while retrieving the players" });
    }
});
app.post("/getallteams", async (req, res) => {
    try {
        let allFantasyPlayers = await FantasyPlayers.find({});
        return res.json({ teams: allFantasyPlayers });
    } catch (err) {
        console.error("Error retrieving teams:", err);
        return res.status(500).json({ message: "An error occurred while retrieving the teams" });
    }
});
app.post("/removeplayer", async (req, res) => {
    try {
        const { username, playerId } = req.body;
        let fantasyPlayerData = await FantasyPlayers.findOne({ username: username });

        if (fantasyPlayerData) {
            const updatedPlayers = fantasyPlayerData.players.filter(player => player._id.toString() !== playerId);
            fantasyPlayerData.players = updatedPlayers;
            await fantasyPlayerData.save();
            return res.json({ message: "Player removed successfully", players: updatedPlayers });
        } else {
            return res.json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Error removing player:", err);
        return res.json({ message: "An error occurred while removing the player" });
    }
});

app.post("/playercount", async (req, res) => {
    try {
        const { username } = req.body;
        let fantasyPlayerData = await FantasyPlayers.findOne({ username: username });

        if (fantasyPlayerData) {
            const playerCount = fantasyPlayerData.players.length;
            return res.json({ count: playerCount });
        } else {
            return res.json({ count: 0 });
        }
    } catch (err) {
        console.error("Error retrieving player count:", err);
        return res.status(500).json({ message: "An error occurred while retrieving the player count" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { email, fullname, username, password, confirmpassword } = req.body;
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.send("Account already exists!");
        }
        existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.send("Account already exists!");
        }
        if (password !== confirmpassword) {
            return res.send("Passwords don't match");
        }

        var newUser = new User({
            email: email,
            username: username,
            fullname: fullname,
            password: password,
            confirmpassword: confirmpassword
        });

        await newUser.save();
        return res.send("Sign Up Successful");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: "An error occurred during signup" });
    }
});

app.listen(4000, () => console.log("backend started"));
