import anthropic
import google.generativeai as genai
import json
import os
from django.conf import settings

class ClaudeMCPService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)
        self.model = "claude-3-5-sonnet-20240620"

    def process_natural_language_task(self, text):
        prompt = f"""
        You are an AI Task Assistant. Convert the following user request into a structured JSON task object.
        User Request: "{text}"
        
        The JSON should have these fields:
        - title: String (Short, clear title)
        - description: String (Any extra details)
        - priority: String (One of: LOW, MEDIUM, HIGH)
        - status: String (Must be 'PENDING')
        - scheduled_at: String (YYYY-MM-DD format if date is mentioned, otherwise null)
        
        Return ONLY the JSON object.
        """
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            content = message.content[0].text
            return self._extract_json(content, text)
        except Exception as e:
            print(f"Error in Claude service: {e}")
            return {"title": text, "status": "PENDING", "priority": "MEDIUM"}

    def summarize_tasks(self, tasks_data):
        task_list = "\n".join([f"- {t['title']} ({t['status']})" for t in tasks_data])
        prompt = f"Summarize the following task list in 2-3 concise sentences and suggest the next urgent action:\n\n{task_list}"
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except Exception as e:
            return f"Error summarizing with Claude: {e}"

    def _extract_json(self, content, fallback_title):
        try:
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start != -1:
                return json.loads(content[json_start:json_end])
        except:
            pass
        return {"title": fallback_title, "status": "PENDING", "priority": "MEDIUM"}


class GeminiMCPService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    def process_natural_language_task(self, text):
        prompt = f"""
        Convert this request into a JSON task object: "{text}"
        Fields: 
        - title: String
        - description: String
        - priority: String (LOW/MEDIUM/HIGH)
        - status: String (Must be 'PENDING')
        - scheduled_at: String (YYYY-MM-DD format if date mentioned, otherwise null)
        Return ONLY JSON.
        """
        try:
            response = self.model.generate_content(prompt)
            return self._extract_json(response.text, text)
        except Exception as e:
            print(f"Error in Gemini service: {e}")
            return {"title": text, "status": "PENDING", "priority": "MEDIUM"}

    def summarize_tasks(self, tasks_data):
        task_list = "\n".join([f"- {t['title']} ({t['status']})" for t in tasks_data])
        prompt = f"Summarize these tasks in 2-3 sentences: \n{task_list}"
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error summarizing with Gemini: {e}"

    def _extract_json(self, content, fallback_title):
        try:
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start != -1:
                return json.loads(content[json_start:json_end])
        except:
            pass
        return {"title": fallback_title, "status": "PENDING", "priority": "MEDIUM"}


def get_ai_service():
    """Factory to get the configured AI service"""
    provider = getattr(settings, 'AI_PROVIDER', 'CLAUDE').upper()
    if provider == 'GEMINI':
        return GeminiMCPService()
    return ClaudeMCPService()
