import mongoose from "mongoose";

const connectDB = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/auth");
      console.log("MongoDB connected");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      process.exit(1); // Exit the process if unable to connect to MongoDB
    }
}

const userSchema  = new mongoose.Schema({
  emailAddress: { type: String, required: true, unique: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  password: { type: String, required: true },
});


const UserModel  = mongoose.model("User" , userSchema )

const todoSchemea = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  todoName : { type: String, required: true},
  todoDescriptions :  { type: String, required: true},
})

const TodoModel = mongoose.model("Todo" , todoSchemea)

export { connectDB ,  UserModel ,TodoModel};