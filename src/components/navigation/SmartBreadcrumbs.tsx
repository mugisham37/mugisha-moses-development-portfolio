"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useNavigation } from "@/components/providers";
import { BreadcrumbItem } from "@/types/navigation";

interface SmartBreadcrumbsProps {
  className?: string;
  showContext?: boolean;
  maxItems?: number;
}

export default function SmartBreadcrumbs({
  className = "",
  showContext = true,
  maxItems = 4,
}: SmartBreadcrumbsProps) {
  const { state } = useNavigation();

  const breadcrumbs = generateBreadcrumbs(
    state.currentPage,
    state.pageHistory,
    state.pageContext
  );
  const displayBreadcrumbs = breadcrumbs.slice(-maxItems);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page or single-level navigation
  }

  return (
    <nav
      className={`brutalist-breadcrumbs ${className}`}
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      <ol className="flex items-center space-x-2 text-sm font-mono">
        {displayBreadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                size={16}
                className="mx-2 text-foreground/60"
                aria-hidden="true"
              />
            )}

            {item.isActive ? (
              <span
                className="font-bold text-brutalist-yellow uppercase tracking-wider"
                aria-current="page"
              >
                {item.href === "/" && (
                  <Home size={16} className="inline mr-1" />
                )}
                {item.label}
                {showContext && item.context && (
                  <span className="text-xs text-foreground/60 ml-2 normal-case">
                    ({item.context})
                  </span>
                )}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-foreground/80 hover:text-brutalist-yellow hover:underline uppercase tracking-wider transition-colors duration-200"
              >
                {item.href === "/" && (
                  <Home size={16} className="inline mr-1" />
                )}
                {item.label}
                {showContext && item.context && (
                  <span className="text-xs text-foreground/60 ml-2 normal-case">
                    ({item.context})
                  </span>
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {breadcrumbs.length > maxItems && (
        <div className="text-xs text-foreground/60 mt-1">
          Showing {maxItems} of {breadcrumbs.length} pages
        </div>
      )}
    </nav>
  );
}

function generateBreadcrumbs(
  currentPage: string,
  pageHistory: string[],
  pageContext: any
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with home if not on home page
  if (currentPage !== "/") {
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isActive: false,
      context: "Start",
    });
  }

  // Add intelligent breadcrumb path based on user journey
  const pathSegments = currentPage.split("/").filter(Boolean);

  if (pathSegments.length > 0) {
    // Build breadcrumb path
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      const breadcrumbInfo = getBreadcrumbInfo(
        currentPath,
        pageContext,
        pageHistory
      );

      breadcrumbs.push({
        label: breadcrumbInfo.label,
        href: currentPath,
        isActive: isLast,
        context: breadcrumbInfo.context,
      });
    });
  } else {
    // Home page
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isActive: true,
      context: "Current",
    });
  }

  return breadcrumbs;
}

function getBreadcrumbInfo(
  path: string,
  pageContext: any,
  pageHistory: string[]
) {
  const pathMap: Record<
    string,
    {
      label: string;
      getContext: (pageContext: any, history: string[]) => string;
    }
  > = {
    "/about": {
      label: "About",
      getContext: (ctx, history) => {
        if (history.includes("/portfolio")) return "From Portfolio";
        if (history.includes("/services")) return "From Services";
        return "Background";
      },
    },
    "/portfolio": {
      label: "Portfolio",
      getContext: (ctx, history) => {
        if (history.includes("/about")) return "View Work";
        if (history.includes("/services")) return "Examples";
        return "Projects";
      },
    },
    "/services": {
      label: "Services",
      getContext: (ctx, history) => {
        if (history.includes("/portfolio")) return "Get Similar";
        if (history.includes("/about")) return "How I Help";
        return "Offerings";
      },
    },
    "/contact": {
      label: "Contact",
      getContext: (ctx, history) => {
        if (history.includes("/services")) return "Get Started";
        if (history.includes("/portfolio")) return "Discuss Project";
        return "Get in Touch";
      },
    },
    "/settings": {
      label: "Settings",
      getContext: () => "Preferences",
    },
  };

  const info = pathMap[path];
  if (!info) {
    return {
      label: path.split("/").pop()?.replace("-", " ").toUpperCase() || "Page",
      context: "Navigation",
    };
  }

  return {
    label: info.label,
    context: info.getContext(pageContext, pageHistory),
  };
}
