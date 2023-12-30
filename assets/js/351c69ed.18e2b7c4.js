"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[219],{8679:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>d,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var i=n(1527),o=n(6224);const s={},r="Human in the Loop",a={id:"tutorials/human-in-loop/index",title:"Human in the Loop",description:"This tutorial provides step-by-step guidance on constructing a workflow that incorporates a human-in-the-loop approach. Utilizing the FlowGen template, Human in the Loop, you can engage with it directly or fork it to tweak the flow to your specifications.",source:"@site/docs/tutorials/human-in-loop/index.md",sourceDirName:"tutorials/human-in-loop",slug:"/tutorials/human-in-loop/",permalink:"/docs/tutorials/human-in-loop/",draft:!1,unlisted:!1,editUrl:"https://github.com/tiwater/flowgen/edit/main/website/docs/tutorials/human-in-loop/index.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Concepts",permalink:"/docs/concepts"},next:{title:"Ask Planner",permalink:"/docs/tutorials/ask-planner/"}},l={},c=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Steps to Create a New Workflow",id:"steps-to-create-a-new-workflow",level:2},{value:"Initialize a New Flow",id:"initialize-a-new-flow",level:3},{value:"Orchestrating Your Workflow",id:"orchestrating-your-workflow",level:3},{value:"Configuring Your Agents",id:"configuring-your-agents",level:3},{value:"Initiating the Workflow",id:"initiating-the-workflow",level:3},{value:"Conclusion",id:"conclusion",level:2}];function h(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"human-in-the-loop",children:"Human in the Loop"}),"\n",(0,i.jsxs)(t.p,{children:["This tutorial provides step-by-step guidance on constructing a workflow that incorporates a human-in-the-loop approach. Utilizing the FlowGen template, ",(0,i.jsx)(t.a,{href:"https://flowgen.app/gallery/4pbokrvi7zguv48",children:"Human in the Loop"}),", you can engage with it directly or fork it to tweak the flow to your specifications."]}),"\n",(0,i.jsxs)(t.p,{children:["The tutorial leverages the official notebooks ",(0,i.jsx)(t.a,{href:"https://github.com/microsoft/autogen/blob/main/samples/simple_chat.py",children:"Simple Chat"})," and ",(0,i.jsx)(t.a,{href:"https://github.com/microsoft/autogen/blob/main/notebook/agentchat_human_feedback.ipynb",children:"Human Feedback"})," as its foundation."]}),"\n",(0,i.jsx)(t.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(t.p,{children:["You\u2019ll need access to FlowGen, which is accessible either ",(0,i.jsx)(t.a,{href:"https://flowgen.app",children:"online"})," for immediate use or ",(0,i.jsx)(t.a,{href:"https://docs.flowgen.app/docs/tutorials/getting-started",children:"locally on your machine"})," for a more personalized setup. This guide will focus on utilizing the online version of FlowGen."]}),"\n",(0,i.jsx)(t.h2,{id:"steps-to-create-a-new-workflow",children:"Steps to Create a New Workflow"}),"\n",(0,i.jsx)(t.h3,{id:"initialize-a-new-flow",children:"Initialize a New Flow"}),"\n",(0,i.jsx)(t.p,{children:"Begin by signing into FlowGen. Once logged in, opt for the 'Build from Scratch' option to establish a new Flow."}),"\n",(0,i.jsx)(t.h3,{id:"orchestrating-your-workflow",children:"Orchestrating Your Workflow"}),"\n",(0,i.jsx)(t.p,{children:"First, clear the canvas by removing any pre-loaded sample nodes. Next, populate your workflow by adding the following nodes:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"Assistant Agent"}),": This will serve as the workflow's Assistant."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"UserProxy Agent"}),": Label this as ",(0,i.jsx)(t.code,{children:"UserProxy"}),"."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"Refer to the accompanying illustration to visualize the flow arrangement:"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"flow",src:n(4293).Z+"",width:"2102",height:"1300"})}),"\n",(0,i.jsx)(t.h3,{id:"configuring-your-agents",children:"Configuring Your Agents"}),"\n",(0,i.jsx)(t.p,{children:"The primary focus here is on configuring the UserProxy Agent:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["Alter the ",(0,i.jsx)(t.code,{children:"Human Input Mode"})," setting to ",(0,i.jsx)(t.code,{children:"ALWAYS"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["Adjust the ",(0,i.jsx)(t.code,{children:"Max Consecutive Auto Replies"})," to a value greater than ",(0,i.jsx)(t.code,{children:"0"}),", such as ",(0,i.jsx)(t.code,{children:"3"}),". This allows the UserProxy Agent to independently execute received code and dispatch the results back to the Assistant Agent."]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["Click the ",(0,i.jsx)(t.strong,{children:"More Options"})," button on the UserProxy Agent. In the revealed dialog, activate ",(0,i.jsx)(t.code,{children:"Code Execution Config"})," by marking the corresponding checkbox."]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["Still within the dialog, define the termination message command as ",(0,i.jsx)(t.code,{children:"TERMINATE"})," by clicking the robot icon adjacent to the input field."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"With these configurations, your UserProxy Agent should look like this:"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"UserProxy",src:n(568).Z+"",width:"672",height:"740"})}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.strong,{children:"More Options"})," dialog should appear as follows:"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"UserProxy Options",src:n(2832).Z+"",width:"1332",height:"720"})}),"\n",(0,i.jsx)(t.h3,{id:"initiating-the-workflow",children:"Initiating the Workflow"}),"\n",(0,i.jsxs)(t.p,{children:["Launch the workflow by clicking the ",(0,i.jsx)(t.strong,{children:"Start Chat"})," button, located in the top right corner. Input the message ",(0,i.jsx)(t.code,{children:"What day is it today?"})," within the chat interface to witness the workflow's response:"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Chat",src:n(9673).Z+"",width:"2210",height:"1490"})}),"\n",(0,i.jsx)(t.p,{children:"The Assistant Agent, lacking the current date data, will generate a pertinent code snippet and forward it to the UserProxy Agent. In turn, the UserProxy Agent runs the code and relays the output back to the Assistant Agent. The Assistant Agent deciphers this result and communicates the response back to the UserProxy Agent, which then delivers the final answer to the user."}),"\n",(0,i.jsx)(t.p,{children:"Upon receiving a message, the UserProxy will cue for human participation. A prompt will be displayed in the chat, and the input field will be accentuated:"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Wait for Input",src:n(1271).Z+"",width:"1268",height:"1038"})}),"\n",(0,i.jsx)(t.p,{children:"If you wish to execute the code snippet from the Assistant Agent, simply press 'Enter.' The system will proceed to execute the code and funnel the results back to the Assistant Agent."}),"\n",(0,i.jsxs)(t.p,{children:["User can submit follow-up inquiries like ",(0,i.jsx)(t.code,{children:"What day is tomorrow?"}),", and the workflow will respond accordingly."]}),"\n",(0,i.jsxs)(t.p,{children:["To terminate the workflow, user can input the term ",(0,i.jsx)(t.code,{children:"exit"}),", prompting the system to cease operations."]}),"\n",(0,i.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,i.jsx)(t.p,{children:"Through this tutorial, you've learned to create a human-in-the-loop chatbot capable of answering queries and executing code snippets autonomously. This system replicates the functionality akin to ChatGPT, complete with plugin support."}),"\n",(0,i.jsx)(t.p,{children:"Human intervention plays a crucial role in various scenarios, and this guide has illustrated how to seamlessly integrate this element into your workflows. By beginning with the provided sample, you are now equipped to craft and customize your very own human-in-the-loop systems, tailoring them to meet specific needs and requirements."})]})}function d(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},9673:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/chat-992702df30a7a1232c18a5c683a2b9c0.png"},4293:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/flow-3fa58a61e208721ee7d9f13668d8b910.png"},2832:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/userproxy-options-9e8976295b3bb61ef2af90f9d2952f7e.png"},568:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/userproxy-63cb55a708bf58631dadde355c699b04.png"},1271:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/wait-for-input-7a8c988d92d3b66fcf4cbdb6e89f9a3a.png"},6224:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>r});var i=n(959);const o={},s=i.createContext(o);function r(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);