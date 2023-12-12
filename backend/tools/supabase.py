import os
import time
from dotenv import load_dotenv
load_dotenv()  # This will load all environment variables from .env

from supabase import create_client, Client

SUPABSE_URL: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABSE_KEY: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABSE_URL, SUPABSE_KEY)

def add_message(message, max_retries=3, delay=1):
    attempt = 0
    while attempt < max_retries:
        try:
            response = supabase.table('messages').insert({
                "from": message.get('from', ''), 
                'to': message.get('to', ''), 
                "type": message.get('type', ''),
                "session": message.get('session', ''),
                'content': message.get('content', ''),
            }).execute()
            print('response', response)
            data = response.data if hasattr(response, "data") else None
            error = response.error if hasattr(response, "error") else None

            if error:  # Assuming a successful insert will have a count > 0
                raise ValueError(f"Failed to insert message: {error}")

            if not data:
                raise ValueError("No rows inserted; potential write failure.")

            return data

        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            time.sleep(delay)
            attempt += 1  # Increment and try again after a short delay

    # If the loop completes without returning, all retries have failed
    raise Exception("All attempts to add message have failed.")

def upsert_flow(token, flow, max_retries=3, delay=1):
    attempt = 0
    data = supabase.auth.get_user(token)
    if not data:
      raise Exception("User not authenticated")
    user = data.user
    while attempt < max_retries:
        try:
            flow_id = flow.get('id', None)
            if not flow_id: # New flow does not contain id
              flow['user_id'] = user.id
              response = supabase.table('flows').insert(flow).execute()
              if len(response.data) == 0:
                  raise ValueError("No rows inserted; potential write failure.")
              return response.data[0]
            else: # Try to update existing record
              response = supabase.table('flows').select('id').eq('id', flow_id).eq('user_id', user.id).execute()
              if len(response.data) > 0:
                response = supabase.table('flows').update(flow).eq('id', flow_id).execute()
                records = response.data if hasattr(response, "data") and response.data is not None else []
                error = response.error if hasattr(response, "error") else None

                if error:  # Assuming a successful insert will have a count > 0
                    raise ValueError(f"Failed to insert flow: {error}")
                return records[0]
              else:
                raise Exception(f"Flow not found ${flow_id} for user ${user.id}")

        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            time.sleep(delay)
            attempt += 1  # Increment and try again after a short delay

    # If the loop completes without returning, all retries have failed
    raise Exception("All attempts to add flow have failed.")

def get_flows(token, max_retries=3, delay=1):
  attempt = 0
  data = supabase.auth.get_user(token)
  if not data:
    raise Exception("User not authenticated")
  user = data.user
  while attempt < max_retries:
    try:
        records = supabase.table('flows').select('*').eq('user_id', user.id).execute()
        return records.data if hasattr(records, "data") else []
    except Exception as e:
        print(f"Failed to get flows: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to get flows have failed.")

def get_templates(max_retries=3, delay=1):
  attempt = 0
  while attempt < max_retries:
    try:
        records = supabase.table('templates').select('*').neq('id', 0).execute()
        print('get_public_templates', len(records.data))
        return records.data
    except Exception as e:
        print(f"Failed to get public templates: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to get public templates have failed.")

def publish_template(token, template, max_retries=3, delay=1):
  attempt = 0
  data = supabase.auth.get_user(token)
  if not data:
    raise Exception("User not authenticated")
  user = data.user
  while attempt < max_retries:
    try:
        template.pop('id', None)  # Removes 'id' without error if it's not present
        template['user_id'] = user.id
        records = supabase.table('templates').insert(template).execute()
        print('published template', len(records.data))
        return records.data
    except Exception as e:
        print(f"Failed to publish template: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to publish template have failed.")


def unpublish_template(token, id, max_retries=3, delay=1):
  attempt = 0
  data = supabase.auth.get_user(token)
  if not data:
    raise Exception("User not authenticated")
  user = data.user
  while attempt < max_retries:
    try:
        records = supabase.table('templates').delete().eq('id', id).eq('user_id', user.id).execute()
        print('unpublished flow', len(records.data))
        return records.data
    except Exception as e:
        print(f"Failed to unpublish flow: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to publish flow have failed.")

def get_flow(token, id, max_retries=3, delay=1):
  attempt = 0
  while attempt < max_retries:
    try:
        records = supabase.table('flows').select('*').eq('id', id).execute()
        if len(records.data) > 0:
          print('get_flow', len(records.data))
          return records.data[0]
        else:
          return None
    except Exception as e:
        print(f"Failed to get flow: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to get flow have failed.")

def delete_flow(id, max_retries=3, delay=1):
  attempt = 0
  while attempt < max_retries:
    try:
        records = supabase.table('flows').delete().eq('id', id).execute()
        print('delete_flow', records.data)
        return records.data

    except Exception as e:
        print(f"Failed to delete flows: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to delete flow have failed.")

def upsert_chat(token, chat, max_retries=3, delay=1):
    attempt = 0
    data = supabase.auth.get_user(token)
    if not data:
      raise Exception("User not authenticated")
    user = data.user
    while attempt < max_retries:
        try:
            chat_id = chat.get('id', None)
            if not chat_id: # New chat does not contain id
              chat['user_id'] = user.id
              response = supabase.table('chats').insert(chat).execute()
              if len(response.data) == 0:
                  raise ValueError("No rows inserted; potential write failure.")
              return response.data[0]
            else: # Try to update existing record
              response = supabase.table('chats').select('id').eq('id', chat_id).eq('user_id', user.id).execute()
              if len(response.data) > 0:
                response = supabase.table('chats').update(chat).eq('id', chat_id).execute()
                records = response.data if hasattr(response, "data") and response.data is not None else []
                error = response.error if hasattr(response, "error") else None

                if error:  # Assuming a successful insert will have a count > 0
                    raise ValueError(f"Failed to insert chat: {error}")
                return records[0]
              else:
                raise Exception(f"Chat not found ${chat_id} for user ${user.id}")

        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            time.sleep(delay)
            attempt += 1  # Increment and try again after a short delay

    # If the loop completes without returning, all retries have failed
    raise Exception("All attempts to add chat have failed.")

def get_chats(token, source_type=None, max_retries=3, delay=1):
  attempt = 0
  data = supabase.auth.get_user(token)
  if not data:
    raise Exception("User not authenticated")
  user = data.user
  while attempt < max_retries:
    try:
        records = supabase.table('chats').select('*').eq('user_id', user.id).execute()
        print('get_chats', len(records.data))
        return records.data
    except Exception as e:
        print(f"Failed to get chats: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to get chats have failed.")