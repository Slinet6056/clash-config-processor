import requests
import re
from urllib.parse import urlparse


def fetch_and_process(url, process_func):
    response = requests.get(url)
    lines = response.text.splitlines()
    return process_func(lines)


def process_antiad(lines):
    return [f"- DOMAIN-SUFFIX,{line[2:]}" for line in lines if line.startswith("+.")]


def process_hagezi(lines):
    return [
        f"- DOMAIN-SUFFIX,{line}"
        for line in lines
        if not line.startswith("#") and line.strip()
    ]


def process_blackmatrix7(lines):
    return [line.strip() for line in lines if line.strip().startswith("-")]


def normalize_rule(rule):
    return re.sub(r"^[\s-]*", "", rule).strip()


# Fetch and process files
antiad = fetch_and_process(
    "https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-clash.yaml",
    process_antiad,
)
hagezi = fetch_and_process(
    "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/domains/light.txt",
    process_hagezi,
)
blackmatrix7 = fetch_and_process(
    "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising_Classical.yaml",
    process_blackmatrix7,
)

all_rules = antiad + hagezi + blackmatrix7

unique_rules = sorted(set(map(normalize_rule, all_rules)))

with open("rules/reject.yaml", "w") as f:
    f.write("payload:\n")
    for rule in unique_rules:
        f.write(f"  - {rule}\n")

print(f"Total rules: {len(unique_rules)}")
