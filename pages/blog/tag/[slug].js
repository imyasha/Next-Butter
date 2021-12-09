import Link from "next/link";

import camelcaseKeys from 'camelcase-keys';

import PostsList from "@/components/blog/posts-list";

import { getPostsData, getCategories, getTags } from '@/lib/api'
import CategoriesWidget from "@/components/blog/categories-widget";
import SearchWidget from "@/components/blog/search-widget";

export default function Tag({ posts, categories, slug }) {
    return (
        <>
            <section id="blog-roll" className="blog-roll-nav">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12">

                            <div className="section-title text-center">
                                <h2>Blog Posts by Tag</h2>
                                <ul className="breadcrumb-nav">
                                    <li><Link href="/">
                                        <a>Home</a>
                                    </Link></li>
                                    <li><Link href="/blog">
                                        <a>Blog</a>
                                    </Link></li>
                                    <li>Tag: {slug}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="blog-posts">
                <div className="container">
                    <div className="row justify-content-center">
                        <PostsList posts={posts || []} />
                        <aside className="col-12 col-lg-4">
                            <SearchWidget />
                            <CategoriesWidget categories={categories || []} />
                        </aside>
                    </div>
                </div >
            </section >
        </>
    )
}

export async function getStaticProps({ params: { slug } }) {
    try {
        const blogPosts = (await getPostsData({ tag: slug })).posts
        const categories = await getCategories()

        return {
            props: { posts: camelcaseKeys(blogPosts), categories, slug },
            revalidate: 1,
        };
    } catch (e) {
        return {
            notFound: true
        }
    }
}

export async function getStaticPaths() {
    const butterToken = process.env.NEXT_PUBLIC_BUTTER_CMS_API_KEY
    if (butterToken) {
        try {
            const tags = await getTags();

            return {
                paths: tags.map((tag) => `/blog/tag/${tag.slug}`),
                fallback: true
            };
        } catch (e) {
            console.error(`Couldn't load tags.`, e)

            return {
                paths: [],
                fallback: false
            }
        }
    }

    return {
        paths: [],
        fallback: false
    }
}

