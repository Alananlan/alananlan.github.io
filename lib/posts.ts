import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"
import { remark } from "remark"
import html from "remark-html"
import type { Post } from "../interfaces/post"

const postsDirectoryPath = path.join(process.cwd(), "_posts")

export const getSortedPosts = (): Post[] => {
    const fileNames = fs.readdirSync(postsDirectoryPath);

    if (!fileNames) {
        throw new Error("fileNames is undefined")
    }

    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, "")

        const fullPath = path.join(postsDirectoryPath, fileName)
        const postContent = fs.readFileSync(fullPath, "utf-8")

        const matterPostContent = matter(postContent)

        return {
            id,
            title: matterPostContent.data.title,
            date: matterPostContent.data.date,
            category: matterPostContent.data.category
        }
    })

    return allPostsData.sort((a, b) => {
        const format = "MM-DD-YYYY"
        const dateOne = moment(a.date, format)
        const dateTwo = moment(b.date, format)
        if (dateOne.isBefore(dateTwo)) {
            return 1
        } else if (dateTwo.isBefore(dateOne)) {
            return -1
        } else {
            return 0
        }
    })
}

export const getCategorizedPosts = (fileNames: string[]): Record<string, Post[]> => {
    const sortedPosts = getSortedPosts()
    const categorizedPosts: Record<string, Post[]> = {}

    sortedPosts.forEach((post) => {
        if (!categorizedPosts[post.category]) {
            categorizedPosts[post.category] = []
        }
        categorizedPosts[post.category].push(post)
    })

    return categorizedPosts
}

export const getPostData = async (id: string) => {
    const fullPath = path.join(postsDirectoryPath, `${id}.md`)
  
    const fileContents = fs.readFileSync(fullPath, "utf-8")
  
    const matterResult = matter(fileContents)
  
    const processedContent = await remark().use(html).process(matterResult.content)
  
    const contentHtml = processedContent.toString()

    return {
      id,
      contentHtml,
      title: matterResult.data.title,
      category: matterResult.data.category,
      date: moment(matterResult.data.date, "MM-DD-YYYY").format("MMMM Do YYYY")
    }
}