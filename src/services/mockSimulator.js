// **
//  * AegisAI Sovereign Agent Simulation Engine
//  * 
//  * NOTE: This file provides an isolated, spec-compliant simulation fallback for 
//  * offline demonstrations or frontend testing when the FastAPI backend is not running.
//  * It strictly adheres to the universal envelope schema and event types.
//  */

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
      const artifactId = `Multi-stage analysis conducted on local hardware-${Date.now().toString().slice(-4)}`;
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



 const fullResponse = `Based on the autonomous multi-stage analysis conducted on local hardware across the full 5-vessel fleet, here are the consolidated findings:\n\n` +

  `Executive Summary\n` +
  `The fleet is in stable overall condition. Of the 5 vessels inspected, four are rated LOW risk and one — V-104 — is rated MODERATE risk requiring targeted follow-up. No vessel requires immediate shutdown, but V-104 warrants closer monitoring given its corrosion trend. The findings below cover each vessel individually, followed by fleet-wide calibration status and a prioritized action list.\n\n` +

  `1. Vessel V-101, Primary Reactor Shell\n` +
  `V-101 is in good condition. Wall thickness across all measurement clusters sits comfortably above the code minimum, and the corrosion rate has remained consistent with prior surveys — no acceleration has been detected. Minor micro-pitting near a bolt cluster was observed during visual inspection but is cosmetic in nature and does not affect structural integrity. One low-confidence weld artifact on the south seam has been queued for manual review during Q3 maintenance, which is standard practice for reflective anomalies of this type.\n\n` +
  `On the maintenance side, an insulation repair work order is overdue by about a week but carries low priority. A bolt torque re-check has been completed and is waiting on sign-off. The next scheduled relief valve check is on track.\n` +
  `Risk Rating: LOW\n\n` +

  `2. Vessel V-102, Secondary Separator\n` +
  `One of the cleanest vessels in the fleet. Thickness readings are uniform across all quadrants, the corrosion rate is among the lowest recorded, and visual inspection across all frames returned no anomalies. Gasket witness marks are uniform and no open work orders are outstanding. Nothing to flag here.\n` +
  `Risk Rating: LOW\n\n` +

  `3. Vessel V-103, Knockout Drum\n` +
  `V-103 is in good shape overall, though one measurement quadrant came in slightly below the cluster average and was flagged for a re-scan as a precaution. Visual inspection identified minor undercut at two nozzle welds, both within acceptance criteria. These are not structural concerns at present but have been noted for trend tracking. A nozzle re-weld inspection is already scheduled for next quarter, which appropriately covers this finding.\n` +
  `Risk Rating: LOW\n\n` +

  `4. Vessel V-104, Amine Contactor\n` +
  `V-104 warrants closer attention. The corrosion buffer is tighter than the fleet average, and the corrosion rate has increased noticeably compared to its three-cycle historical average — a pattern consistent with known amine service degradation mechanisms. Visual inspection confirmed localized pitting at the amine-rich inlet nozzle, with pit depths in a range that is not immediately alarming but is trending in the wrong direction. A nozzle thickness re-verification is due within the next two months and should be treated as a firm deadline rather than a soft target. The inspection interval for this vessel should be shortened going forward.\n` +
  `Risk Rating: MODERATE — inspection interval reduced to 12 months.\n\n` +

  `5. Vessel V-105, Flash Drum\n` +
  `V-105 is performing well. Thickness is solid, the corrosion rate is slow, and visual inspection across all frames was clean. No maintenance items are outstanding and no follow-up is required at this time.\n` +
  `Risk Rating: LOW\n\n` +

  `Fleet-Wide Calibration & Trend Notes\n` +
  `All but one of the ultrasonic thickness gauges used across this cycle are within their certification window. The exception is gauge UT-11, which expires in four days and must be recalibrated before its next deployment. All vision rig cameras and dye-penetrant kits are current.\n\n` +
  `Four of the five vessels are behaving consistently with their long-run corrosion averages — a sign of stable fleet health. V-104 is the one outlier, showing a rate increase significant enough to drive its MODERATE classification and warrants the closest attention going into the next cycle. All analysis was conducted entirely on-premises, with no data leaving the local environment at any point.\n\n` +

  `Prioritized Actions\n` +
  `The most pressing item is V-104 — the inspection interval should be formally shortened to 12 months in the maintenance system and the nozzle thickness re-verification treated as a hard deadline. Gauge UT-11 recalibration needs to happen within the next four days before its next use. The remaining items — manual weld review on V-101, closing the overdue insulation work order, and confirming the V-103 nozzle inspection booking for next quarter — are lower priority but should be cleared within the current quarter.`;
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