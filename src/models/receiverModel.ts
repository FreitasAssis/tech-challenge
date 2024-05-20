import { DataTypes, Model } from "sequelize";
import { database } from "../database/connection";
import PixData from "./pixDataModel";

interface IReceiver extends Model {
  id: number;
  name: string;
  document: string;
  email: string;
  status: "Validado" | "Rascunho";
  "pixData.pixKey"?: string;
  "pixData.pixKeyType"?: string;
  "pixData.bankName"?: string;
  "pixData.bankImageUrl"?: string;
  "pixData.agency"?: string;
  "pixData.cc"?: string;
}

const Receiver = database.define<IReceiver>("receiver", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  document: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Rascunho",
    allowNull: false,
  },
});

Receiver.hasMany(PixData, {
  foreignKey: "receiverId",
  onDelete: "cascade",
  as: "pixData",
});

export default Receiver;
