import { prisma } from "../lib/db/prisma";

async function main() {
  const posts = await prisma.blogPost.findMany();
  console.log("Total posts in database:", posts.length);
  for (const post of posts) {
    console.log(`\n========================================`);
    console.log(`SLUG: ${post.slug}`);
    console.log(`TITLE: ${post.title}`);
    console.log(`BODY HTML PREVIEW (first 800 chars):`);
    console.log(post.bodyHTML ? post.bodyHTML.substring(0, 800) : "empty");
  }
}

main()
  .catch((e) => console.error(e));
