#!/usr/bin/env python3
"""
Download the official Microsoft Learn study guides and parse the
"Skills measured" outline (functional groups with weights, skills, outcomes)
into scripts/data/skills-measured.json.

Usage:
  python3 scripts/fetch-skills-measured.py            # all exams
  python3 scripts/fetch-skills-measured.py ab-730     # one exam
Then:
  python3 scripts/generate-blueprints.py
"""
import json, pathlib, re, sys, urllib.request
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'scripts/data/skills-measured.json'
EXAMS = ['ab-730', 'ab-900', 'ab-731', 'ab-620', 'ab-650', 'ab-100', 'ai-901', 'ai-103', 'ai-200', 'ai-300', 'ai-500', 'az-401', 'gh-300', 'gh-600', 'gh-700']
URL = 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/{}'


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.out, self.skip = [], 0

    def handle_starttag(self, t, a):
        if t in ('script', 'style', 'nav', 'footer', 'header'):
            self.skip += 1
        if t in ('h1', 'h2', 'h3', 'h4', 'li', 'p', 'tr'):
            self.out.append('\n' + {'h1': '# ', 'h2': '## ', 'h3': '### ', 'h4': '#### ', 'li': '- '}.get(t, ''))

    def handle_endtag(self, t):
        if t in ('script', 'style', 'nav', 'footer', 'header'):
            self.skip -= 1

    def handle_data(self, d):
        if self.skip <= 0:
            self.out.append(d)


def fetch_text(code: str) -> str:
    req = urllib.request.Request(URL.format(code), headers={'User-Agent': 'copilot-cert-academy-blueprints'})
    html = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'ignore')
    p = Text()
    p.feed(html)
    txt = re.sub(r'[ \t]+', ' ', ''.join(p.out))
    return re.sub(r'\n\s*\n+', '\n', txt)


def parse(code: str, t: str) -> dict:
    title = re.search(r'# Study guide for Exam ([A-Z]+-\d+): (.*)', t)
    asof = re.search(r'Skills measured as of ([A-Z][a-z]+ \d+, \d{4})', t)
    aud = re.search(r'### Audience profile\s*(.*?)(?=\n### Skills at a glance)', t, re.S)
    start = re.search(r'\n### [^\n]*\(\d+[–-]\d+%\)\n', t)
    end = re.search(r'\n## Study resources', t)
    body = t[start.start():end.start()] if start and end else ''
    groups = []
    for chunk in re.split(r'\n(?=### )', body):
        m = re.match(r'### (.*?) \((\d+)[–-](\d+)%\)\n(.*)', chunk, re.S)
        if not m:
            continue
        name, lo, hi, sub = m.groups()
        skills = []
        for sc in re.split(r'\n(?=#### )', sub):
            sm = re.match(r'#### (.*?)\n(.*)', sc, re.S)
            if not sm:
                continue
            sname, bul = sm.groups()
            bullets = [re.sub(r'\s+', ' ', b).strip() for b in re.split(r'(?:^|\n)- ', bul) if b.strip()]
            skills.append({'name': sname.strip(), 'outcomes': bullets})
        groups.append({'name': name.strip(), 'low': int(lo), 'high': int(hi), 'skills': skills})
    return {
        'code': title.group(1) if title else code.upper(),
        'title': title.group(2).strip() if title else '',
        'asOf': asof.group(1) if asof else None,
        'audience': re.sub(r'\s+', ' ', aud.group(1)).strip() if aud else '',
        'groups': groups,
    }


def main():
    wanted = sys.argv[1:] or EXAMS
    data = json.load(open(OUT, encoding='utf-8')) if OUT.exists() else {}
    for code in wanted:
        parsed = parse(code, fetch_text(code))
        n = sum(len(s['outcomes']) for g in parsed['groups'] for s in g['skills'])
        if not parsed['groups']:
            print(f'{code}: no weighted groups found, keeping previous data', file=sys.stderr)
            continue
        data[code] = parsed
        print(f"{code}: {len(parsed['groups'])} groups, {n} outcomes, as of {parsed['asOf']}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    json.dump(data, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
