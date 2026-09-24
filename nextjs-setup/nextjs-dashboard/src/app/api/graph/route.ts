import type { NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    // Resolves to smma/graphify-out/graph.json
    const graphPath = resolve(process.cwd(), "..", "..", "graphify-out", "graph.json");

    if (!existsSync(graphPath)) {
      return NextResponse.json(
        { error: "graph.json not found", phases: {}, planProgress: {}, totalNodes: 0, totalLinks: 0 },
        { status: 404 }
      );
    }

    // Read the graphify-generated graph using Node.js fs
    const rawData = readFileSync(graphPath, "utf-8");
    const data = JSON.parse(rawData);

    // Extract phases and plans from the graph
    const nodes = data.nodes || [];
    const links = data.links || []; // graphify uses "links" not "edges"
    const hyperedges = data.hyperedges || [];

    // Map graph node IDs to SMM phases and plans
    const phaseMap: Record<string, string> = {
      // Content-related nodes
      "src_smm_domain_models_contentdraft": "Content Creation",
      "src_smm_domain_models_publishresult": "Content Creation",
      "enum": "Content Creation",
      "ContentDraft": "Content Creation",

      // Brand-related nodes
      "src_smm_domain_models_brandprofile": "Brand Strategy",
      "BrandProfile": "Brand Strategy",

      // Planning-related nodes
      "src_smm_content_planner_contentplanner": "Content Planning",
      "src_smm_content_planner_contentplan": "Content Planning",
      "ContentPlanner": "Content Planning",
      "src_smm_ai_provider_generationrequest": "Content Planning",
      "GenerationRequest": "Content Planning",
      "src_smm_ai_provider_stubaiprovider": "Content Planning",

      // Meta integration nodes
      "src_smm_integrations_adapters_metaadapter": "Meta Integration",
      "MetaAdapter": "Meta Integration",

      // Publishing workflow nodes
      "src_smm_publishing_service_publishingservice": "Publishing Workflow",
      "PublishingService": "Publishing Workflow",
      "src_smm_publishing_ports_publisher": "Publishing Workflow",
      "Publisher": "Publishing Workflow",

      // Moderation nodes
      "src_smm_moderation_policy_moderationservice": "Moderation",
      "ModerationService": "Moderation",
      "src_smm_moderation_policy_moderationresult": "Moderation",
      "ModerationResult": "Moderation",

      // Analytics nodes
      "src_smm_domain_models_analyticssnapshot": "Analytics Tracking",
      "AnalyticsSnapshot": "Analytics Tracking",

      // AI generation nodes
      "src_smm_ai_provider_aiprovider": "AI Generation",
      "src_smm_ai_provider_generationresult": "AI Generation",
      "GenerationResult": "AI Generation",

      // Draft lifecycle nodes
      "src_smm_domain_models_draftstatus": "Draft Lifecycle",

      // CLI and workflow nodes
      "src_smm_cli_main": "CLI",
      "src_smm_workflows_daily_build_daily_draft": "Workflow",
      "src_smm_main_run_workflow": "Workflow",

      // WASM nodes
      "src_smm_wasm_signals_signals": "WASM",
      "src_smm_wasm_signals_rank_signals": "WASM",
      "src_smm_wasm_feedback_engagement_rate": "WASM",
      "src_smm_wasm_feedback_summarize": "WASM",
      "src_smm_wasm_build_main": "WASM",

      // Package and config nodes
      "src_smm_config_settings": "Configuration",
      "src_smm_config_get_settings": "Configuration",
      "pkg_smm_wasm": "WASM",
      "pkg_social_media_smm_automation": "Package",
    };

    // Group nodes by phase
    const phases: Record<string, { nodes: string[]; edgeCount: number }> = {};
    for (const node of nodes) {
      const type = node.id || node.label || node.key || String(node);
      const phase = phaseMap[type] || "Other";
      if (!phases[phase]) {
        phases[phase] = { nodes: [], edgeCount: 0 };
      }
      phases[phase].nodes.push(type);
    }

    // Count links (integrations) per phase
    for (const link of links) {
      const source = link.source || "";
      const target = link.target || "";
      const sourcePhase = phaseMap[source] || "Other";
      const targetPhase = phaseMap[target] || "Other";
      if (sourcePhase !== targetPhase) {
        // Cross-phase link - track integration
        if (!phases[sourcePhase]) phases[sourcePhase] = { nodes: [], edgeCount: 0 };
        if (!phases[targetPhase]) phases[targetPhase] = { nodes: [], edgeCount: 0 };
        phases[sourcePhase].edgeCount += 1;
        phases[targetPhase].edgeCount += 1;
      } else if (sourcePhase === targetPhase && sourcePhase !== "Other") {
        phases[sourcePhase].edgeCount += 1;
      }
    }

    // Calculate plan progress based on node connectivity
    const planProgress: Record<string, { completed: number; total: number }> = {};
    for (const [phase, info] of Object.entries(phases)) {
      const connectedTo = new Set<string>();
      for (const link of links) {
        const source = link.source || "";
        const target = link.target || "";
        if (source.includes(phase) || target.includes(phase)) {
          connectedTo.add(source);
          connectedTo.add(target);
        }
      }
      planProgress[phase] = {
        completed: connectedTo.size,
        total: phases[phase]?.nodes.length || 0,
      };
    }

    const result = {
      phases,
      planProgress,
      godNodes: data.god_nodes || [],
      communities: data.communities || [],
      totalNodes: data.total_nodes || nodes.length,
      totalLinks: data.total_links || links.length,
      totalHyperedges: hyperedges.length,
      extractionTime: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Graph API error:", error);
    return NextResponse.json(
      { error: "Failed to load graph data" },
      { status: 500 }
    );
  }
}