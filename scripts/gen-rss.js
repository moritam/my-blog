const { promises: fs } = require("fs");
const path = require("path");
const RSS = require("rss");
const matter = require("gray-matter");

async function generate() {
  const feed = new RSS({
    title: "moritam my-blog",
    site_url: "https://my-blog-vert-theta.vercel.app/",
    feed_url: "https://my-blog-vert-theta.vercel.app/feed.xml",
  });

  const posts = await fs.readdir(path.join(__dirname, "..", "pages", "posts"));

  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith("index.")) return;

      const content = await fs.readFile(
        path.join(__dirname, "..", "pages", "posts", name),
      );
      const frontmatter = matter(content);

      feed.item({
        title: frontmatter.data.title,
        url: "/posts/" + name.replace(/\.mdx?/, ""),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag.split(", "),
        author: frontmatter.data.author,
      });
    }),
  );

  await fs.writeFile("./public/feed.xml", feed.xml({ indent: true }));
}

generate();
