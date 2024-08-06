import { InferGetServerSidePropsType } from 'next'
import { getCategorizedPosts } from '../lib/posts'
import { getServerSideProps } from './landing/page'
import PostItemList from '../components/postlistitem'


export default function Home({ fileNames }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const posts = getCategorizedPosts(fileNames)

  console.log(posts)

  return (
    <>
      <section className=''>
        <div className='md:grid md:grid-cols-2 gap-16 my-20 w-1/2 mx-auto text-center'>
          {posts !== null &&
            Object.keys(posts).map((post) => (
              <PostItemList
                category={post}
                posts={posts[post]}
                key={post}
              />
            ))
          }
        </div>
      </section>
    </>
  )
}