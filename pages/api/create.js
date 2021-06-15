import { v4 as uuidv4 } from "uuid";
import random from "../../lib/random";
import redis from "../../lib/redis";

export default async function createLink(req, res) {
  const { link } = req.body;
  const isUrl = (string) => {
    try {
      return Boolean(
        new URL(
          new RegExp("^(http|https)://", "i").test(string)
            ? string
            : `https://${string}`
        )
      );
    } catch (e) {
      return false;
    }
  };
  if (!link || !isUrl(link)) {
    res.status(400).json({
      error:
        "you either didnt give me a link or your link is not a link at all.",
    });
  } else if (link.length < 500) {
    const id = uuidv4();
    const newLink = {
      id,
      link: link,
      views: 1,
      created_at: Date.now(),
    };
    const url = await random(6);
    console.log(url);

    await redis.hset("links", url, JSON.stringify(newLink));
    res.status(200).json({
      short_link: url,
    });
  } else {
    console.log("threw this");
    res.status(400).json({
      error: "your link is too massive",
    });
  }
}
