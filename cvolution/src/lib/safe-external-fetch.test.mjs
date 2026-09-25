import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import dns from "node:dns/promises";
import http from "node:http";
import { syncBuiltinESMExports } from "node:module";
import test from "node:test";
import { fetchSafeExternal, isPublicAddress, resolvePublicAddress } from "./safe-external-fetch.ts";

test("only publicly routable IPv4 addresses pass", () => {
  assert.equal(isPublicAddress("93.184.216.34"), true);
  for (const address of ["127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1"]) {
    assert.equal(isPublicAddress(address), false, address);
  }
});

test("private, mapped, documentation, and special-use IPv6 addresses are rejected", () => {
  assert.equal(isPublicAddress("2606:4700:4700::1111"), true);
  for (const address of ["::1", "fc00::1", "fe80::1", "::ffff:127.0.0.1", "2001:db8::1", "2001::1", "2002::1", "3fff::1"]) {
    assert.equal(isPublicAddress(address), false, address);
  }
});

test("DNS names resolving to private addresses are rejected", async () => {
  assert.equal(await resolvePublicAddress("localhost"), null);
});

test("a mixed public and private DNS answer is rejected before making an HTTP request", async (t) => {
  const lookup = t.mock.method(dns, "lookup", async () => [
    { address: "93.184.216.34", family: 4 },
    { address: "192.168.1.10", family: 4 },
  ]);
  let requestCount = 0;
  const request = t.mock.method(http, "request", () => {
    requestCount += 1;
    throw new Error("private DNS answer must prevent the request");
  });
  syncBuiltinESMExports();
  t.after(() => {
    lookup.mock.restore();
    request.mock.restore();
    syncBuiltinESMExports();
  });

  assert.equal(await fetchSafeExternal("http://mixed.test/", { maxBytes: 100, timeoutMs: 1000 }), null);
  assert.equal(lookup.mock.callCount(), 1);
  assert.equal(requestCount, 0);
});

test("a redirect to a private address is rejected before a second request", async (t) => {
  let requestCount = 0;
  const request = t.mock.method(http, "request", (_url, _options, callback) => {
    requestCount += 1;
    const req = new EventEmitter();
    req.end = () => {
      const res = new EventEmitter();
      res.statusCode = 302;
      res.headers = { location: "http://127.0.0.1/private" };
      res.destroy = () => {};
      callback(res);
    };
    req.destroy = () => req.emit("close");
    return req;
  });
  syncBuiltinESMExports();
  t.after(() => {
    request.mock.restore();
    syncBuiltinESMExports();
  });

  assert.equal(await fetchSafeExternal("http://93.184.216.34/start", { maxBytes: 100, timeoutMs: 1000 }), null);
  assert.equal(requestCount, 1);
});

test("response bodies larger than maxBytes are rejected", async (t) => {
  let requestDestroyed = false;
  const request = t.mock.method(http, "request", (_url, _options, callback) => {
    const req = new EventEmitter();
    req.end = () => {
      const res = new EventEmitter();
      res.statusCode = 200;
      res.headers = {};
      res.destroy = () => {};
      callback(res);
      res.emit("data", Buffer.from("1234"));
    };
    req.destroy = () => {
      requestDestroyed = true;
      req.emit("close");
    };
    return req;
  });
  syncBuiltinESMExports();
  t.after(() => {
    request.mock.restore();
    syncBuiltinESMExports();
  });

  assert.equal(await fetchSafeExternal("http://93.184.216.34/large", { maxBytes: 3, timeoutMs: 1000 }), null);
  assert.equal(requestDestroyed, true);
});
