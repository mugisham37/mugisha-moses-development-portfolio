import { NextRequest, NextResponse } from "next/server";

// Web Vitals data storage
let webVitalsData: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, id, url, timestamp } = body;

    // Validate required fields
    if (!name || value === undefined || !id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, value, id" },
        { status: 400 }
      );
    }

    // Create Web Vitals entry
    const entry = {
      id: `${name}-${id}-${Date.now()}`,
      name,
      value,
      metricId: id,
      url: url || "unknown",
      timestamp: timestamp || Date.now(),
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Store Web Vitals data
    webVitalsData.push(entry);

    // Keep only last 500 entries
    if (webVitalsData.length > 500) {
      webVitalsData = webVitalsData.slice(-500);
    }

    // Log Web Vitals in development
    if (process.env.NODE_ENV === "development") {
      const thresholds = {
        LCP: { good: 2500, poor: 4000 },
        FID: { good: 100, poor: 300 },
        CLS: { good: 0.1, poor: 0.25 },
        FCP: { good: 1800, poor: 3000 },
        TTFB: { good: 800, poor: 1800 },
      };

      const threshold = thresholds[name as keyof typeof thresholds];
      if (threshold) {
        let status = "good";
        if (value > threshold.poor) {
          status = "poor";
        } else if (value > threshold.good) {
          status = "needs-improvement";
        }

        const emoji =
          status === "good"
            ? "✅"
            : status === "needs-improvement"
            ? "⚠️"
            : "❌";
        console.log(`${emoji} ${name}: ${value} (${status})`);
      }
    }

    // Send to external analytics if configured
    if (process.env.ANALYTICS_ENDPOINT) {
      try {
        await fetch(process.env.ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ANALYTICS_TOKEN}`,
          },
          body: JSON.stringify({
            type: "web-vitals",
            metric: name,
            value,
            id,
            url,
            timestamp,
            userAgent: entry.userAgent,
          }),
        });
      } catch (error) {
        console.error("Failed to send to external analytics:", error);
      }
    }

    return NextResponse.json({
      success: true,
      id: entry.id,
      message: "Web Vitals data recorded",
    });
  } catch (error) {
    console.error("Web Vitals API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record Web Vitals data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get("metric");
    const limit = parseInt(searchParams.get("limit") || "100");
    const since = searchParams.get("since");

    let filteredData = webVitalsData;

    // Filter by metric if specified
    if (metric) {
      filteredData = webVitalsData.filter((data) => data.name === metric);
    }

    // Filter by date if specified
    if (since) {
      const sinceDate = new Date(since);
      filteredData = filteredData.filter(
        (data) => new Date(data.createdAt) > sinceDate
      );
    }

    // Limit results
    const results = filteredData.slice(-limit);

    // Calculate statistics
    const stats = calculateWebVitalsStats(results);

    return NextResponse.json({
      success: true,
      data: results,
      stats,
      total: filteredData.length,
    });
  } catch (error) {
    console.error("Web Vitals GET API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Web Vitals data" },
      { status: 500 }
    );
  }
}

// Calculate Web Vitals statistics
function calculateWebVitalsStats(data: any[]) {
  const stats: any = {};
  const metrics = ["LCP", "FID", "CLS", "FCP", "TTFB"];

  metrics.forEach((metric) => {
    const metricData = data.filter((d) => d.name === metric);
    if (metricData.length === 0) return;

    const values = metricData.map((d) => d.value);
    const sorted = values.sort((a, b) => a - b);

    stats[metric] = {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p75: sorted[Math.floor(sorted.length * 0.75)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };

    // Calculate performance score based on thresholds
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (threshold) {
      const goodCount = values.filter((v) => v <= threshold.good).length;
      const needsImprovementCount = values.filter(
        (v) => v > threshold.good && v <= threshold.poor
      ).length;
      const poorCount = values.filter((v) => v > threshold.poor).length;

      stats[metric].distribution = {
        good: (goodCount / values.length) * 100,
        needsImprovement: (needsImprovementCount / values.length) * 100,
        poor: (poorCount / values.length) * 100,
      };

      // Calculate overall score (0-100)
      stats[metric].score = Math.round(
        (goodCount * 100 + needsImprovementCount * 50) / values.length
      );
    }
  });

  return stats;
}
