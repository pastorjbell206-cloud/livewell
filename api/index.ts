// Vercel serverless entry point.
// Wraps the existing Express + tRPC app so every /api/* request is handled
// by one serverless function. Static assets (the built SPA) are served by
// Vercel directly via vercel.json rewrites.

import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

let cachedApp: express.Express | null = null;

function createApp(): express.Express {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Historical 301 redirects.
  app.get("/writing/When%20Fear%20Rewrites%20Theology", (_req, res) => {
    res.redirect(301, "/writing/when-fear-rewrites-theology");
  });
  app.get("/writing/When%20the%20Church%20Married%20Empire", (_req, res) => {
    res.redirect(301, "/writing/when-the-church-married-empire");
  });

  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.get("/api/health", async (_req, res) => {
    const out = {
      ok: true,
      ts: new Date().toISOString(),
      hasDbUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
    };
    if (process.env.DATABASE_URL) {
      try {
        const { getDb } = await import("../server/db");
        const db = await getDb();
        if (db) {
          const result = await db.execute("SELECT 1 as ping");
          out.dbReachable = true;
          out.dbResult = JSON.stringify(result).slice(0, 120);
        } else {
          out.dbReachable = false;
        }
      } catch (e) {
        out.dbReachable = false;
        out.dbError = String(e && e.message || e).slice(0, 200);
      }
    }
    res.json(out);
  });

  app.post("/api/admin/seed", async (req, res) => {
    const key = req.query.key || req.headers["x-seed-key"];
    if (!process.env.JWT_SECRET || key !== process.env.JWT_SECRET) {
      return res.status(401).json({ error: "unauthorized" });
    }
    try {
      const results = {};
      const seeders = [
        "../server/seed-all",
        "../server/seed-bundles",
        "../server/seed-reading-paths",
        "../server/seed-resources",
        "../server/seed-testimonials",
      ];
      for (const path of seeders) {
        try {
          const mod = await import(path);
          const fn = mod.default || mod.seed || mod.run;
          if (typeof fn === "function") {
            await fn();
            results[path] = "ok";
          } else {
            results[path] = "skipped (no callable export)";
          }
        } catch (e) {
          results[path] = "error: " + String(e && e.message || e).slice(0, 200);
        }
      }
      res.json({ ok: true, results });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e && e.message || e) });
    }
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

export default function handler(req, res) {
  if (!cachedApp) cachedApp = createApp();
  return cachedApp(req, res);
}
