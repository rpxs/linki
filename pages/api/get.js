import redis from "../../lib/redis";

export default async function linkHandler(req, res) {
  if (req.query.q) {
    const body = await redis.hget("links", req.query.q);
    res.status(200).json({ body });
  } else res.status(400).json({ error: "give me a link to search for!" });
}
