import ast
import json
import os
import re
import textwrap
from datetime import datetime
import hashlib
from pathlib import Path
import autogen

from jinja2 import Environment, FileSystemLoader, select_autoescape
from jinja2.ext import do
from openai import APIStatusError, OpenAI
from termcolor import colored

from ..models import Project, Tool
from .supabase import SupabaseClient, create_supabase_client


class CodegenService:
    def __init__(self, supabase: SupabaseClient):
        self.env = Environment(
            loader=FileSystemLoader(
                searchpath=os.path.join(os.getcwd(), "agentok_api/", "templates")
            ),
            autoescape=select_autoescape(),
            extensions=[do],
        )
        self.supabase = supabase  # Keep an instance of SupabaseClient
        self.cache_dir = Path(os.getcwd()) / ".cache" / "codegen"
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _get_cache_key(self, project: Project) -> str:
        """Generate a unique cache key for the project."""
        project_data = {
            "id": project.id,
            "flow": project.flow.dict(),
            "updated_at": project.updated_at,
        }
        return hashlib.sha256(json.dumps(project_data, sort_keys=True).encode()).hexdigest()

    def _get_cached_code(self, cache_key: str) -> str | None:
        """Get cached code if it exists."""
        cache_file = self.cache_dir / f"{cache_key}.py"
        if cache_file.exists():
            return cache_file.read_text()
        return None

    def _cache_code(self, cache_key: str, code: str):
        """Cache the generated code."""
        cache_file = self.cache_dir / f"{cache_key}.py"
        cache_file.write_text(code)

    def generate_project(self, project: Project) -> str:
        # Initialize config_list
        config_list = []

        # Extend config_list with settings['models'] if available
        user_settings = self.supabase.fetch_general_settings()
        if user_settings and "general" in user_settings and 'models' in user_settings["general"]:
            config_list.extend([model for model in user_settings["general"]["models"] if model["enabled"] == True])

        # Apply filters if any
        # if user_settings and 'filters' in user_settings:
        #     config_list = autogen.filter_config(
        #         config_list,
        #         filter_dict={
        #             "model": user_settings['filters'].get('name', '').split(','),
        #             "tags": user_settings['filters'].get('tags', '').split(','),
        #         }
        #     )

        # Check cache first
        cache_key = self._get_cache_key(project)
        cached_code = self._get_cached_code(cache_key)
        if cached_code:
            return cached_code

        flow = project.flow
        initializer_node = next(
            (node for node in flow.nodes if node["type"] == "initializer"), None
        )
        if not initializer_node:
            raise Exception(
                "No initializer node found. This should be the first node in the flow."
            )

        # Find the first converser node, which is the only one downstream of the initializer
        first_converser = next(
            (
                node
                for node in flow.nodes
                if any(
                    edge["source"] == initializer_node["id"]
                    and edge["target"] == node["id"]
                    for edge in flow.edges
                )
            ),
            None,
        )

        if not first_converser:
            raise Exception(
                "No converser node found. This should be the second node in the flow."
            )

        if first_converser["type"] not in {"conversable", "user", "assistant"}:
            raise Exception(
                "The first converser node should be the conversable, user, or assistant node."
            )

        conversable_nodes = [
            node for node in flow.nodes if node["type"] == "conversable"
        ]
        ASSISTANT_NODE_TYPES = ["assistant", "captain", "websurfer", "deepseek"]
        assistant_nodes = [node for node in flow.nodes if node["type"] in ASSISTANT_NODE_TYPES]
        print("assistant_nodes", assistant_nodes)
        gpt_assistant_nodes = [
            node for node in flow.nodes if node["type"] == "gpt_assistant"
        ]
        user_nodes = [node for node in flow.nodes if node["type"] == "user"]

        initial_chat_targets = [
            {
                "node": node,
                "chat_options": next(
                    (
                        edge.get("data")
                        for edge in flow.edges
                        if edge["source"] == first_converser["id"]
                        and edge["target"] == node["id"]
                    ),
                    None,
                ),
            }
            for node in flow.nodes
            if any(
                edge["source"] == first_converser["id"] and edge["target"] == node["id"]
                for edge in flow.edges
            )
        ]

        # Handle group chat nodes
        group_nodes = []
        for node in flow.nodes:
            if node["type"] == "groupchat":
                group_nodes.append(
                    {
                        "group_node": node,
                        "children": [
                            n for n in flow.nodes if n.get("parentId") == node["id"]
                        ],
                        "preceding_node": next(
                            (
                                n for n in flow.nodes
                                if any(e["source"] == n["id"] and e["target"] == node["id"] 
                                      for e in flow.edges)
                            ),
                            None,
                        ),
                    }
                )

        # Prepare nested chats data
        nested_chats = self.prepare_nested_chats(flow)

        note_nodes = [node for node in flow.nodes if node["type"] == "note"]

        settings = self.supabase.fetch_general_settings()
        for model in settings.get("models", []):
            if "id" in model:
                del model["id"]
            if "description" in model:
                del model["description"]
        # Use the template for each node
        template = self.env.get_template("main.j2")  # Main template

        # Generate tool assignments
        tool_dict = self.build_tool_dict(project)
        print(tool_dict)
        tool_assignments = self.generate_tool_assignments(flow.edges, tool_dict, flow.nodes)
        print(tool_assignments)
        tool_dict = {
            tool_id: tool
            for tool_id, tool in tool_dict.items()
            if tool_id in tool_assignments
        }
        print(tool_dict)
        
        # Generate tool envs and replace placeholders
        self.generate_tool_envs(project, tool_dict)
        
        # Replace env placeholders in tool code
        for tool_id, tool in tool_dict.items():
            tool['code'] = self.replace_env_placeholders(tool)

        # Render the template with the prepared config_list
        code = template.render(
            project=project,
            config_list=config_list,
            user=self.supabase.get_user(),
            settings=settings,  # Account level settings include models, etc.
            nodes=flow.nodes,
            initializer_node=initializer_node,
            first_converser=first_converser,
            initial_chat_targets=initial_chat_targets,
            conversable_nodes=conversable_nodes,
            assistant_nodes=assistant_nodes,
            gpt_assistant_nodes=gpt_assistant_nodes,
            user_nodes=user_nodes,
            group_nodes=group_nodes,
            nested_chats=nested_chats,
            generation_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            note_nodes=note_nodes,
            tool_dict=tool_dict,
            tool_assignments=tool_assignments,
        )

        # Cache the generated code
        self._cache_code(cache_key, code)

        return code

    def prepare_nested_chats(self, flow):
        nested_chats = []
        for node in flow.nodes:
            if node["type"] == "nestedchat":
                sender_nodes = [
                    n
                    for n in flow.nodes
                    if any(
                        edge["source"] == n["id"] and edge["target"] == node["id"]
                        for edge in flow.edges
                    )
                ]

                # Check if there is exactly one upstream node
                if len(sender_nodes) != 1:
                    raise Exception(
                        f'Nested chat node {node["id"]} must have exactly one upstream node, found {len(sender_nodes)}.'
                    )

                sender_node = sender_nodes[0]

                if not sender_node:
                    raise Exception(
                        f'Nested chat node {node["id"]} must have exactly one upstream sender node.'
                    )

                recipient_nodes_with_options = [
                    {
                        "node": recipient_node,
                        "chat_options": next(
                            (
                                edge["data"]
                                for edge in flow.edges
                                if edge["source"] == node["id"]
                                and edge["target"] == recipient_node["id"]
                            ),
                            {},
                        ),
                    }
                    for recipient_node in flow.nodes
                    if any(
                        edge["source"] == node["id"]
                        and edge["target"] == recipient_node["id"]
                        for edge in flow.edges
                    )
                ]

                nested_chats.append(
                    {
                        "nested_chat_node": node,
                        "sender": sender_node,
                        "recipients": recipient_nodes_with_options,
                    }
                )

        return nested_chats

    def build_tool_dict(self, project: Project):
        tool_ids = []
        for edge in project.flow.edges:
            if "data" in edge and "tools" in edge["data"]:
                tool_ids.extend(edge["data"]["tools"])

        tools = self.supabase.fetch_tools(tool_ids)
        tool_dict = {}
        
        for tool in tools:
            # Extract metadata from the tool's code
            try:
                meta_info = self.extract_tool_meta(tool["code"])
                # Merge the meta_info with the tool data
                tool["func_name"] = meta_info["func_name"]
                tool["description"] = meta_info["description"]
                tool["signatures"] = meta_info["signatures"]
                tool["variables"] = meta_info["variables"]
                tool_dict[tool["id"]] = tool
            except Exception as e:
                print(f"Warning: Failed to extract metadata for tool {tool['id']}: {str(e)}")
                # Still include the tool even if metadata extraction fails
                tool_dict[tool["id"]] = tool
        
        return tool_dict

    def generate_tool_assignments(self, edges, tool_dict, nodes):
        tool_assignments = {}

        # Process regular tool assignments from edges
        for edge in edges:
            if edge.get("data") is not None and edge["data"].get("tools") is not None:
                for tool_id in edge["data"]["tools"]:
                    if tool_id in tool_dict:
                        if tool_id not in tool_assignments:
                            tool_assignments[tool_id] = {
                                "caller": edge["target"],     # The LLM agent that calls the function
                                "executor": edge["source"],   # The agent that executes the function
                            }
                        else:
                            print(f"Warning: Tool {tool_id} already assigned, skipping duplicate assignment")
                    else:
                        print(colored(f"Assigned tool ID {tool_id} not found in tools", "red"))

        # Process WebSurferAgent tools
        for edge in edges:
            target_node = next(
                (node for node in nodes if node["id"] == edge["target"]),
                None
            )
            if target_node and target_node.get("data", {}).get("class_type") == "WebSurferAgent":
                source_node = next(
                    (node for node in nodes if node["id"] == edge["source"]),
                    None
                )
                if source_node:
                    web_tool = target_node.get("data", {}).get("web_tool", "browser_use")
                    tool_id = f"websurfer_{target_node['id']}"
                    if tool_id not in tool_assignments:
                        tool_assignments[tool_id] = {
                            "caller": target_node["id"],      # WebSurferAgent calls the function
                            "executor": source_node["id"],    # UserProxy executes the function
                            "is_websurfer": True,
                            "web_tool": web_tool,
                            "websurfer_node_id": target_node["id"]
                        }

        return tool_assignments

    def generate_rag_assignments(self, edges):
        # Prepare the tool assignments
        rag_assignments = {"execution": [], "llm": []}

        for edge in edges:
            if edge.get("data") is not None and edge["data"].get("enable_rag") is True:
                rag_assignments["execution"].append(edge["source"])
                rag_assignments["llm"].append(edge["target"])

        return rag_assignments

    def generate_tool_envs(self, project: Project, tool_dict: dict) -> dict:
        """Generate tool environment files for the provided project.

        Args:
            project (Project): The project metadata.
            tool_dict (dict): Dictionary of tools with their metadata.

        Returns:
            dict: A dictionary containing the tool IDs as keys and the environment file contents as values.
        """
        # Fetch tool settings from Supabase
        tool_settings = self.supabase.fetch_tool_settings()

        # Filter tool_settings to only include tools in tool_dict
        tool_settings = {
            int(tool_id): settings
            for tool_id, settings in tool_settings.items()
            if int(tool_id) in tool_dict
        }

        # Render the template for each tool
        template = self.env.get_template("tool_env.j2")
        tool_envs = {
            tool_id: template.render(tool_settings=tool_settings[tool_id])
            for tool_id in tool_settings
        }

        return tool_envs

    def replace_env_placeholders(self, tool):
        """
        Replace all {{xxx}} placeholders in tool.code with {tool.id}_env.get('xxx').

        :param tool: An object with attributes 'code' (str) and 'id' (int)
        :return: The modified code with placeholders replaced
        """
        # Define the fixed rule for replacement
        fixed_rule = f"env_{tool['id']}['{{}}']"

        # Regular expression to find {{ placeholder }}
        pattern = r"\{\{\s*(.*?)\s*\}\}"

        # Replacement function
        def replacer(match):
            placeholder = match.group(1)
            return fixed_rule.format(placeholder)

        # Replace all placeholders in the tool's code
        replaced_code = re.sub(pattern, replacer, tool["code"])

        return replaced_code

    def generate_dataset_prompts(self, datasets):
        # Create a description that includes information about all datasets
        datasets_info = "\n".join(
            [
                f"- Dataset ID {d['id']}: {d['name']} - {d['description']}"
                for d in datasets
            ]
        )

        dataset_prompt = f"""
Retrieves relevant information and generates a response based on the query.
Available datasets:
{datasets_info}

Choose the appropriate dataset ID based on the query.
"""

        return dataset_prompt

    def generate_tool(self, tool: Tool):
        """Generate code based on the provided function meta information.

        Args:
            tool (Tool): Tool meta, such as name, description, parameters etc.

        Returns:
            json: Generated function code in JSON format.
        """
        client = OpenAI()
        client.api_key = os.environ["OPENAI_API_KEY"]

        # Create the prompt with detailed parameter information
        prompt = "Create a Python function as one text string based on the following information, provide the result in JSON format {name, description, code}.\n"
        prompt += f"Function Name: {tool.name}\n"
        prompt += f"Description: {tool.description}\n"
        prompt += "Parameters:\n"

        for signature in tool.signatures:
            prompt += (
                f"- {signature.name} ({signature.type}): {signature.description}\n"
            )

        prompt += "\nPython Function:\n"
        prompt += "The function should include the name, description, and parameters as annotations.\n"

        # Now call the OpenAI API with this prompt
        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant designed to output JSON.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                response_format={"type": "json_object"},
                model="gpt-4o",
            )

            # Print the generated code
            generated_code = response.choices[0].message.content
            if not generated_code:
                raise Exception("No code generated")
            print(generated_code)

            return json.loads(generated_code)
        except APIStatusError as e:
            print(f"Error: {e}")
            raise

    def extract_tool_meta(self, code: str):
        """
        Extract meta information from the provided Python function code.

        Args:
            code (str): The Python function code as a string.

        Returns:
            dict: Meta information as a dictionary.
        """
        # Parse the code into an AST
        tree = ast.parse(code)

        # Find the function definition in the AST
        func_def = next(
            (node for node in tree.body if isinstance(node, ast.FunctionDef)), None
        )
        if not func_def:
            raise ValueError(
                f"No function definition found in the provided code: \n{code}"
            )

        # Extract function name
        func_name = func_def.name

        # Extract docstring
        docstring = ast.get_docstring(func_def)
        description = ""
        param_descriptions = {}

        if docstring:
            docstring_lines = docstring.split("\n")
            description = docstring_lines[0].strip()
            if len(docstring_lines) > 1:
                param_lines = [
                    line.strip() for line in docstring_lines[1:] if line.strip()
                ]
                for line in param_lines:
                    match = re.match(r"(\w+) \((\w+)\): (.+)", line)
                    if match:
                        param_name, param_type, param_desc = match.groups()
                        param_descriptions[param_name] = {
                            "type": param_type,
                            "description": param_desc,
                        }

        # Extract parameters
        parameters = []
        for arg in func_def.args.args:
            param_name = arg.arg
            param_type = None
            if arg.annotation:
                param_type = ast.unparse(arg.annotation)
            param_desc = param_descriptions.get(param_name, {}).get("description", "")
            parameters.append(
                {"name": param_name, "type": param_type, "description": param_desc}
            )

        # Extract variables from the function body
        variables = []
        for node in ast.walk(func_def):
            if isinstance(node, ast.Str) and "{{" in node.s and "}}" in node.s:
                vars_in_node = re.findall(r"\{\{(.*?)\}\}", node.s)
                for var in vars_in_node:
                    variables.append({"name": var})

        # Create the meta information dictionary
        meta_info = {
            "func_name": func_name,
            "description": description,
            "signatures": parameters,
            "variables": variables,
        }

        return meta_info


# Example usage
# Run from the project root directory
# poetry run python3 -m agentok_api.services.codegen
if __name__ == "__main__":
    supabase = create_supabase_client()
    service = CodegenService(supabase)

    # tool_data = Tool(
    #     id=1,
    #     name='run_python',
    #     description='run the provided python code with ipython',
    #     signatures=[
    #         ToolSignature(
    #             id=1,
    #             name='code',
    #             description='the python code to be run',
    #             type='str',
    #         ),
    #     ],
    # )

    # generated_code = service.tool2py(tool_data)
    # print(generated_code)
    # Example usage
    code = textwrap.dedent("""
    def hello(message: str) -> None:
        '''Send hello world message.
        Parameters:
        message (str): The message to be printed.
        '''
        print(message + '{{VAR1}}' + '{{VAR2}}')
    """)

    meta_info = service.extract_tool_meta(code)
    print(json.dumps(meta_info, indent=2))
