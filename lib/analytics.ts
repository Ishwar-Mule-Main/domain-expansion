export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific custom events
export const event = ({
  action,
  category,
  label,
  value,
  ...otherProps
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...otherProps,
    });
  } else {
    // Fallback log hook for local debugging and Generative validation
    console.log(`[GA Event Logged]: ${action}`, { category, label, value, ...otherProps });
  }
};
