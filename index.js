import express from "express";
import { connectDB, UserModel, TodoModel } from "./server.js";
import cors from "cors";
import Jwt  from "jsonwebtoken";

const app = express();

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const auth = async (req, res , next) => {
    const token = req.header('Authorization').substring(7);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    
      Jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
      });
}



app.post("/login", async (req, res) => {
  const { emailAddress, password } = req.body.values;

  try {
    const check = await UserModel.findOne({
      emailAddress: emailAddress,
      password: password,
    });
    
    if (check) {
      const token = Jwt.sign({userId: check._id} ,  'your_secret_key')
      res.json(token)
    } else {
      res.json("Not");
    }
  } catch (err) {
    res.json(err.message);
  }
});

app.post("/signup", async (req, res) => {
  const { emailAddress, fname, lname, password } = req.body.values;

  const data = {
    emailAddress: emailAddress,
    fname: fname,
    lname: lname,
    password: password,
  };

  try {
    const check = await UserModel.findOne({
      emailAddress: emailAddress,
    });

    if (check) {
      res.json("had");
      console.log(check);
    } else {
      await UserModel.insertMany([data]);
      res.json("added");
    }
  } catch (err) {
    res.json("error");
  }
});

app.post("/addTodo" , auth , async (req, res) => {
  const { todoName, todoDescriptions } = req.body.values;
console.log(req.user.userId)
  const data = {
    userId: req.user.userId,
    todoName: todoName,
    todoDescriptions: todoDescriptions,
  };

  try {
    const check = await TodoModel.findOne({
      todoName: todoName,
    });

    if (check) {
      res.json("Already exists");
    } else {
      await TodoModel.insertMany([data]);
      res.json("Added");
    }
  } catch (err) {
    res.json("error");
  }
});

app.get("/getTodos" , auth ,  async (req, res) => {
  try {
    const todos = await TodoModel.find({userId: req.user.userId});
    console.log(todos)
    res.json(todos);
  } catch (err) {
    res.json({ error: "While fetching todo" });
  }
});

app.post('/editTodo' , async (req, res) => {
  const { todoName, todoDescriptions , keys} = req.body.values;

const filter = {_id:keys}

const data = {
  todoName : todoName,
  todoDescriptions:todoDescriptions
}

  console.log(todoDescriptions , todoName ,keys)

  try{
    const check = await TodoModel.findById(keys)
    if(check){
      await TodoModel.updateMany(filter,data)
      res.json("Done")
    }
  }catch(err){
    console.log(err)
  }

})

app.delete('/deleteTodo/:id' , async (req, res) => {
  const id = req.params.id;
  console.log(id,"if")

  const filter = {_id:id}
  try {
    const check = await TodoModel.findById(id);
    if(check){
     await TodoModel.deleteOne(filter)
        res.json("deleted")
    }else{
      res.json("Not found")
    }
  }catch(e){
    console.error(e)
  }
})

app.listen(4000, () => {
  console.log("listening on");
});
