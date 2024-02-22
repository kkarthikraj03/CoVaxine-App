import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const connection = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

const connectDB = async () => {
    try {
        await connection.connect();
        console.log("Database Connected Successfully");
    }
    catch (error) {
        console.log("Error in connecting ", error);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.send("Backend is Working");
})

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `INSERT INTO Users(Name,Email,Password) VALUES('${name}','${email}','${hashedPassword}')`;
        const result = await connection.query(insertQuery);
        res.status(201).json({ message: "Successfully Registered" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in API" });
    }
})

app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const selectQuery = `SELECT * FROM Users WHERE Name = '${name}'`;

        const data = await connection.query(selectQuery);
        const results = data.rows;
        if (!results) {
            return res.status(401).json({ message: "User Not Found" });
        }
        const user = results[0];
        // console.log(user);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password Didn't Match" });
        }
        const token = jwt.sign({ userId: user.id, userName: user.name }, 'verycokkrsecret', { expiresIn: '1h' });
        const ID = user.id;
        const Name = user.name;
        return res.status(201).json({ user: { ID, Name }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in API-Backend" });
    }
})

app.post('/centreList', async (req, res) => {
    const { state, city } = req.body;
    try {
        let fetchQuery = 'SELECT * FROM centres';

        if (state != 'select' && city != 'select') {
            fetchQuery += ` WHERE state = '${state}' AND city = '${city}'`;
        }

        // console.log(fetchQuery);
        const data = await connection.query(fetchQuery);
        const results = data.rows;
        return res.status(201).json({ results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})

app.get('/details/:centreId', async (req, res) => {
    const { centreId } = req.params;
    try {
        const fetchDetailQuery = `SELECT * FROM Centres WHERE Centre_ID = ${centreId}`;
        const data = await connection.query(fetchDetailQuery);
        const results = data.rows;
        return res.status(201).json({ results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in Fetching API" });
    }
})
app.get('/slots/:centreId', async (req, res) => {
    const { centreId } = req.params;
    try {
        const fetchSlotQuery = `SELECT * FROM slots WHERE centre_id = ${centreId}`;
        const data = await connection.query(fetchSlotQuery);
        const results = data.rows;
        return res.status(201).json({ results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in Fetching API" });
    }
})
app.post('/slots', async (req, res) => {
    const { slotNumber, centreId } = req.body;
    try {
        const updateQuery = `UPDATE slots SET ${slotNumber} = 0 WHERE centre_id = ${centreId}`;
        const result = await connection.query(updateQuery);
        return res.status(201).json({ message: "Successs" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.post('/slotCount', async (req, res) => {
    const { slotNumber, centreId } = req.body;
    try {
        const fetchSlotCountQuery = `SELECT ${slotNumber} FROM Slots WHERE Centre_ID = ${centreId}`;

        const data = await connection.query(fetchSlotCountQuery);
        const results = data.rows;
        const resulta = results[0];
        const slotValue = results.length > 0 ? resulta[slotNumber] : 0;
        // console.log(slotValue);
        return res.status(201).json({ slotValue });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.post('/removeCentre', async (req, res) => {
    const { centreId } = req.body;
    try {
        const deleteCentreQuery = `DELETE FROM centres WHERE centre_id = ${centreId}`;
        const deleteSlotQuery = `DELETE FROM slots WHERE centre_id = ${centreId}`;

        const result = await connection.query(deleteCentreQuery);
        const results = await connection.query(deleteSlotQuery);

        return res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.get('/slotList', async (req, res) => {
    try {
        const fetchSlotListQuery = 'SELECT * FROM slots';
        const data = await connection.query(fetchSlotListQuery);
        const results = data.rows;
        return res.status(201).json({ results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.post('/increment', async (req, res) => {
    const { centreId, slotNumber } = req.body;
    try {
        const incrementQuery = `UPDATE slots SET slot_${slotNumber} = slot_${slotNumber} + 1 WHERE centre_id = ${centreId}`;
        const results = await connection.query(incrementQuery);
        return res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.post('/decrement', async (req, res) => {
    const { centreId, slotNumber } = req.body;
    try {
        const decrementQuery = `UPDATE slots SET slot_${slotNumber} = slot_${slotNumber} - 1 WHERE centre_id = ${centreId}`;
        const results = await connection.query(decrementQuery);
        return res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.post('/addCentre', async (req, res) => {
    const { Centre_ID, Centre_Name, Cost, Vaccine_Type, Slots, State, City } = req.body;
    try {
        const addCentreQuery = `INSERT INTO Centres (centre_id,centre_name,cost,vaccine_type,slots,state,city) Values(${Centre_ID},'${Centre_Name}','${Cost}','${Vaccine_Type}',${Slots},'${State}','${City}')`;
        const addSlotQuery = `INSERT INTO Slots (centre_id,centre_name,slot_1,slot_2,slot_3,slot_4,slot_5,slot_6) VALUES(${Centre_ID},'${Centre_Name}',1,1,1,1,1,1)`;

        const result = await connection.query(addCentreQuery);
        const results = await connection.query(addSlotQuery);
        return res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in API" });
    }
})
app.listen(port, () => {
    console.log(`Server is Listening on port ${port}`);
})


