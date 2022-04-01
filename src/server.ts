import "reflect-metadata";
import {app} from "./app";
import "./database"


app.listen(3000, () => {
  console.log("Running at http://localhost:3000");
});