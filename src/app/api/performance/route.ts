import { NextRequest, NextResponse } from "next/server";

// Performance data storage (in production, use a database)
let performanceData: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const type = searchParams.get("type");

    let filteredData = performanceData;

    // Filter by type if specified
    if (type) {
      filteredData = performanceData.filter((data) => data.type === type);
    }

    // Limit results
    const results = filteredData.slice(-limit);

    return NextResponse.json({
      success: true,
      data: results,
      total: filteredData.length,
    });
  } catch (error) {
    console.error("Performance API GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, metrics, timestamp, url, userAgent } = body;

    // Validate required fields
    if (!type || !metrics) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, metrics" },
        { status: 400 }
      );
    }

    // Create performance entry
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      metrics,
      timestamp: timestamp || new Date().toISOString(),
      url: url || "unknown",
      userAgent: userAgent || "unknown",
      createdAt: new Date().toISOString(),
    };

    // Store performance data
    performanceData.push(entry);

    // Keep only last 1000 entries to prevent memory issues
    if (performanceData.length > 1000) {
      performanceData = performanceData.slice(-1000);
    }

    // Log performance issues in development
    if (process.env.NODE_ENV === "development") {
      if (type === "web-vitals") {
        const { name, value } = metrics;
        const thresholds = {
          LCP: 2500,
          FID: 100,
          CLS: 0.1,
          FCP: 1800,
          TTFB: 800,
        };

        const threshold = thresholds[name as keyof typeof thresholds];
        if (threshold && value > threshold) {
          console.warn(`⚠️ Poor ${name}: ${value} (threshold: ${threshold})`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      id: entry.id,
      message: "Performance data recorded",
    });
  } catch (error) {
    console.error("Performance API POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record performance data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const olderThan = searchParams.get("olderThan");

    if (type) {
      // Delete by type
      const initialLength = performanceData.length;
      performanceData = performanceData.filter((data) => data.type !== type);
      const deletedCount = initialLength - performanceData.length;

      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedCount} entries of type ${type}`,
      });
    } else if (olderThan) {
      // Delete entries older than specified date
      const cutoffDate = new Date(olderThan);
      const initialLength = performanceData.length;
      performanceData = performanceData.filter(
        (data) => new Date(data.createdAt) > cutoffDate
      );
      const deletedCount = initialLength - performanceData.length;

      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedCount} entries older than ${cutoffDate.toISOString()}`,
      });
    } else {
      // Clear all data
      const deletedCount = performanceData.length;
      performanceData = [];

      return NextResponse.json({
        success: true,
        message: `Deleted all ${deletedCount} performance entries`,
      });
    }
  } catch (error) {
    console.error("Performance API DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete performance data" },
      { status: 500 }
    );
  }
}
