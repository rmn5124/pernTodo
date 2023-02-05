const express = require("express");
const app = express();
const cors = require("cors"); //to conenct with teh multiple servers
const pool = require("./db"); //to connect with the database
app.use(cors());
//now to make any full stack app we need to get data from client side and for that we need to get data fron request.body object
app.use(express.json()); //it will give access to body object

//ROUTES

//create a database todo // i have used postmon for api fetching
//create todos
app.post("/todos", async (req, res) => {
  try {
    //console.log(req.body);
    // lets take data from client
    const { description } = req.body;
    //now we need to insert this data into database
    const newTodo = await pool.query(
      "INSERT into todo(description) VALUES($1) RETURNING *",
      [description] //you can directly put value one by one but here using pg library we are getting data manually from client using $1
      //  instead of that use can use this for mannual "INSERT into todo(description) VALUES('Hey from direct')"
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get a particular todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//update todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; //client request id
    const { description } = req.body; //client change object
    const updateTodo = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2",
      [description, id]
    );
    res.json("todo has been updated");
  } catch (err) {
    console.log(err.message);
  }
});

//delete todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE from todo WHERE todo_id=$1", [
      id,
    ]);
    res.json("todo has been deleted");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
