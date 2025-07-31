import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, id, url, timestamp } = body;

    // Validate the data
    if (!name || typeof value !== "number" || !id) {
      return NextResponse.json(
        { error: "Invalid web vitals data" },
        { status: 400 }
      );
    }

    // Log web vitals (in production, you'd send this to your analytics service)
    console.log("Web Vitals Metric:", {
      name,
      value,
      id,
      url,
      timestamp,
      userAgent: request.headers.get("user-agent"),
    });

    // Here you would typically:
    // 1. Send to Google Analytics
    // 2. Send to your custom analytics service
    // 3. Store in database for analysis
    // 4. Send to monitoring service like DataDog, New Relic, etc.

    // Example: Send to Google Analytics (if you have GA4 setup)
    /*
    if (process.env.GA_MEASUREMENT_ID) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
          client_id: id,
          events: [{
            name: 'web_vitals',
            params: {
              metric_name: name,
              metric_value: value,
              page_location: url,
            }
          }]
        })
      });
    }
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing web vitals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
