import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Developer Portfolio";
    const description =
      searchParams.get("description") || "High-Converting Web Development";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            fontSize: 32,
            fontWeight: 900,
            fontFamily: "monospace",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(-45deg, #000000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000000 75%), linear-gradient(-45deg, transparent 75%, #000000 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              opacity: 0.1,
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              border: "8px solid #ffff00",
              backgroundColor: "#ffffff",
              color: "#000000",
              textAlign: "center",
              maxWidth: "900px",
              margin: "0 40px",
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#000000",
                color: "#ffff00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                fontWeight: 900,
                marginBottom: "30px",
                border: "4px solid #ffff00",
              }}
            >
              &lt;/&gt;
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  opacity: 0.8,
                  lineHeight: 1.4,
                  maxWidth: "700px",
                }}
              >
                {description}
              </div>
            )}

            {/* Bottom accent */}
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                gap: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffff00",
                  color: "#000000",
                  padding: "8px 16px",
                  fontSize: "16px",
                  fontWeight: 900,
                  border: "3px solid #000000",
                }}
              >
                REACT
              </div>
              <div
                style={{
                  backgroundColor: "#ffff00",
                  color: "#000000",
                  padding: "8px 16px",
                  fontSize: "16px",
                  fontWeight: 900,
                  border: "3px solid #000000",
                }}
              >
                NEXT.JS
              </div>
              <div
                style={{
                  backgroundColor: "#ffff00",
                  color: "#000000",
                  padding: "8px 16px",
                  fontSize: "16px",
                  fontWeight: 900,
                  border: "3px solid #000000",
                }}
              >
                TYPESCRIPT
              </div>
            </div>
          </div>

          {/* Website URL */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#ffff00",
              fontFamily: "monospace",
            }}
          >
            yourportfolio.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : "Unknown error"}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
