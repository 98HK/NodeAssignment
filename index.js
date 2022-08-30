require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");
const app = express();
const UserRouter = require("./routers/user")
const PostRouter = require("./routers/post")
const CommentRouter = require("./routers/comment")
const port = process.env.PORT || 5151;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter)
app.use("/api/comment", CommentRouter)


app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
    connectToMongo();
  });
  