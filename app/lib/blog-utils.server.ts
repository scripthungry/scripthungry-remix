import { blog, site } from '~/config'
import type {
  PostAuthorFragment,
  PostsExcerptsQuery,
} from '~/generated/graphql.server'

import type { PostBySlugQuery } from '../generated/graphql.server'
import type { CloudinaryImageProps } from './cloudinary'
import { getCloudinaryImageProps } from './cloudinary'

export const getBlogImagesData = async (
  postExcerptData: PostsExcerptsQuery,
) => {
  return postExcerptData?.graphcms?.posts
    ? await Promise.all<CloudinaryImageProps | undefined>(
        postExcerptData.graphcms.posts.map(async (post) => {
          if (post.coverImage) {
            return await getCloudinaryImageProps({
              alt: post.title || '',
              height: post.coverImage.height || 9,
              imgName: `graphcms/${post.coverImage.handle}`,
              width: post.coverImage.width || 16,
            })
          }
        }),
      )
    : []
}

export const getPostImageProps = async ({
  postData,
}: {
  postData: PostBySlugQuery
}) => {
  return postData?.graphcms?.post?.coverImage
    ? await getCloudinaryImageProps({
        imgName: `graphcms/${postData?.graphcms?.post?.coverImage?.handle}`,
        alt: postData.graphcms.post.title,
        width: postData.graphcms.post.coverImage.width || 16,
        height: postData.graphcms.post.coverImage.height || 9,
      })
    : null
}

export const getPostAuthorImageProps = async ({
  postAuthor,
}: {
  postAuthor: PostAuthorFragment | undefined | null
}) => {
  return postAuthor?.picture?.handle
    ? await getCloudinaryImageProps({
        imgName: `graphcms/${postAuthor.picture.handle}`,
        alt: '',
        width: 48,
        height: 48,
      })
    : null
}

export const getPageTitle = ({
  categoryName,
  pageNo,
}: {
  categoryName: string
  pageNo: number
}) => {
  const title: Record<number, string>[] = []
  if (categoryName) {
    title.push(categoryName)
  }
  if (pageNo > 1) {
    title.push(`Page ${pageNo}`)
  }
  title.push(`${site.name} - Blog`)

  return title.join(' | ')
}

export const getTotalPages = (postExcerptData: PostsExcerptsQuery) => {
  return postExcerptData?.graphcms
    ? postExcerptData.graphcms?.postsConnection.aggregate.count /
        blog.postsPerPage
    : 1
}
