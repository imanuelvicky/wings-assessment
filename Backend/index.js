const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const db = require('./connection')
const response = require('./response')
const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)
const bcrypt = require('bcrypt')

app.use(bodyParser.json())

app.get('/login', (req, res) => {
    const { username, password } = req.query;
    
    const sql = `SELECT username FROM account WHERE username = ?`;
    const values = [username];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.length > 0) {
            const storedHashedPassword = result[0].password;
            const match = bcrypt.compare(password, storedHashedPassword);
            if (match) {
                response(200, "Login successful", result, res)
            } else {
                response(401, "Login failed", result, res)
            }
        } else {
            response(401, "Login failed", result, res)
        }
    });
});

app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO account (username, password, role) VALUES (?, ?, ?)`;
    const values = [username, hashedPassword, role];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return response(500, "Internal server error", result, res)
        }
        response(201, "User successfully registered", result, res)
    });
});

app.get('/account', async (req, res) => {
    const sql = `SELECT * FROM account`
    db.query(sql, (err, result) => {
        if (err) throw err
        response(200, "All account successfully retreived", result, res)
    })
})

app.get('/task', (req, res) => {
    const sql = `SELECT * FROM task`
    db.query(sql, (err, result) => {
        if (err) throw err
        response(200, "All task successfully retreived", result, res)
    })
})

app.post('/task', (req, res) => {
    const { title, description, due_date, complete, id_account } = req.body
    const sql = `INSERT INTO task (title, description, due_date, complete, id_account) VALUES ('${title}', '${description}', '${due_date}', ${complete}, ${id_account})`
    db.query(sql, (err, result) => {
        if (err) response(500, "Internal server error", "error", res)
        if (result?.affectedRows) {
            response(200, "Task added successfully", result, res)
        }
    })
})

app.put('/task', (req, res) => {
    const { id, title, description, due_date, complete, id_account } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    const updates = [];

    if (title !== undefined) updates.push(`title='${title}'`)
    if (description !== undefined) updates.push(`description='${description}'`)
    if (due_date !== undefined) updates.push(`due_date='${due_date}'`)
    if (complete !== undefined) updates.push(`complete=${complete}`)
    if (id_account !== undefined) updates.push(`id_account=${id_account}`)

    if (updates.length === 0) {
        return res.status(400).json({ message: "No fields to update" })
    }

    const sql = `UPDATE task SET ${updates.join(', ')} WHERE id = ${id}`
    db.query(sql, (err, result) => {
        if (err) return response(500, "Internal server error", "error", res)
        if (result?.affectedRows) {
            return response(200, "Task updated successfully", result, res)
        } else {
            return res.status(404).json({ message: "Task not found" })
        }
    })
})

app.delete('/task', (req, res) => {
    const { id } = req.query
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" })
    }
    const sql = `DELETE FROM task WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) return response(500, "Internal server error", "error", res)
        if (result?.affectedRows) {
            return response(200, "Task deleted successfully", result, res)
        } else {
            return res.status(404).json({ message: "Task not found" })
        }
    })
})

app.put('/task/updateMark', (req, res) => {
    const { id, complete } = req.body
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" });
    }
    const sql = `UPDATE task SET complete = ${complete} WHERE id = ${id}`
    db.query(sql, (err, result) => {
        if (err) return response(500, "Internal server error", "error", res)
        if (result?.affectedRows) {
            return response(200, "Task marked as complete", result, res)
        } else {
            return res.status(404).json({ message: "Task not found" })
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})