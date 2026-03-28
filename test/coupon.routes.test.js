const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const express = require("express");

let authCalls = 0;
const controllerCalls = [];

const mockController = {
  validate: (req, res) => {
    controllerCalls.push("validate");
    res.status(200).json({ route: "validate" });
  },
  getAll: (req, res) => {
    controllerCalls.push("getAll");
    res.status(200).json({ route: "getAll" });
  },
  create: (req, res) => {
    controllerCalls.push("create");
    res.status(201).json({ route: "create" });
  },
  getById: (req, res) => {
    controllerCalls.push("getById");
    res.status(200).json({ route: "getById", id: req.params.id });
  },
  update: (req, res) => {
    controllerCalls.push("update");
    res.status(200).json({ route: "update", id: req.params.id });
  },
  delete: (req, res) => {
    controllerCalls.push("delete");
    res.status(204).send();
  },
};

const passportModulePath = path.resolve(
  __dirname,
  "../distjs/middlewares/passport/PassportRegister.js",
);
const compositionModulePath = path.resolve(
  __dirname,
  "../distjs/composition/coupon.js",
);

require.cache[passportModulePath] = {
  id: passportModulePath,
  filename: passportModulePath,
  loaded: true,
  exports: {
    __esModule: true,
    default: {
      authenticate: () => (req, res, next) => {
        authCalls += 1;
        next();
      },
    },
  },
};

require.cache[compositionModulePath] = {
  id: compositionModulePath,
  filename: compositionModulePath,
  loaded: true,
  exports: {
    couponController: mockController,
  },
};

const { couponRouter } = require("../distjs/routes/coupon.js");

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use("/coupons", couponRouter);
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
};

const request = async (baseUrl, method, route, body) => {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try {
    json = await response.json();
  } catch (_err) {
    json = null;
  }

  return {
    status: response.status,
    json,
  };
};

test("coupon router wires GET /validate and secures it with jwt middleware", async () => {
  controllerCalls.length = 0;
  authCalls = 0;

  const { server, baseUrl } = await createServer();
  try {
    const res = await request(baseUrl, "GET", "/coupons/validate?name=SAVE10");

    assert.equal(res.status, 200);
    assert.deepEqual(res.json, { route: "validate" });
    assert.deepEqual(controllerCalls, ["validate"]);
    assert.equal(authCalls, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("coupon router wires list/create endpoints", async () => {
  controllerCalls.length = 0;
  authCalls = 0;

  const { server, baseUrl } = await createServer();
  try {
    const listRes = await request(baseUrl, "GET", "/coupons/");
    const createRes = await request(baseUrl, "POST", "/coupons/", {
      name: "SAVE20",
      discount: 20,
    });

    assert.equal(listRes.status, 200);
    assert.deepEqual(listRes.json, { route: "getAll" });

    assert.equal(createRes.status, 201);
    assert.deepEqual(createRes.json, { route: "create" });

    assert.deepEqual(controllerCalls, ["getAll", "create"]);
    assert.equal(authCalls, 2);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("coupon router wires id-based get/update/delete endpoints", async () => {
  controllerCalls.length = 0;
  authCalls = 0;

  const { server, baseUrl } = await createServer();
  try {
    const getRes = await request(baseUrl, "GET", "/coupons/abc123");
    const patchRes = await request(baseUrl, "PATCH", "/coupons/abc123", {
      discount: 15,
    });
    const deleteRes = await request(baseUrl, "DELETE", "/coupons/abc123");

    assert.equal(getRes.status, 200);
    assert.deepEqual(getRes.json, { route: "getById", id: "abc123" });

    assert.equal(patchRes.status, 200);
    assert.deepEqual(patchRes.json, { route: "update", id: "abc123" });

    assert.equal(deleteRes.status, 204);

    assert.deepEqual(controllerCalls, ["getById", "update", "delete"]);
    assert.equal(authCalls, 3);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
