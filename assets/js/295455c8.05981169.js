"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[411],{9581:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var i=t(1527),r=t(7541);const s={},o="Search and Write",a={id:"tutorials/search-n-write/index",title:"Search and Write",description:"In this tutorial, we'll dive into the use of FlowGen's GroupChat and Functions features to develop an agent capable of searching for online news and crafting articles for you.",source:"@site/docs/tutorials/search-n-write/index.md",sourceDirName:"tutorials/search-n-write",slug:"/tutorials/search-n-write/",permalink:"/tutorials/search-n-write/",draft:!1,unlisted:!1,editUrl:"https://github.com/tiwater/flowgen/edit/main/website/docs/tutorials/search-n-write/index.md",tags:[],version:"current",lastUpdatedAt:1703946162,formattedLastUpdatedAt:"Dec 30, 2023",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Ask Planner",permalink:"/tutorials/ask-planner/"}},c={},l=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Steps to Build Your Agent",id:"steps-to-build-your-agent",level:2},{value:"Initiating a New Autoflow",id:"initiating-a-new-autoflow",level:3},{value:"Orchestrating the Autoflow",id:"orchestrating-the-autoflow",level:3},{value:"Integrating the Search Function",id:"integrating-the-search-function",level:3},{value:"Verifying Configurations",id:"verifying-configurations",level:3},{value:"Initiating the Chat",id:"initiating-the-chat",level:3},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"search-and-write",children:"Search and Write"}),"\n",(0,i.jsx)(n.p,{children:"In this tutorial, we'll dive into the use of FlowGen's GroupChat and Functions features to develop an agent capable of searching for online news and crafting articles for you."}),"\n",(0,i.jsxs)(n.p,{children:["You can access this tutorial as a FlowGen template named ",(0,i.jsx)(n.a,{href:"https://flowgen.app/gallery/udaciyj0xp325ye",children:"Search and Write"}),". Feel free to interact with it directly, or fork the flow to apply your custom modifications."]}),"\n",(0,i.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(n.p,{children:["Before we begin, ensure you have access to FlowGen. You can explore FlowGen ",(0,i.jsx)(n.a,{href:"https://flowgen.app",children:"online"})," or opt to ",(0,i.jsx)(n.a,{href:"https://github.com/tiwater/flowgen/",children:"install it on your local system"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"This tutorial will utilize the online platform of FlowGen."}),"\n",(0,i.jsx)(n.h2,{id:"steps-to-build-your-agent",children:"Steps to Build Your Agent"}),"\n",(0,i.jsx)(n.h3,{id:"initiating-a-new-autoflow",children:"Initiating a New Autoflow"}),"\n",(0,i.jsx)(n.p,{children:"After logging into FlowGen, you can kickstart your new flow by clicking on 'Build from Scratch'."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Build from Scratch",src:t(5930).Z+"",width:"2784",height:"1202"})}),"\n",(0,i.jsx)(n.h3,{id:"orchestrating-the-autoflow",children:"Orchestrating the Autoflow"}),"\n",(0,i.jsx)(n.p,{children:"Clear the deck by deleting any pre-existing sample nodes. Then, from the left panel, drag and drop the following nodes onto your workspace:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["First ",(0,i.jsx)(n.code,{children:"Assistant Agent"}),", aptly named ",(0,i.jsx)(n.code,{children:"Searcher"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Second ",(0,i.jsx)(n.code,{children:"Assistant Agent"}),", titled ",(0,i.jsx)(n.code,{children:"Writer"})," \u2014 make sure to append 'add TERMINATE at the end' in the ",(0,i.jsx)(n.code,{children:"system_message"}),", otherwise the conversation will persist indefinitely."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"UserProxy Agent"}),", referred to as ",(0,i.jsx)(n.code,{children:"UserProxy"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"GroupChat"}),", with the ",(0,i.jsx)(n.code,{children:"Involve User"})," option enabled."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Autoflow Diagram",src:t(8641).Z+"",width:"2600",height:"1334"})}),"\n",(0,i.jsx)(n.h3,{id:"integrating-the-search-function",children:"Integrating the Search Function"}),"\n",(0,i.jsx)(n.p,{children:"Now let's insert a search capability:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["In the configuration node, select the ",(0,i.jsx)(n.code,{children:"Build Functions"})," option to bring up the Function Editor."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Add a new function by clicking on the 'Add Function' button."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Name this function ",(0,i.jsx)(n.code,{children:"search_bing_news"}),", and for its description, enter ",(0,i.jsx)(n.code,{children:"Search Bing with the query and return a compilation of links."})," Next, introduce a parameter termed ",(0,i.jsx)(n.code,{children:"keyword"}),", and describe it as ",(0,i.jsx)(n.code,{children:"The Bing search term."})]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Generate the code by clicking on ",(0,i.jsx)(n.code,{children:"Generate Code"}),". Please note that the function name, descriptions, and parameter explanations play a vital part in the accurate generation of code, so a clear and precise definition is critical."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Review the code for any potential errors or areas of improvement. AI is proficient but not infallible."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Once completed, your function editor should resemble this:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Function Editor",src:t(1805).Z+"",width:"2308",height:"1272"})}),"\n",(0,i.jsx)(n.p,{children:"The auto-generated code will look something like this:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-python",children:"import requests\nfrom bs4 import BeautifulSoup\n\n# Construct the search URL\nsearch_url = f\"\"\"https://www.bing.com/news/search?q={keyword.replace(' ', '+')}&form=QBN&pq={keyword.replace(' ', '+')}&sc=8-0&sp=-1&qs=n&sk=\"\"\"\n\n# Perform the HTTP request to Bing\nresponse = requests.get(search_url)\n\n# Check if the request was successful\nif response.status_code == 200:\n    # Parse the HTML content\n    soup = BeautifulSoup(response.text, 'html.parser')\n    # Find all news articles\n    articles = soup.find_all('div', {'class': 'news-card newsitem cardcommon'})\n    # Extract the links from the news articles\n    links = [article.find('a', href=True)['href'] for article in articles]\n    return links\nelse:\n    return []\n"})}),"\n",(0,i.jsx)(n.h3,{id:"verifying-configurations",children:"Verifying Configurations"}),"\n",(0,i.jsxs)(n.p,{children:["Access the ",(0,i.jsx)(n.code,{children:"More Options"})," on the UserProxy node ensuring that ",(0,i.jsx)(n.code,{children:"Code Execution"})," is enabled."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Code Execution Option",src:t(2515).Z+"",width:"1326",height:"686"})}),"\n",(0,i.jsxs)(n.p,{children:["Within the same dialog, you can set ",(0,i.jsx)(n.code,{children:"TERMINATE"})," as the message's termination flag by clicking on the robot icon."]}),"\n",(0,i.jsx)(n.p,{children:"Rest assured, all configurations are preserved automatically."}),"\n",(0,i.jsx)(n.h3,{id:"initiating-the-chat",children:"Initiating the Chat"}),"\n",(0,i.jsxs)(n.p,{children:["Everything's set! Hit the ",(0,i.jsx)(n.code,{children:"Start Chat"})," button situated on the canvas's top-right corner to engage with the Autoflow. Prompt the process with an entry like ",(0,i.jsx)(n.code,{children:"search the latest news about Elon Musk and generate a detailed article on it."})]}),"\n",(0,i.jsxs)(n.p,{children:["Consequently, the ",(0,i.jsx)(n.code,{children:"Searcher"})," will retrieve a list of relevant links, after which the ",(0,i.jsx)(n.code,{children:"Writer"})," expertly extracts information from these sources to fabricate a comprehensive article."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Chat Display",src:t(4146).Z+"",width:"1270",height:"1352"})}),"\n",(0,i.jsx)(n.p,{children:"If the display area is inadequate, utilize the 'Open this chat in a new window' option for an expanded view."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Expanded Chat",src:t(5102).Z+"",width:"2794",height:"1484"})}),"\n",(0,i.jsx)(n.p,{children:"Kudos! You've successfully configured an intelligent agent adept at performing online searches and article generation."}),"\n",(0,i.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,i.jsx)(n.p,{children:"Throughout this tutorial, we\u2019ve explored the implementation of GroupChat and Functions within a flow, enabling code execution and agent collaboration. Additionally, you've learned to harness the Function Editor for creating custom functions to enhance your workflow."})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},5930:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/build-from-scratch-ad00d5b23fd87a32db51b3cf3fcbdd1d.png"},5102:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/chat-7f11e740102748b58859e718a031efb5.png"},2515:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/code-execution-ab10d43c765b8b9899cc9b94fcab6312.png"},4146:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/embed-chat-5db0df382fb3079b1c02a7b26b1bf9fa.png"},8641:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/flow-ce76f50b28729fee7530473e4a265d4a.png"},1805:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/function-editor-6a9fd5f98ce52f55019f08c4e3c17382.png"},7541:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>o});var i=t(959);const r={},s=i.createContext(r);function o(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);