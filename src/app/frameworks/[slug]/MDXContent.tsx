import { MDXRemote } from "next-mdx-remote/rsc"

interface MDXContentProps {
  source: string
}

export default async function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} />
}
