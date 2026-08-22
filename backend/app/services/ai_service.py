import os
from openai import AsyncOpenAI
import json
from app.services import audit_service

def get_llm_client():
    api_key = os.getenv("LLM_API_KEY")
    if not api_key:
        return None
    # We allow base_url to be configured in case they use Gemini through OpenAI compatibility or another provider
    base_url = os.getenv("LLM_BASE_URL") 
    return AsyncOpenAI(api_key=api_key, base_url=base_url)

def get_llm_model():
    return os.getenv("LLM_MODEL", "gpt-4o") # default or use what's in env

async def explain_transaction(transaction: dict) -> dict:
    client = get_llm_client()
    if not client:
        raise ValueError("AI Employee is unavailable because the AI service is not configured.")

    model = get_llm_model()

    system_prompt = """You are an AI Employee assisting a human reviewer in a fraud and exception resolution workbench.
Your job is to explain why a transaction might have been flagged.
You MUST distinguish between FACTS (information directly available), AI ANALYSIS (your interpretation), and RECOMMENDATION (what to investigate).
Do NOT claim something is definitely fraud unless the provided data strongly supports it.
If information is missing, say that it is unavailable.
You must NOT resolve, approve, or reject the transaction. Your role is READ-ONLY.

Respond with a JSON object in this exact format:
{
  "explanation": "Brief explanation of why this was flagged based on the data",
  "risk_factors": ["List of 2-4 risk factors", "e.g., High transaction amount", "e.g., Unusual location"],
  "summary": "One sentence summary of the risk",
  "confidence": 94,
  "recommendation": "What the reviewer should investigate before resolving"
}
Ensure the confidence is an integer between 0 and 100 based on how unusual the transaction appears.
IMPORTANT: Return ONLY the raw JSON object. Do not wrap the JSON in markdown formatting or ```json blocks.
"""

    user_prompt = f"""Please explain this transaction:
{json.dumps(transaction, default=str, indent=2)}
"""

    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        content = response.choices[0].message.content
        result = json.loads(content)
        
        # Create audit log
        await audit_service.create_audit_log(
            event_type="AI_ANALYSIS",
            description="AI analyzed transaction",
            actor="AI Employee",
            transaction_id=transaction.get("transaction_id"),
            confidence=result.get("confidence")
        )
        
        return result
    except Exception as e:
        raise RuntimeError(f"LLM Error: {str(e)}")


async def chat_about_transaction(transaction: dict, message: str) -> str:
    client = get_llm_client()
    if not client:
        raise ValueError("AI Employee is unavailable because the AI service is not configured.")

    model = get_llm_model()

    system_prompt = f"""You are an AI Employee assisting a human reviewer in a fraud and exception resolution workbench.
You are currently discussing this specific transaction context:
{json.dumps(transaction, default=str, indent=2)}

Guidelines:
- Be highly conversational, extremely natural, and concise. Talk like a friendly human colleague.
- Use simple, plain English. Do NOT use overly formal or robotic language.
- NEVER use markdown formatting like asterisks (* or **) for bolding, hashtags (#) for headings, or backticks for code. The chat UI does not support markdown, so you must use pure plain text only.
- Do NOT use structured headings (e.g., "Assessment", "Bottom line"), or heavy bullet points. If you need a list, just use simple dashes (-).
- ONLY answer the user's specific question. Do NOT provide unprompted analysis or summaries of the transaction unless explicitly asked.
- If the user just says "hello" or greets you, simply greet them back and ask how you can help. Do NOT summarize the transaction.
- Stick strictly to the provided transaction context.
- Do NOT claim something is definitely fraud unless strongly supported by the data.
- If information is missing, state that it is unavailable.
- You must NOT resolve, approve, or reject the transaction. You cannot change its status.
- You are READ-ONLY and only provide advice and analysis.
"""

    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"LLM Error: {str(e)}")

async def suggest_resolution(transaction: dict) -> dict:
    client = get_llm_client()
    if not client:
        raise ValueError("AI Employee is unavailable because the AI service is not configured.")

    model = get_llm_model()

    system_prompt = """You are an AI Employee assisting a human reviewer in a fraud and exception resolution workbench.
Your job is to recommend the safest resolution action based ONLY on the provided transaction data.
Consider risk_level, confidence, amount vs average_transaction_amount, location, device, and flag_reasons.
Do NOT invent missing information.
This is a recommendation only.

Allowed actions ONLY:
- APPROVE
- BLOCK
- REQUEST_VERIFICATION
- ESCALATE

Respond with a JSON object in this exact format:
{
  "recommended_action": "BLOCK",
  "reason": "Detailed explanation of why this action is recommended based on the indicators.",
  "confidence": 94,
  "risk_factors": [
    "Unusual location",
    "New device"
  ]
}
Ensure the confidence is an integer between 0 and 100 based on how confident you are in the recommendation.
IMPORTANT: Return ONLY the raw JSON object. Do not wrap the JSON in markdown formatting or ```json blocks.
"""

    user_prompt = f"""Please analyze this transaction and recommend a resolution:
{json.dumps(transaction, default=str, indent=2)}
"""

    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        content = response.choices[0].message.content
        result = json.loads(content)
        
        # Create audit log
        await audit_service.create_audit_log(
            event_type="AI_RECOMMENDATION",
            description=f"AI recommended {result.get('recommended_action')}",
            actor="AI Employee",
            transaction_id=transaction.get("transaction_id"),
            confidence=result.get("confidence")
        )
        
        return result
    except Exception as e:
        raise RuntimeError(f"LLM Error: {str(e)}")
