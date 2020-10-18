import React, { FC } from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import ShareButtons from '../components/share-buttons';
import GatsbyImage from 'gatsby-image';

type Props = PageProps<
  GatsbyTypes.BlogPostBySlugQuery,
  GatsbyTypes.MarkdownRemarkEdge
>;

const BlogPostTemplate: FC<Props> = ({ data, pageContext, location }) => {
  const post = data.markdownRemark!;
  const siteTitle = data.site!.siteMetadata!.title ?? `Title`;
  const { previous, next } = pageContext;

  const imagePath = post.frontmatter?.image?.publicURL;
  const image = post.frontmatter?.image?.childImageSharp?.fluid;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post!.frontmatter!.title ?? ''}
        description={post.frontmatter!.description ?? post.excerpt}
        image={imagePath}
      />
      <article
        className="blog-post"
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter!.title}</h1>
          <p>{post.frontmatter!.date}</p>
          {image && (
            <div>
              <GatsbyImage fluid={image} itemProp="image" />
            </div>
          )}
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post?.html ?? '' }}
          itemProp="articleBody"
        />
        <ShareButtons
          slug={post!.fields!.slug!}
          title={post!.frontmatter!.title!}
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous?.fields!.slug && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter!.title}
              </Link>
            )}
          </li>
          <li>
            {next?.fields!.slug && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter!.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        description
        category
        image {
          publicURL
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
