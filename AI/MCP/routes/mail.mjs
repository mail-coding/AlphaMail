import express from 'express';
import { getMcpAgent } from '../services/mcpAgent.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Missing 'content' in request body." });
  }

  try {

    const startTime = Date.now(); 
    const agent = await getMcpAgent();
    const response = await agent.invoke({
      messages: [{ role: "user", content }]
    });

    const endTime = Date.now();
    const duration = endTime - startTime; 

    console.log(`MCP Agent 응답 시간: ${duration}ms`);

    const messages = response?.messages || [];

     // 원하는 tool_calls만 추출
     const toolCalls = messages
     .filter(msg => Array.isArray(msg?.tool_calls) && msg.tool_calls.length > 0)
     .flatMap(msg => msg.tool_calls);

   console.dir(toolCalls, { depth: null });
   
   res.json({ tool_calls: toolCalls });
   
 } catch (err) {
   console.error("MCP Agent invoke error:", err);
   res.status(500).json({ error: "Failed to process email." });
 }
});

export default router;
