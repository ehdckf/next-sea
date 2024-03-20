import { createServer } from "http";
import { parse } from "url";
import next from "next";
const dev = process.env.NODE_ENV !== "production";
const hostname = "127.0.0.1";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: false, hostname, port, dir: __dirname, conf: { output: "standalone" } });
const handle = app.getRequestHandler();

app.prepare().then(() => {
        createServer(async (req: any, res: any) => {
                try {
                        // Be sure to pass `true` as the second argument to `url.parse`.
                        // This tells it to parse the query portion of the URL.
                        const parsedUrl = parse(req.url, true);
                        const { pathname, query } = parsedUrl;
                        console.log(pathname, query);

                        if (pathname === "/a") {
                                await app.render(req, res, "/a", query);
                        } else if (pathname === "/b") {
                                await app.render(req, res, "/b", query);
                        } else if (pathname === "/hello") {
                                console.log("ssssss");
                                return new Response("HELLO");
                        } else {
                                await handle(req, res, parsedUrl);
                        }
                } catch (err) {
                        console.error("Error occurred handling", req.url, err);
                        res.statusCode = 500;
                        res.end("internal server error");
                }
        })
                .once("error", (err: any) => {
                        console.error(err);
                        process.exit(1);
                })
                .listen(port, () => {
                        console.log(`> Ready on http://${hostname}:${port}`);
                });
});
