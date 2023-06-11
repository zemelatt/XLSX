import sequelize from "../db/db";
import Sequelize from "sequelize";

const Task = sequelize.define("Task", {
  ItemNo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  Unit: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Qty: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Rate: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Amount: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Task.sync({ force: false })
  .then(() => console.log("User table created successfully"))
  .catch((err) => console.error("Error creating user table", err));

export default Task;
