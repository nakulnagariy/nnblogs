/**
 * Analytics tracking utilities for Google Analytics 4
 * Provides type-safe event tracking for blog, videos, projects, and user interactions
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Check if gtag is available
const isGtagAvailable = () => {
  return (
    typeof window !== "undefined" && GA_MEASUREMENT_ID && (window as any).gtag
  );
};

// Base event tracking function
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (isGtagAvailable()) {
    (window as any).gtag("event", eventName, params);
  }
}

// Page view tracking
export function trackPageView(url: string, title?: string) {
  if (isGtagAvailable()) {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
}

// Content Events
export const analytics = {
  // Blog post events
  blog: {
    view: (postSlug: string, postTitle: string, category?: string) => {
      trackEvent("view_blog_post", {
        content_type: "blog_post",
        content_id: postSlug,
        content_title: postTitle,
        content_category: category,
      });
    },

    like: (postSlug: string) => {
      trackEvent("like_blog_post", {
        content_type: "blog_post",
        content_id: postSlug,
      });
    },

    share: (postSlug: string, platform: string) => {
      trackEvent("share_blog_post", {
        content_type: "blog_post",
        content_id: postSlug,
        method: platform,
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

  // Video events
  video: {
    view: (
      videoSlug: string,
      videoTitle: string,
      source: "youtube" | "self-hosted",
    ) => {
      trackEvent("view_video", {
        content_type: "video",
        content_id: videoSlug,
        content_title: videoTitle,
        video_source: source,
      });
    },

    play: (videoSlug: string, source: "youtube" | "self-hosted") => {
      trackEvent("video_play", {
        content_type: "video",
        content_id: videoSlug,
        video_source: source,
      });
    },

    complete: (videoSlug: string) => {
      trackEvent("video_complete", {
        content_type: "video",
        content_id: videoSlug,
      });
    },

    share: (videoSlug: string, platform: string) => {
      trackEvent("share_video", {
        content_type: "video",
        content_id: videoSlug,
        method: platform,
      });
    },
  },

  // Project events
  project: {
    view: (projectId: string, projectName: string, technologies: string[]) => {
      trackEvent("view_project", {
        content_type: "project",
        content_id: projectId,
        content_title: projectName,
        technologies: technologies.join(","),
      });
    },

    clickGithub: (projectId: string, projectName: string) => {
      trackEvent("click_project_github", {
        content_type: "project",
        content_id: projectId,
        content_title: projectName,
      });
    },

    clickLiveDemo: (projectId: string, projectName: string) => {
      trackEvent("click_project_demo", {
        content_type: "project",
        content_id: projectId,
        content_title: projectName,
      });
    },
  },

  // Search events
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

  // CTA (Call to Action) events
  cta: {
    click: (ctaName: string, location: string) => {
      trackEvent("cta_click", {
        cta_name: ctaName,
        cta_location: location,
      });
    },

    contactFormSubmit: () => {
      trackEvent("contact_form_submit", {
        form_name: "contact",
      });
    },

    newsletterSignup: (location: string) => {
      trackEvent("newsletter_signup", {
        signup_location: location,
      });
    },
  },

  // Navigation events
  navigation: {
    click: (linkText: string, destination: string) => {
      trackEvent("navigation_click", {
        link_text: linkText,
        link_url: destination,
      });
    },

    externalLink: (url: string, linkText?: string) => {
      trackEvent("external_link_click", {
        link_url: url,
        link_text: linkText,
      });
    },
  },

  // Social media events
  social: {
    follow: (platform: string) => {
      trackEvent("social_follow", {
        platform: platform,
      });
    },

    share: (platform: string, contentType: string, contentId: string) => {
      trackEvent("social_share", {
        platform: platform,
        content_type: contentType,
        content_id: contentId,
      });
    },
  },

  // User engagement
  engagement: {
    scrollDepth: (percentage: number, page: string) => {
      trackEvent("scroll_depth", {
        scroll_percentage: percentage,
        page_path: page,
      });
    },

    timeOnPage: (timeInSeconds: number, page: string) => {
      trackEvent("time_on_page", {
        value: timeInSeconds,
        page_path: page,
      });
    },

    download: (fileName: string, fileType: string) => {
      trackEvent("file_download", {
        file_name: fileName,
        file_type: fileType,
      });
    },
  },

  // Error tracking
  error: {
    log: (errorMessage: string, errorType: string, page?: string) => {
      trackEvent("error", {
        error_message: errorMessage,
        error_type: errorType,
        page_path: page || window.location.pathname,
      });
    },

    notFound: (requestedUrl: string) => {
      trackEvent("page_not_found", {
        requested_url: requestedUrl,
      });
    },
  },
};

// Convenience function for tracking outbound links
export function trackOutboundLink(url: string, linkText?: string) {
  analytics.navigation.externalLink(url, linkText);
}

// Track page load performance
export function trackPerformance() {
  if (typeof window !== "undefined" && window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    trackEvent("page_performance", {
      page_load_time: pageLoadTime,
      connection_time: connectTime,
      render_time: renderTime,
      page_path: window.location.pathname,
    });
  }
}

// Track scroll depth (call this with a scroll listener)
export function createScrollDepthTracker(
  thresholds: number[] = [25, 50, 75, 90, 100],
) {
  const trackedDepths = new Set<number>();

  return () => {
    if (typeof window === "undefined") return;

    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const percentage = Math.round((scrolled / scrollHeight) * 100);

    thresholds.forEach((threshold) => {
      if (percentage >= threshold && !trackedDepths.has(threshold)) {
        trackedDepths.add(threshold);
        analytics.engagement.scrollDepth(threshold, window.location.pathname);
      }
    });
  };
}

// Track time on page
export function createTimeOnPageTracker() {
  const startTime = Date.now();

  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    analytics.engagement.timeOnPage(timeSpent, window.location.pathname);
  };
}
