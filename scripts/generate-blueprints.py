#!/usr/bin/env python3
"""
Generate src/content/certifications.ts from scripts/data/skills-measured.json.

skills-measured.json is parsed from the official Microsoft Learn study guides
(learn.microsoft.com/credentials/certifications/resources/study-guides/<code>).
Re-run scripts/fetch-skills-measured.py to refresh it when Microsoft updates an
exam, then re-run this script.
"""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
data = json.load(open(ROOT / 'scripts/data/skills-measured.json', encoding='utf-8'))

META = {
  'ab-730': dict(name='Microsoft Certified: AI Business Professional', short='AI Business Professional', track='Microsoft 365 Copilot & Agents', level='Fundamentals', cert='ai-business-professional', items=45, minutes=45,
    tagline='Use Microsoft 365 Copilot, Copilot Cowork and prebuilt agents to get real work done well.',
    desc='For business users. Covers generative AI fundamentals and responsible use, writing and managing prompts and chats, drafting and analysing business content, running meetings and collaboration with Copilot, and driving outcomes with prebuilt agents and Copilot Cowork.'),
  'ab-900': dict(name='Microsoft 365 Certified: Copilot and Agent Administration Fundamentals', short='Copilot & Agent Admin Fundamentals', track='Microsoft 365 Copilot & Agents', level='Fundamentals', cert='copilot-and-agent-administration-fundamentals', items=45, minutes=45,
    tagline='Configure, secure and support an AI-powered Microsoft 365 environment.',
    desc='For administrators new to Copilot. Covers core Microsoft 365 services and objects, data protection and governance for Microsoft 365 and Copilot (Purview, labels, DLP, retention), and the basic administrative tasks for Copilot and agents (licensing, access, agent lifecycle, reporting).'),
  'ab-731': dict(name='Microsoft Certified: AI Transformation Leader', short='AI Transformation Leader', track='Microsoft 365 Copilot & Agents', level='Fundamentals', cert='ai-transformation-leader', items=45, minutes=45,
    tagline='Lead AI adoption: find the value, pick the tools, plan the rollout.',
    desc='For business and technology leaders. Covers the business value of generative AI, the capabilities and opportunities of Microsoft AI apps and services (Microsoft 365 Copilot, Copilot Studio, Foundry, agents), and implementation and adoption strategy including responsible AI, change management and measuring impact.'),
  'ab-620': dict(name='Microsoft Certified: AI Agent Builder Associate', short='AI Agent Builder Associate', track='Microsoft 365 Copilot & Agents', level='Associate', cert='ai-agent-builder-associate', items=50, minutes=100,
    tagline='Design, build, integrate and manage enterprise agents in Copilot Studio.',
    desc='For developers and advanced makers. Covers planning and configuring agent solutions, integrating and extending agents in Copilot Studio (knowledge, tools, connectors, MCP, Foundry models, channels), and testing, publishing, securing and managing agents.'),
  'ab-650': dict(name='Microsoft 365 Certified: Microsoft 365 and AI Services Administrator Associate', short='M365 & AI Services Administrator', track='Microsoft 365 Copilot & Agents', level='Associate', cert='ai-services-administrator-associate', items=50, minutes=100,
    tagline='Administer, govern and secure Microsoft 365 tenants, Copilot and agents at scale.',
    desc='For Microsoft 365 administrators. Covers configuring and managing tenants and workloads, governing and securing them (identity, Purview, compliance, Defender), and managing and securing AI services including Copilot, agents and connected AI capabilities.'),
  'ab-100': dict(name='Microsoft Certified: Agentic AI Business Solutions Architect Expert', short='Agentic AI Business Solutions Architect', track='Microsoft 365 Copilot & Agents', level='Expert', cert='agentic-ai-business-solutions-architect', items=55, minutes=120,
    tagline='Plan, design and deploy agentic AI business solutions across Microsoft 365, Power Platform, Dynamics 365 and Foundry.',
    desc='The expert credential for solution architects. Covers planning AI-powered business solutions (discovery, value, governance, licensing), designing them (agent architecture, data, integration, security, responsible AI), and deploying them (ALM, rollout, adoption, monitoring).'),
  'ai-901': dict(name='Microsoft Certified: Azure AI Fundamentals', short='Azure AI Fundamentals', track='Azure AI & Foundry', level='Fundamentals', cert='azure-ai-fundamentals', items=45, minutes=45,
    tagline='AI concepts and how to implement them with Microsoft Foundry.',
    desc='The entry point for technical AI roles (replaces AI-900). Covers AI concepts and capabilities (machine learning, generative AI, agents, responsible AI) and implementing AI solutions with Microsoft Foundry: models, prompts, grounding, evaluation and agents.'),
  'ai-103': dict(name='Microsoft Certified: Azure AI Apps and Agents Developer Associate', short='Azure AI Apps & Agents Developer', track='Azure AI & Foundry', level='Associate', cert='azure-ai-apps-and-agents-developer-associate', items=50, minutes=100,
    tagline='Build, manage and deploy generative AI apps and agents with Microsoft Foundry.',
    desc='Successor to AI-102. Covers planning and managing an Azure AI solution, implementing generative AI and agentic solutions (Foundry models, agents, RAG, evaluation), and implementing computer vision, text analysis and information extraction solutions.'),
  'ai-200': dict(name='Microsoft Certified: Azure AI Cloud Developer Associate', short='Azure AI Cloud Developer', track='Azure AI & Foundry', level='Associate', cert='azure-ai-cloud-developer-associate', items=50, minutes=100,
    tagline='Build the cloud back end for AI solutions on Azure.',
    desc='For developers who implement the services behind AI solutions. Covers containerized solutions, AI solutions on Azure data management services, connecting to and consuming Azure services, and securing, monitoring and troubleshooting Azure solutions.'),
  'ai-300': dict(name='Microsoft Certified: Azure AI Operations Engineer', short='AI Operations (MLOps & GenAIOps)', track='Azure AI & Foundry', level='Associate', cert='azure-ai-operations', items=50, minutes=100,
    tagline='Operationalize machine learning and generative AI: MLOps and GenAIOps on Azure.',
    desc='Covers designing and implementing MLOps infrastructure, the ML model lifecycle, GenAIOps infrastructure, generative AI quality assurance and observability, and optimizing generative AI systems and model performance.'),
  'ai-500': dict(name='Microsoft Certified: Multi-Agent AI Solutions Expert', short='Multi-Agent AI Solutions Expert', track='Azure AI & Foundry', level='Expert', cert='multi-agent-ai-solutions-expert', items=55, minutes=120,
    tagline='Architect, build, evaluate and govern production multi-agent systems on Azure.',
    desc='The expert credential for AI engineers. Covers architecting multi-agent solutions, developing them in Azure (Foundry Agent Service, orchestration frameworks, MCP and A2A), evaluating, optimizing and monitoring them, and securing, governing and deploying them.'),
  'az-401': dict(name='Microsoft Certified: Agentic DevOps Engineer Expert', short='Agentic DevOps Engineer', track='GitHub Copilot & Agentic AI', level='Expert', cert='agentic-devops-engineer-expert', items=55, minutes=120, beta=True,
    tagline='Design and run DevOps processes, pipelines and governance with AI agents in the loop.',
    desc='Beta expert exam. Covers processes and communications, source control strategy, build and release pipelines, security and compliance, and instrumentation, with GitHub Copilot and agents woven through each.'),
  'gh-300': dict(name='GitHub Copilot', short='GitHub Copilot', track='GitHub Copilot & Agentic AI', level='Professional', cert='github-copilot', items=60, minutes=100,
    tagline='Use GitHub Copilot responsibly and effectively across the development lifecycle.',
    desc='Covers responsible AI use, Copilot features across plans and surfaces (chat, agent mode, coding agent, code review), data flow and architecture, prompt engineering and context crafting, developer productivity measurement, and privacy, content exclusions and safeguards.'),
  'gh-600': dict(name='GitHub Certified: Agentic AI Developer', short='Agentic AI Developer (GitHub)', track='GitHub Copilot & Agentic AI', level='Professional', cert='agentic-ai-developer', items=60, minutes=100,
    tagline='Operate, integrate, supervise and govern AI agents inside production SDLC workflows.',
    desc='Covers agent architecture and SDLC processes, tool use and environment interaction (MCP, custom tools), memory, state and execution, evaluation and error analysis, multi-agent coordination, and guardrails and accountability.'),
  'gh-700': dict(name='GitHub Certified: Agentic AI Business Professional', short='Agentic AI Business Professional (GitHub)', track='GitHub Copilot & Agentic AI', level='Professional', cert='agentic-ai-business-professional', items=60, minutes=100, beta=True,
    tagline='Use GitHub and GitHub Copilot to run business work with agentic workflows, no coding required.',
    desc='Beta exam for product, program and project managers and analysts. Covers GitHub platform features, productivity with GitHub Copilot, designing agentic workflows and automations, and human-in-the-loop tasks for agentic workflows.'),
}

def esc(s: str) -> str:
    return s.replace('\\', '\\\\').replace("'", "\\'")

out = ["import type { Certification } from './types';", '',
       '/**',
       ' * GENERATED FILE. Do not edit by hand.',
       ' * Source: official Microsoft Learn study guides, parsed into',
       ' * scripts/data/skills-measured.json. Regenerate with:',
       ' *   python3 scripts/generate-blueprints.py',
       ' */',
       'export const certifications: Certification[] = [']
for code in META:
  d = data[code]; m = META[code]
  out.append('  {')
  out.append(f"    id: '{code}',")
  out.append(f"    code: '{d['code']}',")
  out.append(f"    examTitle: '{esc(d['title'])}',")
  out.append(f"    name: '{esc(m['name'])}',")
  out.append(f"    shortName: '{esc(m['short'])}',")
  out.append(f"    track: '{m['track']}',")
  out.append(f"    level: '{m['level']}',")
  if m.get('beta'): out.append('    beta: true,')
  out.append(f"    tagline: '{esc(m['tagline'])}',")
  out.append(f"    description: '{esc(m['desc'])}',")
  out.append(f"    audience: '{esc(d['audience'])}',")
  if d.get('asOf'): out.append(f"    skillsAsOf: '{d['asOf']}',")
  out.append(f"    studyGuideUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/{code}',")
  out.append(f"    certificationUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/{m['cert']}/',")
  out.append(f"    simulationItems: {m['items']},")
  out.append(f"    minutes: {m['minutes']},")
  out.append('    passingScore: 700,')
  out.append('    domains: [')
  for gi, g in enumerate(d['groups'], 1):
    out.append('      {')
    out.append(f"        id: '{code}-{gi}',")
    out.append(f'        number: {gi},')
    out.append(f"        name: '{esc(g['name'])}',")
    out.append(f"        weight: {(g['low'] + g['high']) / 2:g},")
    out.append(f"        weightLow: {g['low']},")
    out.append(f"        weightHigh: {g['high']},")
    out.append('        skills: [')
    for si, s in enumerate(g['skills'], 1):
      out.append('          {')
      out.append(f"            id: '{code}-{gi}-{si}',")
      out.append(f"            name: '{esc(s['name'])}',")
      out.append('            outcomes: [')
      for oi, o in enumerate(s['outcomes'], 1):
        out.append(f"              {{ id: '{code}-{gi}-{si}-{oi}', text: '{esc(o)}' }},")
      out.append('            ],')
      out.append('          },')
    out.append('        ],')
    out.append('      },')
  out.append('    ],')
  out.append('  },')
out.append('];')
out.append('')
out.append('export const certById = (id: string) => certifications.find((c) => c.id === id);')
out.append('export const domainById = (id: string) => {')
out.append('  for (const c of certifications) {')
out.append('    const d = c.domains.find((d) => d.id === id);')
out.append('    if (d) return { cert: c, domain: d };')
out.append('  }')
out.append('  return undefined;')
out.append('};')
out.append('export const allOutcomes = () =>')
out.append('  certifications.flatMap((c) => c.domains.flatMap((d) => d.skills.flatMap((s) => s.outcomes.map((o) => ({ ...o, cert: c, domain: d, skill: s })))));')
out.append('')
(ROOT / 'src/content/certifications.ts').write_text('\n'.join(out), encoding='utf-8')
n = sum(len(s['outcomes']) for c in META for g in data[c]['groups'] for s in g['skills'])
print(f'wrote certifications.ts: {len(META)} exams, {n} outcomes')
