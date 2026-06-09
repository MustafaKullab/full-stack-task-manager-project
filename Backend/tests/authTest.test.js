require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
  mongoose.connect(process.env.MONGO_URI);
}, 60000);

afterAll(async () => {
  mongoose.connection.close();
});

describe("POST /login", () => {
  it("عندما يكون الرد ناجح رجع 200 ", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "momoana013@gmail.com", password: "a0597116801z" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  }, 60000);
});
