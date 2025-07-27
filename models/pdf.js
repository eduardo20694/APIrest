module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Pdf", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nomeArquivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caminho: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    tableName: "pdfs",
    timestamps: false,
  });
};
