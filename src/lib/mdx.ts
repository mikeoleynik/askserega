import { serialize } from "next-mdx-remote/serialize"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"

export async function serializeMDX(source: string): Promise<MDXRemoteSerializeResult> {
  return serialize(source, {
    mdxOptions: {
      development: process.env.NODE_ENV === "development",
    },
  })
}
