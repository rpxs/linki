import redis from "../lib/redis";
export default function Link() {
  return <p>you will be redirected soon.</p>;
}

export async function getServerSideProps(context) {
  const query = context.params.link;

  const res = await redis.hget("links", query);
  const info = JSON.parse(res);
  if (!info) {
    return {
      notFound: true,
    };
  } else {
    return {
      redirect: {
        destination: info.link,
        permanent: true,
      },
    };
  }
}
