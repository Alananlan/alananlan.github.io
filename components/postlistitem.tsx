import Link from "next/link"
import type { Post } from "../interfaces/post"
import { getCategorizedPosts } from "../lib/posts"
import moment from "moment"

interface Props {
  category: string
  posts: Post[]
}

const PostItemList = ({ category, posts }: Props) => {
  return (
    <div className="flex flex-col gap-5 mb-20">
      <h2 className="text-4xl">{category}</h2>
      <div className="flex flex-col gap-2.5 text-lg">
        {posts.map((post, id) => (
          <Link
            href={`/${post.id}`}
            key={id}
            className="hover:text-blue-700 transition duration-150"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PostItemList
