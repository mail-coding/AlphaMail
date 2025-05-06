import express from 'express';
import { getMcpAgent } from '../services/mcpAgent.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Missing 'content' in request body." });
  }

  try {

    const startTime = Date.now(); // ✅ 시작 시간 기록
    const agent = await getMcpAgent();
    const response = await agent.invoke({
      messages: [{ role: "user", content }]
    });

    const endTime = Date.now(); // ✅ 끝 시간 기록
    const duration = endTime - startTime; // ✅ 경과 시간 계산

    console.log(`⏱️ MCP Agent 응답 시간: ${duration}ms`);

    const messages = response?.messages || [];
    console.log(messages)

    messages.forEach((msg, i) => {
      console.log(`Message ${i}: ${msg?.id}`);
      console.log('Tool calls:', msg?.tool_calls);
    });

     // 원하는 tool_calls만 추출 - 수정된 부분
     const toolCalls = messages
     .filter(msg => Array.isArray(msg?.tool_calls) && msg.tool_calls.length > 0)
     .flatMap(msg => msg.tool_calls);
   
   console.log("************************888");
   console.dir(toolCalls, { depth: null });
   
   res.json({ tool_calls: toolCalls });
   
 } catch (err) {
   console.error("MCP Agent invoke error:", err);
   res.status(500).json({ error: "Failed to process email." });
 }
});

export default router;
