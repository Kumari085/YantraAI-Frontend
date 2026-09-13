/**
 * AegisAI Sovereign Agent Simulation Engine
 * 
 * NOTE: This file provides an isolated, spec-compliant simulation fallback for 
 * offline demonstrations or frontend testing when the FastAPI backend is not running.
 * It strictly adheres to the universal envelope schema and event types.
 */

class MockAgentSimulator {
  constructor() {
    this.telemetryInterval = null;
    this.networkAuditInterval = null;
    this.networkAuditCount = 142;
  }

  /**
   * Start background telemetry & airgap network audit emitters
   */
  startBackgroundEmitters(dispatchCallback) {
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    if (this.networkAuditInterval) clearInterval(this.networkAuditInterval);

    // Periodic telemetry every 4s matching spec 4.9
    this.telemetryInterval = setInterval(() => {
      const gpuPct = 48 + Math.floor(Math.random() * 12);
      const vramUsed = 36 + Math.floor(Math.random() * 6);
      dispatchCallback({
        type: 'telemetry',
        session_id: null,
        seq: 0,
        timestamp: new Date().toISOString(),
        payload: {
          gpu_util_pct: gpuPct,
          vram_used_gb: vramUsed,
          vram_total_gb: 80,
          vram_by_model: [
            { model_id: 'model-reasoning-qwen', gb: 24 },
            { model_id: 'model-ocr-nougat', gb: 8 },
          ],
        },
      });
    }, 4000);

    // Periodic network audit every 5s matching spec 4.9
    this.networkAuditInterval = setInterval(() => {
      this.networkAuditCount++;
      dispatchCallback({
        type: 'network_audit',
        session_id: null,
        seq: 0,
        timestamp: new Date().toISOString(),
        payload: {
          event: 'heartbeat_ok',
          verdict: 'enforced',
          process: 'aegis-airgap-kernel',
          destination: '0.0.0.0 (BLOCKED)',
          count_since_start: this.networkAuditCount,
        },
      });
    }, 5000);
  }

  stopBackgroundEmitters() {
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    if (this.networkAuditInterval) clearInterval(this.networkAuditInterval);
  }

  /**
   * Process client envelope and emit simulated server responses
   */
  handleClientEnvelope(envelope, dispatchCallback) {
    const { type, session_id, payload } = envelope;

    if (type === 'user_message') {
      this._simulateAgentExecution(session_id, payload, dispatchCallback);
    } else if (type === 'approval_action') {
      // Echo approval update
      dispatchCallback({
        type: 'heartbeat',
        session_id,
        seq: 99,
        timestamp: new Date().toISOString(),
        payload: { text: `Deliverable ${payload.artifact_id} ${payload.action === 'approve' ? 'approved' : 'rejected'}` },
      });
    }
  }

  /**
   * Run realistic multi-phase agent execution
   */
  _simulateAgentExecution(sessionId, payload, dispatch) {
    const prompt = (payload.prompt || '').toLowerCase();
    const hasImage = payload.attachments?.some(a => a.type?.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(a.name));
    const hasDoc = payload.attachments?.some(a => /\.(pdf|docx|txt|xlsx)$/i.test(a.name));
    const isCode = prompt.includes('code') || prompt.includes('audit') || prompt.includes('python') || prompt.includes('calculate');

    let stepCounter = 1;

    // Helper to send envelopes with timing
    const emit = (type, payloadObj, delayMs) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          dispatch({
            type,
            session_id: sessionId,
            seq: stepCounter++,
            timestamp: new Date().toISOString(),
            payload: payloadObj,
          });
          resolve();
        }, delayMs);
      });
    };

    (async () => {
      // 1. Initial Heartbeat
      await emit('heartbeat', { text: 'Initializing sovereign orchestrator...' }, 150);

      // 2. Model Routing
      let modelId = 'model-reasoning-qwen';
      let category = 'reasoning';
      let reason = 'Multi-step industrial reasoning required.';
      let vram = 24.0;

      if (hasImage) {
        modelId = 'model-vision-internvl';
        category = 'vision';
        reason = 'Image/Schematic optical inspection detected.';
        vram = 32.0;
      } else if (isCode) {
        modelId = 'model-coding-deepseek';
        category = 'coding';
        reason = 'Python calculation & sandbox verification requested.';
        vram = 28.0;
      }

      await emit('model_route', {
        model_id: modelId,
        category,
        reason,
        vram_gb: vram,
        load_status: 'loaded',
      }, 400);

      // 3. Phased Plan
      const planSteps = [
        { id: 'p1', phase: 'planning', title: 'Parse query parameters & security constraints', status: 'running' },
        { id: 'p2', phase: 'evaluation', title: hasImage ? 'Execute local Vision feature extraction' : (hasDoc ? 'Run local OCR & layout parsing' : 'Search internal SOPs via local RAG'), status: 'pending' },
        { id: 'p3', phase: 'execution', title: isCode ? 'Execute isolated Python sandbox stress model' : 'Verify compliance against ISO/ASME guidelines', status: 'pending' },
        { id: 'p4', phase: 'synthesis', title: 'Synthesize deliverables & generate verification artifact', status: 'pending' },
      ];

      await emit('plan', { steps: planSteps }, 500);

      // 4. Step 1 Completion
      await emit('plan_update', { id: 'p1', status: 'completed' }, 700);
      await emit('plan_update', { id: 'p2', status: 'running' }, 200);

      // 5. Tool Step (Vision / OCR / RAG)
      if (hasImage) {
        await emit('tool_step', {
          plan_step_id: 'p2',
          tool_call: {
            toolId: 'tool-vision',
            toolName: 'vision_analyzer',
            inputParams: { target: 'equipment_inspection.jpg', resolution: '4K' },
            outputResult: null,
            durationMs: 0,
            status: 'running',
          },
        }, 600);

        await emit('tool_step_update', {
          plan_step_id: 'p2',
          tool_call: {
            toolId: 'tool-vision',
            toolName: 'vision_analyzer',
            inputParams: { target: 'equipment_inspection.jpg', resolution: '4K' },
            outputResult: {
              detectedComponent: 'Industrial Centrifugal Impeller / Pump Casing',
              confidence: 0.984,
              observations: [
                'Surface oxidation and micro-pitting detected on flange perimeter',
                'Gasket alignment within 0.12mm tolerance limit',
                'Serial tag #AG-8820-K verified against local inventory database',
              ],
            },
            durationMs: 820,
            status: 'success',
          },
        }, 1100);
      } else {
        await emit('tool_step', {
          plan_step_id: 'p2',
          tool_call: {
            toolId: 'tool-rag',
            toolName: 'vector_knowledge_retriever',
            inputParams: { query: payload.prompt, top_k: 3, source: 'ASME_Section_VIII_Manual' },
            outputResult: null,
            durationMs: 0,
            status: 'running',
          },
        }, 600);

        await emit('tool_step_update', {
          plan_step_id: 'p2',
          tool_call: {
            toolId: 'tool-rag',
            toolName: 'vector_knowledge_retriever',
            inputParams: { query: payload.prompt, top_k: 3, source: 'ASME_Section_VIII_Manual' },
            outputResult: {
              matches: 3,
              topSimilarity: 0.942,
              summary: 'Found 3 corresponding clauses regarding structural safety factors and wall thickness.',
            },
            durationMs: 460,
            status: 'success',
          },
        }, 900);
      }

      await emit('plan_update', { id: 'p2', status: 'completed' }, 400);
      await emit('plan_update', { id: 'p3', status: 'running' }, 200);

      // 6. Tool Step 2: Code Execution Sandbox
      await emit('tool_step', {
        plan_step_id: 'p3',
        tool_call: {
          toolId: 'tool-code-execution',
          toolName: 'sandbox_python_executor',
          inputParams: {
            code: 'import math\ndef calc_safety_margin(p_psi, d_in, t_in, s_psi):\n    pr = (p_psi * d_in) / (2 * s_psi * 0.85)\n    return round(t_in - pr, 4)\nprint(f"Safety Allowance: {calc_safety_margin(450, 24, 0.625, 18000)} in")',
          },
          outputResult: null,
          durationMs: 0,
          status: 'running',
        },
      }, 700);

      await emit('tool_step_update', {
        plan_step_id: 'p3',
        tool_call: {
          toolId: 'tool-code-execution',
          toolName: 'sandbox_python_executor',
          inputParams: { code: 'calc_safety_margin(450, 24, 0.625, 18000)' },
          outputResult: {
            stdout: 'Safety Allowance: 0.2721 in\n[SANDBOX] Memory: 14MB | CPU: 0.04s | Egress: 0 bytes (AIRGAP)\n',
            exit_code: 0,
          },
          durationMs: 610,
          status: 'success',
        },
      }, 1000);

      await emit('plan_update', { id: 'p3', status: 'completed' }, 300);
      await emit('plan_update', { id: 'p4', status: 'running' }, 200);

      // 7. Citation
      await emit('citation', {
        marker: 1,
        source_name: 'ASME Section VIII Pressure Vessel Guidelines',
        location: 'Page 14, Clause UG-99 (Hydrostatic Testing & Wall Allowances)',
        snippet_preview: 'Minimum design metal temperature and calculated allowable stress limits shall not exceed 18,000 psi for welded carbon steel shell components under standard operating cycles.',
        kb_source: true,
      }, 500);

      // 8. Artifact
      const artifactId = `art-deliverable-${Date.now().toString().slice(-4)}`;
      await emit('artifact', {
        id: artifactId,
        title: 'ASME_Industrial_Inspection_Audit_Report.docx',
        type: 'file',
        fileType: 'word',
        sizeBytes: 164200,
        link: `/api/files/${artifactId}`,
        previewLink: `/api/files/${artifactId}/preview`,
        citedSources: [1],
        requiresApproval: true,
      }, 600);

      // 9. Streaming message chunks
      const fullResponse = `Based on the autonomous multi-stage analysis conducted on local hardware across the full 12-vessel fleet, here are the consolidated findings:\n\n` +
        `Executive Summary\n` +
        `All 12 vessels were surveyed across wall thickness, surface integrity, corrosion trend, sensor calibration validity, and maintenance history. 9 vessels rate LOW risk, 2 rate MODERATE risk pending manual weld re-review, and 1 rates ELEVATED risk due to accelerated localized corrosion at a nozzle interface. No vessel requires immediate shutdown. This memo covers each vessel individually, followed by fleet-wide calibration, compliance, and action-item sections.\n\n` +

        `1. Vessel V-101, Primary Reactor Shell\n` +
        `Wall Thickness: Minimum measured thickness 0.3721 inches against a code-required minimum of 0.1000 inches, ASME UG-99. Corrosion allowance buffer: 0.2721 inches.\n` +
        `- Cluster A (0 to 90 degrees): avg 0.3812 in, std dev 0.0041 in\n` +
        `- Cluster B (90 to 180 degrees): avg 0.3795 in, std dev 0.0038 in\n` +
        `- Cluster C (180 to 270 degrees): avg 0.3664 in, std dev 0.0052 in, flagged for re-scan\n` +
        `- Cluster D (270 to 360 degrees): avg 0.3701 in, std dev 0.0044 in\n` +
        `- Head-to-shell transition weld: 0.3688 in, no anomalous taper\n` +
        `Corrosion Regression: rate -0.0031 in/yr, R-squared 0.94, 95% CI -0.0038 to -0.0024. Remaining safe service life: 87.7 years.\n` +
        `Visual Inspection: 214 frames processed. Micro-pitting near bolts 14 through 17, depth 0.008 to 0.014 in, cosmetic. One low-confidence, 0.42, weld-toe reflective artifact on south seam, queued for manual review.\n` +
        `Maintenance Log: WO-2291 relief valve check, on schedule, 34 days out. WO-2304 insulation repair, overdue 9 days, low priority. WO-2318 bolt torque re-check, complete, pending sign-off.\n` +
        `Sensor Calibration: Ultrasonic thickness gauge UT-07 last calibrated 41 days ago, within the 90-day window. Vision rig camera array C-3 calibrated 12 days ago.\n` +
        `Trend vs. Last 3 Reports: thickness loss consistent with prior linear model, no acceleration detected.\n` +
        `Risk Rating: LOW\n\n` +

        `2. Vessel V-102, Secondary Separator\n` +
        `Wall Thickness: Minimum 0.4103 in vs. required 0.1250 in. Buffer: 0.2853 in.\n` +
        `- Cluster A: avg 0.4211 in | Cluster B: avg 0.4189 in | Cluster C: avg 0.4095 in | Cluster D: avg 0.4177 in\n` +
        `Corrosion Regression: rate -0.0022 in/yr, R-squared 0.91. Remaining safe life: 129.7 years.\n` +
        `Visual Inspection: 178 frames, no pitting, no seam anomalies, gasket witness marks uniform.\n` +
        `Maintenance Log: no open work orders.\n` +
        `Sensor Calibration: all instruments within calibration window.\n` +
        `Risk Rating: LOW\n\n` +

        `3. Vessel V-103, Knockout Drum\n` +
        `Wall Thickness: Minimum 0.2884 in vs. required 0.1000 in. Buffer: 0.1884 in.\n` +
        `- Cluster A: avg 0.2951 in | Cluster B: avg 0.2903 in | Cluster C: avg 0.2811 in, below-average, re-scan flagged | Cluster D: avg 0.2882 in\n` +
        `Corrosion Regression: rate -0.0044 in/yr, R-squared 0.89. Remaining safe life: 42.8 years.\n` +
        `Visual Inspection: 201 frames. Two nozzle welds show minor undercut, less than 1/32 in, within acceptance criteria per AWS D1.1 but noted for trend tracking.\n` +
        `Maintenance Log: WO-2340 nozzle re-weld inspection scheduled next quarter.\n` +
        `Risk Rating: LOW\n\n` +

        `4. Vessel V-104, Amine Contactor\n` +
        `Wall Thickness: Minimum 0.2210 in vs. required 0.1400 in. Buffer: 0.0810 in, tighter than fleet average.\n` +
        `Corrosion Regression: rate -0.0058 in/yr, R-squared 0.93. Remaining safe life: 14.0 years.\n` +
        `Visual Inspection: localized pitting cluster at the amine-rich inlet nozzle, depth 0.02 to 0.035 in, consistent with known amine service corrosion mechanisms.\n` +
        `Maintenance Log: WO-2355 nozzle thickness re-verification due in 60 days.\n` +
        `Risk Rating: MODERATE, recommend accelerated re-inspection interval, 12 months instead of 24.\n\n` +

        `5. Vessel V-105, Flash Drum\n` +
        `Wall Thickness: Minimum 0.3390 in vs. required 0.1150 in. Buffer: 0.2240 in.\n` +
        `Corrosion Regression: rate -0.0019 in/yr, R-squared 0.88. Remaining safe life: 117.9 years.\n` +
        `Visual Inspection: clean across all 165 frames.\n` +
        `Risk Rating: LOW\n\n` +

        `6. Vessel V-106, Sour Water Stripper\n` +
        `Wall Thickness: Minimum 0.1972 in vs. required 0.1300 in. Buffer: 0.0672 in.\n` +
        `Corrosion Regression: rate -0.0051 in/yr, R-squared 0.90. Remaining safe life: 13.2 years.\n` +
        `Visual Inspection: weld seam near tray support ring shows a hairline indication, confidence 0.61, recommended for dye-penetrant follow-up.\n` +
        `Risk Rating: MODERATE, manual weld re-review required before next operating cycle.\n\n` +

        `7. Vessel V-107, Nozzle Interface Manifold\n` +
        `Wall Thickness: Minimum 0.1488 in vs. required 0.1200 in. Buffer: 0.0288 in, lowest margin in the fleet.\n` +
        `Corrosion Regression: rate -0.0089 in/yr, R-squared 0.95, high confidence. Remaining safe life: 3.2 years at current rate.\n` +
        `Visual Inspection: localized wall loss at the 6-inch nozzle-to-shell interface, consistent with flow-accelerated corrosion. Depth trend has increased 18% versus the prior survey.\n` +
        `Maintenance Log: no open work order currently covers this finding.\n` +
        `Risk Rating: ELEVATED, recommend immediate engineering review, interim inspection interval reduction to 6 months, and evaluation of flow-diverter or cladding remediation options.\n\n` +

        `8. Vessel V-108, Utility Separator North\n` +
        `Wall Thickness: Minimum 0.2604 in vs. required 0.1100 in. Buffer: 0.1504 in.\n` +
        `Corrosion Regression: rate -0.0021 in/yr, R-squared 0.87. Remaining safe life: 71.6 years.\n` +
        `Visual Inspection: 143 frames, no defects above threshold.\n` +
        `Maintenance Log: no open work orders.\n` +
        `Risk Rating: LOW\n\n` +

        `9. Vessel V-109, Utility Separator South\n` +
        `Wall Thickness: Minimum 0.2718 in vs. required 0.1100 in. Buffer: 0.1618 in.\n` +
        `Corrosion Regression: rate -0.0018 in/yr, R-squared 0.86. Remaining safe life: 89.9 years.\n` +
        `Visual Inspection: clean across 138 frames.\n` +
        `Risk Rating: LOW\n\n` +

        `10. Vessel V-110, Buffer Tank A\n` +
        `Wall Thickness: Minimum 0.3105 in vs. required 0.1050 in. Buffer: 0.2055 in.\n` +
        `Corrosion Regression: rate -0.0027 in/yr, R-squared 0.90. Remaining safe life: 76.1 years.\n` +
        `Visual Inspection: minor surface staining near the sump drain, non-structural, noted for housekeeping only.\n` +
        `Risk Rating: LOW\n\n` +

        `11. Vessel V-111, Buffer Tank B\n` +
        `Wall Thickness: Minimum 0.2991 in vs. required 0.1050 in. Buffer: 0.1941 in.\n` +
        `Corrosion Regression: rate -0.0024 in/yr, R-squared 0.89. Remaining safe life: 80.9 years.\n` +
        `Visual Inspection: clean, no findings.\n` +
        `Risk Rating: LOW\n\n` +

        `12. Vessel V-112, Emergency Blowdown Drum\n` +
        `Wall Thickness: Minimum 0.3387 in vs. required 0.1200 in. Buffer: 0.2187 in.\n` +
        `Corrosion Regression: rate -0.0015 in/yr, R-squared 0.85. Remaining safe life: 145.8 years.\n` +
        `Visual Inspection: clean across 121 frames; relief nozzle seating surface shows normal witness marks.\n` +
        `Maintenance Log: last relief-path function test passed, no follow-up required.\n` +
        `Risk Rating: LOW\n\n` +

        `Fleet-Wide Sensor Calibration Audit\n` +
        `All 14 ultrasonic thickness gauges, 6 vision rig camera arrays, and 3 dye-penetrant kits used across this survey cycle were cross-checked against the calibration registry. 13 of 14 gauges are within their certification window; gauge UT-11 expires in 4 days and should be recalibrated before its next scheduled use. All vision rig cameras and dye-penetrant kits are current.\n\n` +

        `Historical Trend Cross-Check\n` +
        `Comparing this cycle against the previous three inspection reports, 2023, 2024, 2025, 10 of 12 vessels show corrosion rates within plus or minus 8% of their long-run average, indicating stable degradation behavior. V-104 and V-107 show rate increases of 21% and 34% respectively versus their 3-cycle average, which drove their elevated risk classifications above.\n\n` +

        `Sovereignty & Security Compliance\n` +
        `100% of reasoning, vector retrieval, image inference, and all twelve Python sandbox regression runs occurred inside the air-gapped environment. Zero external network egress bytes logged across the full fleet analysis. Audit log hash: a3f9c1...e7d2, chained per-vessel sub-hashes available on request. No cloud API calls, no external model weights, no telemetry left the local cluster at any point in this run.\n\n` +

        `Prioritized Next-Action Checklist\n` +
        `1. V-107: escalate to engineering for immediate review of nozzle interface wall loss, highest priority.\n` +
        `2. V-106: schedule dye-penetrant follow-up on tray support ring weld indication.\n` +
        `3. V-104: shorten inspection interval to 12 months given amine-service pitting trend.\n` +
        `4. Recalibrate gauge UT-11 before next use, expires in 4 days.\n` +
        `5. Complete manual review of V-101's low-confidence weld-toe artifact during Q3 maintenance.\n` +
        `6. Close out WO-2304 insulation repair on V-101, currently overdue.\n` +
        `7. Confirm WO-2340 nozzle re-weld inspection is booked for V-103 next quarter.\n` +
        `8. File the sump-drain staining observation on V-110 with facilities for housekeeping only.\n\n` +

        `The full fleet inspection memo, including per-vessel raw survey data tables and regression plots, has been compiled and staged for review below.`;

      const words = fullResponse.split(' ');
      const chunkStartTime = Date.now();

      for (let i = 0; i < words.length; i += 4) {
        const chunk = words.slice(i, i + 4).join(' ') + ' ';
        await emit('message_chunk', { content: chunk }, 90);
      }

      await emit('plan_update', { id: 'p4', status: 'completed' }, 200);

      // Derive real metadata instead of hardcoding stale numbers
      const actualDurationMs = Date.now() - chunkStartTime;
      const estimatedTokens = Math.round(fullResponse.length / 4); // ~4 chars/token heuristic
      const actualTokensPerSec = +(estimatedTokens / (actualDurationMs / 1000)).toFixed(1);

      // 10. Final turn resolution
      await emit('final', {
        message_id: `msg-final-${Date.now()}`,
        content: fullResponse,
        citations: [1],
        artifact_ids: [artifactId],
        tokens_used: estimatedTokens,
        tokens_per_sec: actualTokensPerSec,
        total_duration_ms: actualDurationMs,
      }, 300);
    })();
  }
}

export const mockSimulator = new MockAgentSimulator();
export default mockSimulator;