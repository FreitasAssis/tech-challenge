import { DataTypes, Model } from "sequelize";
import { database } from "../database/connection";

interface IPixData extends Model {
  pixKey: string;
  pixKeyType: "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA";
  bankName: string;
  bankImageUrl: string;
  agency: string;
  cc: string;
  receiverId: string;
}

const PixData = database.define<IPixData>("pixData", {
  pixKey: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  pixKeyType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bankImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  agency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default PixData;
