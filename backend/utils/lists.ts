import { Express } from "express";
import logger from "./logger.js";

export const asciiLogo = `
▓█████  ▄████▄   ██░ ██  ▒█████      ▄████▄   ██░ ██  ▄▄▄     ▄▄▄█████▓  ██████ 
▓█   ▀ ▒██▀ ▀█  ▓██░ ██▒▒██▒  ██▒   ▒██▀ ▀█  ▓██░ ██▒▒████▄   ▓  ██▒ ▓▒▒██    ▒ 
▒███   ▒▓█    ▄ ▒██▀▀██░▒██░  ██▒   ▒▓█    ▄ ▒██▀▀██░▒██  ▀█▄ ▒ ▓██░ ▒░░ ▓██▄   
▒▓█  ▄ ▒▓▓▄ ▄██▒░▓█ ░██ ▒██   ██░   ▒▓▓▄ ▄██▒░▓█ ░██ ░██▄▄▄▄██░ ▓██▓ ░   ▒   ██▒
░▒████▒▒ ▓███▀ ░░▓█▒░██▓░ ████▓▒░   ▒ ▓███▀ ░░▓█▒░██▓ ▓█   ▓██▒ ▒██▒ ░ ▒██████▒▒
░░ ▒░ ░░ ░▒ ▒  ░ ▒ ░░▒░▒░ ▒░▒░▒░    ░ ░▒ ▒  ░ ▒ ░░▒░▒ ▒▒   ▓▒█░ ▒ ░░   ▒ ▒▓▒ ▒ ░
 ░ ░  ░  ░  ▒    ▒ ░▒░ ░  ░ ▒ ▒░      ░  ▒    ▒ ░▒░ ░  ▒   ▒▒ ░   ░    ░ ░▒  ░ ░
   ░   ░         ░  ░░ ░░ ░ ░ ▒     ░         ░  ░░ ░  ░   ▒    ░      ░  ░  ░  
   ░  ░░ ░       ░  ░  ░    ░ ░     ░ ░       ░  ░  ░      ░  ░              ░  
       ░                            ░                                                                                                                   
`;

export const listRoutes = (app: Express) => {
  const routeSet = new Set<string>();

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      middleware.route.stack.forEach((layer: any) => {
        if (layer.method) {
          routeSet.add(
            `${layer.method.toUpperCase()} ${middleware.route.path}`
          );
        }
      });
    } else if (middleware.name === "router" && middleware.handle.stack) {
      const basePath = middleware.regexp
        .toString()
        .replace("/^", "")
        .replace("\\/?(?=/|$)/i", "")
        .replace(/\\/g, "")
        .replace(/\?.*$/, "");

      middleware.handle.stack.forEach((layer: any) => {
        if (layer.route) {
          layer.route.stack.forEach((l: any) => {
            if (l.method) {
              routeSet.add(
                `${l.method.toUpperCase()} ${basePath}${layer.route.path}`
              );
            }
          });
        }
      });
    }
  });

  const routes = Array.from(routeSet).map((route) => {
    const [method, path] = route.split(" ");
    return { Method: method, Path: path };
  });

  logger.info("📌 Available API Routes:");
  console.table(routes);
};
