import { Model } from "sequelize";
import Receiver from "../../src/models/receiverModel";
import PixData from "../../src/models/pixDataModel";
import receiverService from "../../src/services/receiverService";
import { IPixData, IReceiver } from "../../src/utils/types";

jest.mock("../../src/models/receiverModel", () => ({
  findOne: jest.fn(),
  findAndCountAll: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../../src/models/pixDataModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("Get receiver by Id - Unit test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockReceiver = {
    id: "1",
    name: "Mock User",
    document: "151.645.480-46",
    email: "user@mock.com",
    pixData: {
      pixKey: "mockPixKey1",
      pixKeyType: "EMAIL",
      bankName: "Mock Bank",
      bankImageUrl: "https://mockbank.com/image.png",
      agency: "1234",
      cc: "5678",
    },
  } as any;

  it("should return the receiver when found in the database", async () => {
    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(mockReceiver);
    Receiver.findOne = findOneMock;

    const result = await receiverService.getReceiverById("1");

    expect(result.message).toContain("Receiver found");
    expect(result.receiver).toEqual(mockReceiver);
    expect(result.status).toBe(200);
  });

  it("should return null when no receiver is found in the database", async () => {
    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(null);
    Receiver.findOne = findOneMock;

    const result = await receiverService.getReceiverById("999");

    expect(result.message).toContain("Receiver not found");
    expect(result.receiver).toBeNull();
    expect(result.status).toBe(404);
  });
});

describe("List receivers - Unit test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const receiversData = {
    count: 2,
    rows: [
      {
        id: "1",
        name: "Receiver 1",
        document: "123456789",
        status: "Validado",
        pixData: {
          pixKey: "mockPixKey1",
          pixKeyType: "EMAIL",
          bankName: "Mock Bank",
          bankImageUrl: "https://mockbank.com/image.png",
          agency: "1234",
          cc: "5678",
        },
      },
      {
        id: "2",
        name: "Receiver 2",
        document: "987654321",
        status: "Rascunho",
        pixData: {
          pixKey: "mockPixKey2",
          pixKeyType: "EMAIL",
          bankName: "Mock Bank",
          bankImageUrl: "https://mockbank.com/image.png",
          agency: "5678",
          cc: "9012",
        },
      },
    ],
  };

  it("should return receivers when found in the database", async () => {
    (Receiver.findAndCountAll as jest.Mock).mockResolvedValueOnce(
      receiversData
    );

    const result = await receiverService.listReceivers({});

    expect(result.message).toContain("Receivers found");
    expect(result.receivers).toEqual(receiversData.rows);
    expect(result.status).toBe(200);
  });

  it("should return no receivers when not found in the database", async () => {
    (Receiver.findAndCountAll as jest.Mock).mockResolvedValueOnce({
      count: 0,
      rows: [],
    });

    const result = await receiverService.listReceivers({});

    expect(result.message).toContain("Receivers not found");
    expect(result.receivers).toEqual([]);
    expect(result.status).toBe(200);
  });
});

describe("Delete receivers - Unit test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should delete receivers", async () => {
    const receiversData = {
      count: 3,
      rows: [
        {
          id: "1",
          name: "Receiver 1",
          document: "123456789",
          status: "Validado",
          pixData: {
            pixKey: "mockPixKey1",
            pixKeyType: "EMAIL",
            bankName: "Mock Bank",
            bankImageUrl: "https://mockbank.com/image.png",
            agency: "1234",
            cc: "5678",
          },
        },
        {
          id: "2",
          name: "Receiver 2",
          document: "987654321",
          status: "Rascunho",
          pixData: {
            pixKey: "mockPixKey2",
            pixKeyType: "EMAIL",
            bankName: "Mock Bank",
            bankImageUrl: "https://mockbank.com/image.png",
            agency: "5678",
            cc: "9012",
          },
        },
        {
          id: "3",
          name: "Receiver 3",
          document: "987654321",
          status: "Rascunho",
          pixData: {
            pixKey: "mockPixKey3",
            pixKeyType: "EMAIL",
            bankName: "Mock Bank",
            bankImageUrl: "https://mockbank.com/image.png",
            agency: "9012",
            cc: "3456",
          },
        },
      ],
    };

    (Receiver.destroy as jest.Mock).mockResolvedValueOnce(receiversData);

    const result = await receiverService.deleteReceivers(["1", "2"]);

    expect(result.message).toContain("Receivers deleted");
    expect(result.status).toBe(200);
  });
});

describe("Update Receiver - Unit test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const receiversData = {
    count: 2,
    rows: [
      {
        id: "1",
        name: "Receiver 1",
        document: "123456789",
        email: "receiver1@email.com",
        status: "Validado",
        pixData: {
          pixKey: "mockPixKey1",
          pixKeyType: "EMAIL",
          bankName: "Mock Bank",
          bankImageUrl: "https://mockbank.com/image.png",
          agency: "1234",
          cc: "5678",
        },
      },
      {
        id: "2",
        name: "Receiver 2",
        document: "987654321",
        email: "receiver2@email.com",
        status: "Rascunho",
        pixData: {
          pixKey: "mockPixKey2",
          pixKeyType: "EMAIL",
          bankName: "Mock Bank",
          bankImageUrl: "https://mockbank.com/image.png",
          agency: "5678",
          cc: "9012",
        },
      },
    ],
  };

  it("should not update the receiver name when status equal 'Validado'", async () => {
    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(receiversData.rows[0] as any);
    Receiver.findOne = findOneMock;

    (Receiver.update as jest.Mock).mockResolvedValueOnce(receiversData);

    const result = await receiverService.updateReceiver("1", {
      name: "Outro Receiver",
    });

    expect(result.message).toContain("Receiver already validated");
    expect(result.status).toBe(400);
  });

  it("should update the receiver email when status equal 'Validado'", async () => {
    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      receiversData.rows.find((el) => el.id === "1") as any
    );
    Receiver.findOne = findOneMock;

    (Receiver.update as jest.Mock).mockResolvedValueOnce(receiversData);

    const result = await receiverService.updateReceiver("1", {
      email: "outro_receiver1@email.com",
    });

    expect(result.message).toContain("Receiver updated");
    expect(result.status).toBe(200);
  });

  it("should update all receiver data when status equal 'Rascunho'", async () => {
    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      receiversData.rows.find((el) => el.id === "2") as any
    );
    Receiver.findOne = findOneMock;

    (Receiver.update as jest.Mock).mockResolvedValueOnce(receiversData);

    const result = await receiverService.updateReceiver("2", {
      name: "Outro Receiver 2",
      document: "151.645.480-46",
      email: "outro_receiver2@email.com",
    });

    expect(result.message).toContain("Receiver updated");
    expect(result.status).toBe(200);
  });
});

describe("Create Receiver - Unit test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const pixDataMock = [
    {
      pixKey: "receiver1@email.com",
      pixKeyType: "EMAIL",
      bankName: "Mock Bank",
      bankImageUrl: "https://mockbank.com/image.png",
      agency: "1234",
      cc: "5678",
    },
  ] as IPixData[];

  const newReceiverData = {
    name: "Receiver 1",
    document: "151.645.480-46",
    email: "thisemaildontexists@email.com",
    pixKey: "thisemaildontexists@email.com",
    pixKeyType: "EMAIL",
  } as IReceiver;

  it("should not create a receiver with a pixKey duplicated", async () => {
    const newReceiver = {
      ...newReceiverData,
      pixKey: "receiver1@email.com",
    };

    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      pixDataMock.find((el) => el.pixKey === newReceiver.pixKey) as any
    );

    PixData.findOne = findOneMock;

    (Receiver.create as jest.Mock).mockResolvedValueOnce(newReceiver);

    const result = await receiverService.createReceiver(newReceiver);

    expect(result.message).toContain("Pix key already exists");
    expect(result.status).toBe(400);
  });

  it("should not create a receiver with a invalid document", async () => {
    const newReceiver = {
      ...newReceiverData,
      document: "123456",
    };

    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      pixDataMock.find((el) => el.pixKey === newReceiver.pixKey) as any
    );
    PixData.findOne = findOneMock;

    (Receiver.create as jest.Mock).mockResolvedValueOnce(newReceiver);

    const result = await receiverService.createReceiver(newReceiver);

    expect(result.message).toContain("Invalid document");
    expect(result.status).toBe(400);
  });

  it("should not create a receiver with special characters in name", async () => {
    const newReceiver = {
      ...newReceiverData,
      name: "Receiver@1",
    };

    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      pixDataMock.find((el) => el.pixKey === newReceiver.pixKey) as any
    );
    PixData.findOne = findOneMock;

    (Receiver.create as jest.Mock).mockResolvedValueOnce(newReceiver);

    const result = await receiverService.createReceiver(newReceiver);

    expect(result.message).toContain("special character");
    expect(result.status).toBe(400);
  });

  it("should not create a receiver with invalid email", async () => {
    const newReceiver = {
      ...newReceiverData,
      email: "google.com",
    };

    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      pixDataMock.find((el) => el.pixKey === newReceiver.pixKey) as any
    );
    PixData.findOne = findOneMock;

    (Receiver.create as jest.Mock).mockResolvedValueOnce(newReceiver);

    const result = await receiverService.createReceiver(newReceiver);

    expect(result.message).toContain("Invalid email");
    expect(result.status).toBe(400);
  });

  it("should not create a receiver with invalid pix key (CNPJ)", async () => {
    const newReceiver = {
      ...newReceiverData,
      pixKey: "123456",
      pixKeyType: "CNPJ",
    } as IReceiver;

    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      pixDataMock.find((el) => el.pixKey === newReceiver.pixKey) as any
    );
    PixData.findOne = findOneMock;

    (Receiver.create as jest.Mock).mockResolvedValueOnce(newReceiver);

    const result = await receiverService.createReceiver(newReceiver);

    expect(result.message).toContain("Invalid CNPJ");
    expect(result.status).toBe(400);
  });

  it("should create a receiver with all valid data", async () => {
    const findOneMock = jest.fn() as jest.MockedFunction<typeof Model.findOne>;
    findOneMock.mockResolvedValueOnce(
      pixDataMock.find((el) => el.pixKey === newReceiverData.pixKey) as any
    );
    PixData.findOne = findOneMock;

    (Receiver.create as jest.Mock).mockResolvedValueOnce(newReceiverData);

    const result = await receiverService.createReceiver(newReceiverData);

    expect(result.message).toContain("Success");
    expect(result.status).toBe(201);
  });
});
