const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Task = require("./task")(sequelize, DataTypes);
db.Appointment = require("./appointment")(sequelize, DataTypes);
db.Pdf = require("./pdf")(sequelize, DataTypes);

// Relacionamentos
db.User.hasMany(db.Task, { foreignKey: "userId", onDelete: "CASCADE" });
db.Task.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Appointment, { foreignKey: "userId", onDelete: "CASCADE" });
db.Appointment.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Pdf, { foreignKey: "userId", onDelete: "CASCADE" });
db.Pdf.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;
