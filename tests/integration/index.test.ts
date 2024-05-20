import receiverService from "../../src/services/receiverService";
import Receiver from "../../src/models/receiverModel";
import PixData from "../../src/models/pixDataModel";
import { IReceiver, IReceiverUpdate } from "../../src/utils/types";

describe("Create Receiver - Integration test", () => {
  const receiverData = {
    name: "Receiver 1",
    document: "151.645.480-46",
    email: "thisemaildontexists@email.com",
    pixKey: "thisemaildontexists@email.com",
    pixKeyType: "EMAIL",
  } as IReceiver;

  it("should not create a receiver with an existent pix key", async () => {
    const newReceiverData = {
      ...receiverData,
      pixKey: "82912345678",
    };
    const result = await receiverService.createReceiver(newReceiverData);
    expect(result.message).toContain("Pix key already exists");
    expect(result.status).toBe(400);
  });

  it("should not create a receiver with a invalid document", async () => {
    const newReceiverData = {
      ...receiverData,
      document: "82912345678",
    };
    const result = await receiverService.createReceiver(newReceiverData);
    expect(result.message).toContain("Invalid document");
    expect(result.status).toBe(400);
  });

  it("should create a receiver with all valid data", async () => {
    const result = await receiverService.createReceiver(receiverData);
    expect(result.status).toBe(201);

    const createdReceiver = await Receiver.findOne({
      include: [
        {
          model: PixData,
          where: {
            pixKey: receiverData.pixKey,
          },
          as: "pixData",
          required: true,
        },
      ],
    });

    expect(createdReceiver).toBeDefined();
    expect(createdReceiver.name).toBe(receiverData.name);
    expect(createdReceiver.document).toBe(receiverData.document);
    expect(createdReceiver.email).toBe(receiverData.email);
  });
});

describe("Update Receiver - Integration test", () => {
  const receiverDataValidated = {
    id: "98565a5c-dab8-4a93-8953-91e40222a1eb",
    name: "Luiz",
    document: "151.645.480-46",
    email: "luiz@gmail.com",
    pixKey: "12912345678",
    pixKeyType: "TELEFONE",
  } as IReceiverUpdate;

  const receiverDataDraft = {
    id: "567784ab-7f2c-4482-a1b1-14751fadddfc",
    name: "Augusto",
    document: "68.719.324/0001-18",
    email: "augusto@email.com",
    pixKey: "68.719.324/0001-18",
    pixKeyType: "CNPJ",
  } as IReceiverUpdate;

  it("should not update the receiver name when status equal 'Validado'", async () => {
    const result = await receiverService.updateReceiver(
      receiverDataValidated.id,
      {
        name: "Luiz Freitas",
      }
    );
    expect(result.message).toContain("Receiver already validated");
    expect(result.status).toBe(400);
  });

  it("should update the receiver email when status equal 'Validado'", async () => {
    const result = await receiverService.updateReceiver(
      receiverDataValidated.id,
      {
        email: "luiz_dev@outlook.com",
      }
    );
    expect(result.message).toContain("Receiver updated");
    expect(result.status).toBe(200);

    const receiverUpdated = await receiverService.getReceiverById(
      receiverDataValidated.id
    );
    expect(receiverUpdated.receiver.email).toBe("luiz_dev@outlook.com");
    expect(receiverUpdated.status).toBe(200);
  });

  it("should update all data from receiver when status equal 'Rascunho'", async () => {
    const result = await receiverService.updateReceiver(receiverDataDraft.id, {
      email: "asantos@outlook.com",
      name: "Augusto da Silva",
      pixKey: "89987654321",
      pixKeyType: "TELEFONE",
    });
    expect(result.message).toContain("Receiver updated");
    expect(result.status).toBe(200);

    const receiverUpdated = await receiverService.getReceiverById(
      receiverDataDraft.id
    );
    expect(receiverUpdated.receiver.email).toBe("asantos@outlook.com");
    expect(receiverUpdated.receiver.name).toBe("Augusto da Silva");
    expect(receiverUpdated.receiver["pixData.pixKey"]).toBe("89987654321");
    expect(receiverUpdated.receiver["pixData.pixKeyType"]).toBe("TELEFONE");
    expect(receiverUpdated.status).toBe(200);
  });
});
