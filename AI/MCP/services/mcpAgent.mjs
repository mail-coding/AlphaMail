import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { loadMcpTools } from "@langchain/mcp-adapters";

const toolSystemMessages = {
    orderRequest: `
  당신은 이메일을 분석하여 발주 정보를 추출하는 AI입니다. 다음 형식으로 정확히 추출하세요:
  
  company: 이메일에서 언급된 회사명
  contactName: 담당자 이름
  contactEmail: 담당자 이메일
  paymentTerms: 결제 조건
  deliveryAddress: 배송지 주소
  deliveryDate: 배송 날짜
  items: 주문 항목 배열
  
  ※ 주의: items 필드는 다음과 같이 작성하세요:
  [
    {
      "name": "27인치 FHD IPS 모니터 (모델명: BDM-270F)",
      "quantity": 100
    }
  ]
  
  quantity는 반드시 문자열이 아닌 숫자로 작성해야 합니다.
  items는 문자열이 아닌 실제 배열 형태여야 합니다.
  
  이메일에 일정 및 날짜 관련 정보가 있다면 이를 함께 모두 추출하세요.
  `.trim(),
  
    estimateRequest: `
  당신은 이메일을 분석하여 견적 요청 정보를 추출하는 AI입니다. 다음 형식으로 정확히 추출하세요:
  
  company: 이메일에서 언급된 회사명
  deliveryAddress: 배송지 주소
  items: 주문 항목 배열
  
  ※ 주의: items 필드는 다음과 같이 작성하세요:
  [
    {
      "name": "27인치 FHD IPS 모니터 (모델명: BDM-270F)",
      "quantity": 100
    }
  ]
  
  quantity는 반드시 문자열이 아닌 숫자로 작성해야 합니다.
  items는 문자열이 아닌 실제 배열 형태여야 합니다.
  
  이메일에 일정 관련 정보가 있다면 이를 함께 추출하세요.
  `.trim(),
  
  
  date: `
  메일을 분석하여 다음 항목을 정확히 추출하여 JSON으로 응답하십시오.
  이메일 내용에 회의, 미팅(meeting), 일정(schedule), 이벤트(event), 예약(appointment), 예정(planned), 시간 안내(time slot), 캘린더(calendar) 등과 관련된 표현이 있다면 반드시 아래 형식에 따라 추출하십시오.
  연도나 월이 없을 경우 현재 시점을 기준으로 추출하세요.
  - title: 일정 제목
  - start: ISO8601 일정 시작 날짜 ("2025-04-30T14:00:00")
  - end: ISO8601 일정 종료 날짜
  - description: 일정에 대한 기타 사항
  
  날짜는 반드시 ISO8601 형식으로 보내십시오.
  일정 관련 정보가 있다면 이를 추출하세요.
  이메일에서 명시적인 종료 시간이 없는 경우, 시작 시간에서 1시간 후로 설정하십시오.
  `.trim(),
  };


  const transport = new SSEClientTransport(new URL("http://localhost:8080/sse"));
  const client = new Client({ name: "math-client", version: "1.0.0" });
  
  let agent = null;
  
  export async function getMcpAgent() {
    if (agent) return agent;
  
    await client.connect(transport);
    const tools = await loadMcpTools("math", client, {
      throwOnLoadError: true,
      prefixToolNameWithServerName: false,
      additionalToolNamePrefix: "",
    });
  
    const allowedToolNames = tools.map((tool) => tool.name);
  const finalSystemMessage = `
 메일 내용을 읽고 발주 요청, 견적 요청, 일정 세개 중 속하는게 있는지, 몇개로 분류 될수 있는지 확인해
 그리고 확인 되는 것들의 모든 tool을 실행시켜


도구 사용 판단 기준:

1. 일정 정보가 있다면 → "date" 도구 호출
2. 발주 요청이 포함되어 있다면 → "orderRequest" 도구 호출
3. 견적 요청이 포함되어 있다면 → "estimateRequest" 도구 호출


예시 판단 기준:

- 날짜/요일(예: 5월 6일, 다음 주 화요일), 시간(예: 오전 10시, 오후 2시)과 행동성 단어(회의, 방문, 상담, 미팅 등)가 함께 있는 경우 → 반드시 "date" 도구 호출
- "견적서 부탁드립니다", "견적 요청드립니다" 문장이 있으면 → "estimateRequest" 도구 호출
- 품목명 + 수량 + 납기일 + 결제 조건 등이 포함되면 → "orderRequest" 도구 호출


예시 상황:
이메일 내용:
> 5월 6일 오전 10시에 회의가 예정되어 있습니다.  
> 아래 품목을 발주합니다: 프린터 2대, 토너 10개.  
> 견적서도 부탁드립니다.

도구 호출 : "orderRequest","date","estimateRequest"

도구 호출은 필요한 만큼 여러 번 반복해도 되며, 반드시 각각의 정보를 분리하여 정확하게 추출하고, 해당 도구의 입력 형식에 맞게 호출하세요.
  
  도구별 세부 지침
  ${allowedToolNames.map((tool) => `### ${tool}\n${toolSystemMessages[tool] || ""}`).join("\n\n")}
  `.trim();
  

  agent = createReactAgent({
    llm: new ChatOpenAI({
      apiKey: "lm-studio",
      model: "mathstral-7b-v0.1",
      configuration: { baseURL: "http://localhost:1234/v1" },
      modelKwargs: {
        systemMessage: finalSystemMessage 
      }
    }),
    tools,
    systemMessage: finalSystemMessage,      
    allowedTools: allowedToolNames,
  });

  console.log("✅ MCP Agent initialized.");
  return agent;
}
