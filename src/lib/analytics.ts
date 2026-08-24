/**
 * Analytics tracking utilities for Google Analytics 4.
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function isGtagAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    !!GA_MEASUREMENT_ID &&
    typeof (window as { gtag?: unknown }).gtag === "function"
  );
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (isGtagAvailable()) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      eventName,
      params,
    );
  }
}

export const analytics = {
  blog: {
    view: (postSlug: string, postTitle: string, category?: string) => {
      trackEvent("view_blog_post", {
        content_type: "blog_post",
        content_id: postSlug,
        content_title: postTitle,
        content_category: category,
      });
    },

    readTime: (postSlug: string, timeInSeconds: number) => {
      trackEvent("blog_read_time", {
        content_type: "blog_post",
        content_id: postSlug,
        value: timeInSeconds,
      });
    },
  },

  search: {
    query: (searchQuery: string, resultsCount: number) => {
      trackEvent("search", {
        search_term: searchQuery,
        results_count: resultsCount,
      });
    },

    resultClick: (
      searchQuery: string,
      contentType: string,
      contentId: string,
      position: number,
    ) => {
      trackEvent("search_result_click", {
        search_term: searchQuery,
        content_type: contentType,
        content_id: contentId,
        position: position,
      });
    },
  },

  engagement: {
    scrollDepth: (percentage: number, page: string) => {
      trackEvent("scroll_depth", {
        scroll_percentage: percentage,
        page_path: page,
      });
    },
  },
};
