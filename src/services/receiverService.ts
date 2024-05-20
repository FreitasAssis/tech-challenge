import { Op } from "sequelize";
import PixData from "../models/pixDataModel";
import Receiver from "../models/receiverModel";
import {
  IAccountBankData,
  IListFilters,
  IReceiver,
  IReceiverUpdate,
} from "../utils/types";
import {
  notSpecialOrError,
  validEmailOrError,
  validateDocument,
  validatePixKey,
} from "../utils/validation";
import functions from "../functions/getAccountBankData";
import seedAccountBankData from "../seed/seedAccountBankData";

const receiverService = {
  createCache: async () => {
    try {
      await functions.setAccountBankDataCache();
      return {
        message: "🚀 ~ createCache: ~ message: Success!",
        status: 200,
      };
    } catch (message) {
      return {
        message: "🚀 ~ createCache: ~ message: " + message,
        status: 400,
      };
    }
  },

  populateReceiver: async () => {
    try {
      await Promise.all(
        seedAccountBankData.map(async (data: IReceiver) => {
          const { name, document, email, pixKey, pixKeyType } = data;

          const pixKeyExists = await PixData.findOne({
            raw: true,
            where: {
              pixKey,
            },
          });
          if (pixKeyExists) throw "Pix key already exists";

          notSpecialOrError(name, "Its not permited special characters");
          validEmailOrError(email, "Invalid email");
          validateDocument(document, "Invalid document");
          validatePixKey(pixKeyType, pixKey);

          const receiver = await Receiver.create({
            name,
            document,
            email,
          });

          const accountBankData: IAccountBankData =
            await functions.getAccountBankData(pixKey);
          const { bankName, bankImageUrl, agency, cc } = accountBankData;

          await PixData.create({
            pixKeyType,
            pixKey,
            bankName,
            bankImageUrl,
            agency,
            cc,
            receiverId: receiver.id,
          });
        })
      );
      return {
        message: "🚀 ~ createReceiver: ~ message: Success!",
        status: 201,
      };
    } catch (message) {
      return {
        message: "🚀 ~ createReceiver: ~ message: " + message,
        status: 400,
      };
    }
  },

  createReceiver: async (data: IReceiver) => {
    try {
      const { name, document, email, pixKey, pixKeyType } = data;

      const pixKeyExists = await PixData.findOne({
        raw: true,
        where: {
          pixKey,
        },
      });
      if (pixKeyExists)
        return {
          message: "🚀 ~ createReceiver: ~ message: Pix key already exists!",
          status: 400,
        };

      notSpecialOrError(name, "Its not permited special characters");
      validEmailOrError(email, "Invalid email");
      validateDocument(document, "Invalid document");
      validatePixKey(pixKeyType, pixKey);

      const receiver = await Receiver.create({
        name,
        document,
        email,
      });

      const accountBankData: IAccountBankData =
        await functions.getAccountBankData(pixKey);
      const { bankName, bankImageUrl, agency, cc } = accountBankData;

      await PixData.create({
        pixKeyType,
        pixKey,
        bankName,
        bankImageUrl,
        agency,
        cc,
        receiverId: receiver.id,
        status: 200,
      });

      return {
        message: "🚀 ~ createReceiver: ~ message: Success!",
        status: 201,
      };
    } catch (message) {
      return {
        message: "🚀 ~ createReceiver: ~ error: " + message,
        status: 400,
      };
    }
  },

  listReceivers: async (filters: IListFilters) => {
    try {
      const { limite, pagina, input } = filters;
      const limit = limite ? +limite : 10;
      const page = pagina ? +pagina : 1;
      const offset = page * limit - limit;

      const receivers = await Receiver.findAndCountAll({
        raw: true,
        where: {
          ...(input && {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${input}%`,
                },
              },
              {
                document: {
                  [Op.like]: `%${input}%`,
                },
              },
              {
                status: {
                  [Op.like]: `%${input}%`,
                },
              },
            ],
          }),
        },
        include: [
          {
            model: PixData,
            where: {
              ...(input && {
                [Op.or]: [
                  {
                    pixKey: {
                      [Op.like]: `%${input}%`,
                    },
                  },
                  {
                    pixKeyType: {
                      [Op.like]: `%${input}%`,
                    },
                  },
                  {
                    agency: {
                      [Op.like]: `%${input}%`,
                    },
                  },
                  {
                    cc: {
                      [Op.like]: `%${input}%`,
                    },
                  },
                ],
              }),
            },
            as: "pixData",
            required: true,
          },
        ],
        order: [["name", "ASC"]],
        limit,
        offset,
      });

      const numPages =
        receivers.count % limit
          ? Math.ceil(receivers.count / limit)
          : receivers.count / limit;

      return {
        numPages,
        page,
        message: `${
          receivers.rows.length
            ? "Receivers found with success"
            : "Receivers not found"
        }`,
        receivers: receivers.rows,
        status: 200,
      };
    } catch (message) {
      return {
        message: "🚀 ~ listReceivers: ~ message: " + message,
        status: 400,
      };
    }
  },

  getReceiverById: async (id: string) => {
    try {
      const receiver = await Receiver.findOne({
        raw: true,
        where: { id },
        include: [
          {
            model: PixData,
            as: "pixData",
            required: true,
          },
        ],
      });

      if (receiver)
        return {
          message: "🚀 ~ getReceiverById: ~ Receiver found with success",
          receiver,
          status: 200,
        };
      else
        return {
          message: "🚀 ~ getReceiverById: ~ Receiver not found",
          receiver: null,
          status: 404,
        };
    } catch (message) {
      return {
        message: "🚀 ~ getReceiverById: ~ Error to find receiver: " + message,
        status: 400,
      };
    }
  },

  updateReceiver: async (id: string, data: IReceiverUpdate) => {
    try {
      let receiver = await Receiver.findOne({
        raw: true,
        where: { id },
        attributes: ["id", "status"],
      });

      if (receiver) {
        if (
          receiver.status === "Validado" &&
          (data.name || data.document || data.pixKeyType || data.pixKey)
        )
          return {
            message: "🚀 ~ updateReceiver: ~ Receiver already validated!",
            receiver,
            status: 400,
          };
        if (data.name)
          notSpecialOrError(data.name, "Its not permited special characters");
        if (data.document) validateDocument(data.document, "Invalid document");

        if (data.pixKeyType && !data.pixKey)
          return {
            message:
              "🚀 ~ updateReceiver: ~ You cant change pix key type without change pix key!",
            status: 400,
          };
        if (data.pixKeyType) validatePixKey(data.pixKeyType, data.pixKey);

        if (data.email) {
          validEmailOrError(data.email, "Invalid email");
          await Receiver.update({ email: data.email }, { where: { id } });
        }
        if (receiver.status === "Rascunho") {
          if (data.name || data.document)
            await Receiver.update(
              {
                ...(data.name && { name: data.name }),
                ...(data.document && { document: data.document }),
              },
              { where: { id } }
            );
          if (data.pixKey) {
            const accountBankData: IAccountBankData =
              await functions.getAccountBankData(data.pixKey);
            const { bankName, bankImageUrl, agency, cc } = accountBankData;

            await PixData.update(
              {
                pixKey: data.pixKey,
                pixKeyType: data.pixKeyType,
                bankName,
                bankImageUrl,
                agency,
                cc,
              },
              { where: { receiverId: receiver.id } }
            );
          }
        }
      } else
        return {
          message: "🚀 ~ updateReceiver: ~ Receiver not found!",
          receiver: null,
          status: 404,
        };

      receiver = await Receiver.findOne({
        raw: true,
        where: { id },
        include: [
          {
            model: PixData,
            as: "pixData",
            required: true,
          },
        ],
      });

      return {
        message: "🚀 ~ updateReceiver: ~ Receiver updated with success!",
        receiver,
        status: 200,
      };
    } catch (message) {
      return {
        message: "🚀 ~ updateReceiver: ~ " + message,
        status: 400,
      };
    }
  },

  deleteReceivers: async (ids: string[]) => {
    try {
      await Receiver.destroy({
        where: {
          id: ids,
        },
      });

      return {
        message: "🚀 ~ deleteReceivers: ~ Receivers deleted with success",
        status: 200,
      };
    } catch (message) {
      return {
        message: "🚀 ~ deleteReceivers: ~ " + message,
        status: 400,
      };
    }
  },
};

export default receiverService;
