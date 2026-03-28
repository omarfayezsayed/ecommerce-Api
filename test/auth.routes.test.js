const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const express = require("express");

let authCalls = [];
const controllerCalls = [];

const mockController = {
  register: (req, res) => {
    controllerCalls.push("register");
    res.status(201).json({ route: "register" });
  },
  logIn: (req, res) => {
    controllerCalls.push("logIn");
    res.status(200).json({ route: "logIn" });
  },
  refresh: (req, res) => {
    controllerCalls.push("refresh");
    res.status(200).json({ route: "refresh" });
  },
  logout: (req, res) => {
    controllerCalls.push("logout");
    res.status(200).json({ route: "logout" });
  },
  googleCallback: (req, res) => {
    controllerCalls.push("googleCallback");
    res.status(200).json({ route: "googleCallback" });
  },
  verifyEmail: (req, res) => {
    controllerCalls.push("verifyEmail");
    res.status(200).json({ route: "verifyEmail" });
  },
  resendVerificationCode: (req, res) => {
    controllerCalls.push("resendVerificationCode");
    res.status(200).json({ route: "resendVerificationCode" });
  },
  forgetPassword: (req, res) => {
    controllerCalls.push("forgetPassword");
    res.status(200).json({ route: "forgetPassword" });
  },
  resetPassword: (req, res) => {
    controllerCalls.push("resetPassword");
    res.status(200).json({ route: "resetPassword" });
  },
};

const passportModulePath = path.resolve(
  __dirname,
  "../distjs/middlewares/passport/PassportRegister.js",
);
const compositionModulePath = path.resolve(
  __dirname,
  "../distjs/composition/auth.js",
);

require.cache[passportModulePath] = {
  id: passportModulePath,
  filename: passportModulePath,
  loaded: true,
  exports: {
    __esModule: true,
    default: {
      authenticate: (strategy, options) => (req, res, next) => {
        authCalls.push({ strategy, options });
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
    authController: mockController,
  },
};

const { authRouter } = require("../distjs/routes/auth.js");

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
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

test("auth router wires public auth endpoints", async () => {
  controllerCalls.length = 0;
  authCalls = [];

  const { server, baseUrl } = await createServer();
  try {
    const registerRes = await request(baseUrl, "POST", "/auth/register", {
      email: "a@b.com",
      password: "123456",
    });
    const logInRes = await request(baseUrl, "POST", "/auth/logIn", {
      email: "a@b.com",
      password: "123456",
    });
    const refreshRes = await request(baseUrl, "POST", "/auth/refresh", {
      refreshToken: "token",
    });

    assert.equal(registerRes.status, 201);
    assert.equal(logInRes.status, 200);
    assert.equal(refreshRes.status, 200);
    assert.deepEqual(controllerCalls, ["register", "logIn", "refresh"]);
    assert.equal(authCalls.length, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("auth router wires logout with jwt auth middleware", async () => {
  controllerCalls.length = 0;
  authCalls = [];

  const { server, baseUrl } = await createServer();
  try {
    const logoutRes = await request(baseUrl, "POST", "/auth/logOut");

    assert.equal(logoutRes.status, 200);
    assert.deepEqual(logoutRes.json, { route: "logout" });
    assert.deepEqual(controllerCalls, ["logout"]);
    assert.equal(authCalls.length, 1);
    assert.equal(authCalls[0].strategy, "jwt");
    assert.deepEqual(authCalls[0].options, {
      session: false,
      failWithError: true,
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("auth router wires google auth routes and email/password helpers", async () => {
  controllerCalls.length = 0;
  authCalls = [];

  const { server, baseUrl } = await createServer();
  try {
    const googleRes = await request(baseUrl, "GET", "/auth/google");
    const callbackRes = await request(baseUrl, "GET", "/auth/google/callback");
    const verifyRes = await request(baseUrl, "POST", "/auth/verify-email");
    const resendRes = await request(baseUrl, "POST", "/auth/resend-verification");
    const forgetRes = await request(baseUrl, "POST", "/auth/forget-password");
    const resetRes = await request(baseUrl, "POST", "/auth/reset-password");

    assert.equal(googleRes.status, 404);
    assert.equal(callbackRes.status, 200);
    assert.equal(verifyRes.status, 200);
    assert.equal(resendRes.status, 200);
    assert.equal(forgetRes.status, 200);
    assert.equal(resetRes.status, 200);

    assert.deepEqual(controllerCalls, [
      "googleCallback",
      "verifyEmail",
      "resendVerificationCode",
      "forgetPassword",
      "resetPassword",
    ]);

    assert.equal(authCalls.length, 2);
    assert.equal(authCalls[0].strategy, "google");
    assert.deepEqual(authCalls[0].options, {
      scope: ["email", "profile"],
      session: false,
    });
    assert.equal(authCalls[1].strategy, "google");
    assert.deepEqual(authCalls[1].options, {
      session: false,
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
