import os
import requests
from dotenv import load_dotenv
import json
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder

load_dotenv()
PROJECT_ENDPOINT = os.getenv("AZURE_PROJECT_ENDPOINT")

project = AIProjectClient(
    credential=DefaultAzureCredential(),
    endpoint=PROJECT_ENDPOINT)

agent = project.agents.get_agent("asst_SswGWFLPgQ4LPqQciiMlvG16")

thread = project.agents.threads.create()

def call_llm(message: str, context: dict | None = None) -> str:
    user_msg = (message or "").strip()

    context_txt = ""
    if context:
        context_txt = "Context of dashboard (JSON): \n" + json.dumps(context, ensure_ascii=False)

    content = user_msg if not context_txt else f"{context_txt}\n\n User question: {user_msg}"

    project.agents.messages.create(
        thread_id=thread.id,
        role="user",
        content=content
    )

    run = project.agents.runs.create_and_process(
        thread_id=thread.id,
        agent_id=agent.id
    )

    if run.status == "failed":
        raise RuntimeError(f"Run failed: {run.last_error}")

    msgs = project.agents.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)

    last_text = ""
    for m in msgs:
        if m.role == "assistant" and m.text_messages:
            last_text = m.text_messages[-1].text.value

    return last_text.strip() if last_text else "Heimdall não retornou texto."