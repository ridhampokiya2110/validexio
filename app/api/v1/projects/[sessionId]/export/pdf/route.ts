import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import PDFDocument from "pdfkit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth as getSessionAuth } from "@/lib/auth";

// Export endpoints require strict ratelimiting (5 per hour)
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    if (ratelimit) {
      const { success } = await ratelimit.limit(`export_pdf_${ip}_${sessionId}`);
      if (!success) {
        return NextResponse.json({ error: "Export rate limit exceeded. Try again later." }, { status: 429 });
      }
    }

    const sessionAuth = await getSessionAuth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the validation report
    const report = await prisma.validationReport.findUnique({
      where: { id: sessionId },
      include: { idea: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    if (report.userId !== sessionAuth.user.id) {
      return NextResponse.json({ error: "Unauthorized access to report" }, { status: 403 });
    }

    const userTier = (sessionAuth.user as any).tier || "FREE";
    if (userTier === "FREE" || userTier === "STARTER") {
      return NextResponse.json({ error: "Pro subscription required to export PDF." }, { status: 403 });
    }

    // Create a ReadableStream to stream the PDF directly to the client
    const stream = new ReadableStream({
      start(controller) {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

        // Pipe PDF data to the ReadableStream controller
        doc.on("data", (chunk) => controller.enqueue(chunk));
        doc.on("end", () => controller.close());

        // --- STYLES & HELPERS ---
        const COLOR_PRIMARY = '#111827';
        const COLOR_BRAND = '#630102';
        const COLOR_SECONDARY = '#6B7280';
        const COLOR_BORDER = '#E5E7EB';

        const addHeader = (title: string) => {
          doc.moveDown(1.5);
          doc.font('Helvetica-Bold').fontSize(14).fillColor(COLOR_BRAND).text(title.toUpperCase());
          doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).strokeColor(COLOR_BORDER).stroke();
          doc.moveDown(0.5);
        };

        const addSubHeader = (title: string) => {
          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR_PRIMARY).text(title);
          doc.moveDown(0.2);
        };

        const addText = (text: string, color = COLOR_SECONDARY, size = 10, align: 'left' | 'center' | 'right' | 'justify' = 'left') => {
          if (!text) return;
          doc.font('Helvetica').fontSize(size).fillColor(color).text(text, { align });
        };

        const addBullets = (items: any[], indent = 15) => {
          if (!items || !Array.isArray(items)) return;
          items.forEach(item => {
            if (typeof item === 'string') {
              doc.font('Helvetica').fontSize(10).fillColor(COLOR_SECONDARY).text(`•  ${item}`, { indent });
              doc.moveDown(0.2);
            } else if (item && item.title) {
              doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR_PRIMARY).text(`•  ${item.title}`, { indent });
              doc.font('Helvetica').fontSize(9).fillColor(COLOR_SECONDARY).text(`${item.details}`, { indent: indent + 15 });
              doc.font('Helvetica-Oblique').fontSize(8).fillColor('#10B981').text(`Metric: ${item.metric}`, { indent: indent + 15 });
              doc.moveDown(0.3);
            }
          });
        };

        // --- TITLE SECTION ---
        doc.rect(0, 0, 595, 100).fill('#111827');
        doc.font('Helvetica-Bold').fontSize(28).fillColor('#FFFFFF').text('VALIDEXIO PRO', 50, 35);
        doc.font('Helvetica').fontSize(10).fillColor('#9CA3AF').text(`Generated on ${new Date(report.createdAt).toLocaleDateString()}`, 50, 65);
        
        const score = report.validationScore || 0;
        const scoreColor = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
        
        doc.font('Helvetica-Bold').fontSize(24).fillColor(scoreColor).text(report.validationScore?.toString() || '--', 500, 35, { align: 'right' });
        doc.font('Helvetica').fontSize(10).fillColor('#9CA3AF').text('RIGOR SCORE', 450, 65, { align: 'right' });
        
        doc.x = 50;
        doc.y = 130;

        // --- EXECUTIVE SUMMARY ---
        addHeader('Executive Summary');
        doc.font('Helvetica-Bold').fontSize(16).fillColor(COLOR_PRIMARY).text(report.idea?.title || 'Untitled Idea');
        addText(`Industry: ${report.idea?.industry || 'N/A'}`, COLOR_BRAND, 10);
        doc.moveDown(0.5);
        addText(report.idea?.description || 'No description provided.', COLOR_PRIMARY, 11, 'justify');

        // --- SWOT ANALYSIS ---
        const swot = report.swotAnalysis as any;
        if (swot) {
          addHeader('SWOT Analysis');
          
          doc.font('Helvetica-Bold').fontSize(11).fillColor('#10B981').text('Strengths');
          addBullets(swot.strengths, 15);
          doc.moveDown(0.5);
          
          doc.font('Helvetica-Bold').fontSize(11).fillColor('#EF4444').text('Weaknesses');
          addBullets(swot.weaknesses, 15);
          doc.moveDown(0.5);
          
          doc.font('Helvetica-Bold').fontSize(11).fillColor('#3B82F6').text('Opportunities');
          addBullets(swot.opportunities, 15);
          doc.moveDown(0.5);
          
          doc.font('Helvetica-Bold').fontSize(11).fillColor('#F59E0B').text('Threats');
          addBullets(swot.threats, 15);
          doc.moveDown(0.5);
        }

        // --- MARKET ANALYSIS ---
        const market = report.marketAnalysis as any;
        const actionPlan = report.actionPlan as any;
        if (market || actionPlan?.premium_execution?.market_sizing_and_pricing) {
          addHeader('Market Analysis');
          if (market?.score) {
            addText(`Saturation Score: ${market.score}/100`, COLOR_BRAND, 10);
          }
          if (actionPlan?.premium_execution?.market_sizing_and_pricing?.tam_sam_som_values) {
            addSubHeader('TAM / SAM / SOM');
            addText(actionPlan.premium_execution.market_sizing_and_pricing.tam_sam_som_values, COLOR_PRIMARY, 11);
          }
          if (market?.reasoning) {
            doc.moveDown(0.5);
            addText(market.reasoning, COLOR_SECONDARY, 10, 'justify');
          }
        }

        // --- COMPETITOR ANALYSIS ---
        const competitors = report.competitors as any[];
        if (Array.isArray(competitors) && competitors.length > 0) {
          addHeader('Competitor Analysis');
          competitors.forEach((comp, i) => {
            if (i > 0) doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR_PRIMARY).text(`${comp.name} `);
            doc.font('Helvetica').fontSize(9).fillColor(COLOR_SECONDARY).text(`(${comp.website || 'N/A'}) - ${comp.pricing || 'N/A'}`, { continued: false });
            addText(comp.description, COLOR_SECONDARY, 10);
          });
        }

        // --- REVENUE & PRICING ---
        const revenue = report.revenuePotential as any;
        const pricing = report.pricingRecommendation as any;
        if (revenue || pricing) {
          addHeader('Revenue & Pricing Strategy');
          
          if (pricing?.strategy) {
            doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR_PRIMARY).text(`Strategy: `, { continued: true }).font('Helvetica').fillColor(COLOR_BRAND).text(pricing.strategy);
            doc.moveDown(0.5);
          }

          if (Array.isArray(pricing?.tiers)) {
            pricing.tiers.forEach((tier: any) => {
              doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR_PRIMARY).text(`${tier.name} - ${tier.price}`);
              if (tier.target) addText(`Target: ${tier.target}`, COLOR_SECONDARY, 9);
              doc.moveDown(0.2);
            });
            doc.moveDown(0.5);
          }

          if (revenue?.revenueStreams) {
            addSubHeader('Revenue Streams');
            addBullets(revenue.revenueStreams);
          }
        }

        // --- ACTION PLAN ---
        if (actionPlan) {
          addHeader('90-Day Action Plan');
          if (actionPlan.day30) {
            addSubHeader('First 30 Days (MVP & Launch)');
            addBullets(actionPlan.day30);
          }
          if (actionPlan.day60) {
            addSubHeader('Days 31-60 (Iterate & Sell)');
            addBullets(actionPlan.day60);
          }
          if (actionPlan.day90) {
            addSubHeader('Days 61-90 (Scale & Retain)');
            addBullets(actionPlan.day90);
          }
        }

        // --- PREMIUM EXECUTION ---
        if (actionPlan?.premium_execution) {
          const premium = actionPlan.premium_execution;
          addHeader('Premium Execution Strategies');
          
          if (premium.adaptive_tech_stack?.cloud_blueprint) {
            addSubHeader('Cloud Blueprint');
            addText(premium.adaptive_tech_stack.cloud_blueprint);
            doc.moveDown(0.5);
          }
          if (premium.signal_to_sales_mapping && Array.isArray(premium.signal_to_sales_mapping)) {
            addSubHeader('Signal-to-Sales Mapping');
            premium.signal_to_sales_mapping.forEach((mapping: any) => {
              doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_PRIMARY).text(`Signal: `, { continued: true }).font('Helvetica').fillColor(COLOR_SECONDARY).text(mapping.reddit_complaint);
              doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_BRAND).text(`Hook: `, { continued: true }).font('Helvetica').fillColor(COLOR_SECONDARY).text(mapping.email_hook);
              doc.moveDown(0.2);
            });
          }
        }

        // Footer
        const pages = doc.bufferedPageRange ? doc.bufferedPageRange().count : 1;
        for (let i = 0; i < pages; i++) {
          doc.switchToPage(i);
          doc.font('Helvetica').fontSize(8).fillColor('#9CA3AF').text(
            `Validexio Pro Report - Confidentially generated for ${report.idea?.title || 'Idea'}`,
            50,
            doc.page.height - 35,
            { align: 'center', lineBreak: false }
          );
        }

        // Finalize PDF
        doc.end();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="validexio-report-${sessionId}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("[Export PDF API] Error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        ...(process.env.NODE_ENV === "development" && {
          details: error?.message || String(error), 
          stack: error?.stack 
        })
      }, 
      { status: 500 }
    );
  }
}
