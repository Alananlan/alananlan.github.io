import Link from "next/link"
import { getPostData } from "../../lib/posts"

export function generateStaticParams() {
  return [{ slug: 'Steam-SyncUp' }]
}

const Post = async ({ params }: { params: { slug: string } }) => {
  const postData = await getPostData(params.slug)
  return (
    <section className="mx-auto w-10/12 md:w-1/2 mt-20 flex flex-col gap-5">
      <div className="flex justify-between font-poppins">
          <Link href={"/"} className="flex flex-row gap-1 place-items-center">
            <p>Back to main</p>
          </Link>
          <p>{postData.date.toString()}</p>
      </div>
      <article
          className="post"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </section>
  )
}

export default Post;