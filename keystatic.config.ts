import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*/",
      previewUrl: "http://localhost:3000/blog/{slug}",
      schema: {
        title: fields.slug({
          name: { label: "Title" },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          multiline: true,
          description:
            "Short summary shown on the blog listing page and in link previews.",
        }),
        featuredImage: fields.image({
          label: "Featured image",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
          validation: { isRequired: false },
        }),
        category: fields.text({
          label: "Category",
          defaultValue: "Technology",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value || "Tag",
        }),
        createdAt: fields.date({
          label: "Published date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: "Featured",
          description: 'Shown in the homepage "recent posts" strip.',
          defaultValue: false,
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Draft posts are hidden from the public site.",
          defaultValue: false,
        }),
        content: fields.text({
          label: "Content",
          multiline: true,
          description: "Post body in Markdown.",
        }),
      },
    }),
  },
});
