const proxyName = "节点选择";

function main(params) {
    if (!params.proxies) return params;
    params = filterProxies(params);
    overwriteRules(params);
    overwriteProxyGroups(params);
    overwriteDns(params);
    return params;
}
//排除节点
function filterProxies(params) {
    const excludeRegex = /Traffic|Expire|GB|剩余|到期|主页|官网|游戏|关注/;
    params.proxies = params.proxies.filter(
        (proxy) => !excludeRegex.test(proxy.name),
    );
    return params;
}
//覆写规则
function overwriteRules(params) {
    const rules = [
        "RULE-SET,applications,DIRECT",
        "RULE-SET,anti-ad-white,DIRECT",
        "RULE-SET,private,DIRECT",
        "RULE-SET,anti-ad,广告拦截",
        "RULE-SET,hagezi-normal,广告拦截",
        "RULE-SET,icloud,DIRECT",
        "RULE-SET,apple,DIRECT",
        "RULE-SET,openai,ChatGPT",
        "RULE-SET,claude,Claude",
        "RULE-SET,google," + proxyName,
        "RULE-SET,greatfire," + proxyName,
        "RULE-SET,proxy," + proxyName,
        "RULE-SET,direct,DIRECT",
        "RULE-SET,lancidr,DIRECT",
        "RULE-SET,cncidr,DIRECT",
        "RULE-SET,telegramcidr,Telegram",
        "GEOIP,LAN,DIRECT,no-resolve",
        "GEOIP,CN,DIRECT,no-resolve",
        "MATCH,漏网之鱼",
    ];
    const ruleProviderCommon = {
        type: "http",
        interval: 10800,
    };
    const acceleratePrefix = "https://gh.slinet.me/";
    const ruleProviders = {
        reject: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt",
            ),
            path: "./ruleset/reject.yaml",
        },
        "anti-ad": {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-clash.yaml",
            ),
            path: "./ruleset/anti-ad.yaml",
        },
        "anti-ad-white": {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/privacy-protection-tools/dead-horse/master/anti-ad-white-for-clash.yaml",
            ),
            path: "./ruleset/anti-ad-white.yaml",
        },
        "hagezi-normal": {
            ...ruleProviderCommon,
            behavior: "domain",
            format: "text",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/domains/multi.txt",
            ),
            path: "./ruleset/hagezi-normal.txt",
        },
        icloud: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt",
            ),
            path: "./ruleset/icloud.yaml",
        },
        apple: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt",
            ),
            path: "./ruleset/apple.yaml",
        },
        google: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt",
            ),
            path: "./ruleset/google.yaml",
        },
        proxy: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt",
            ),
            path: "./ruleset/proxy.yaml",
        },
        openai: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
            ),
            path: "./ruleset/openai.yaml",
        },
        claude: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
            ),
            path: "./ruleset/claude.yaml",
        },
        telegramcidr: {
            ...ruleProviderCommon,
            behavior: "ipcidr",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/telegramcidr.txt",
            ),
            path: "./ruleset/telegramcidr.yaml",
        },
        direct: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
            ),
            path: "./ruleset/direct.yaml",
        },
        private: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt",
            ),
            path: "./ruleset/private.yaml",
        },
        gfw: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt",
            ),
            path: "./ruleset/gfw.yaml",
        },
        greatfire: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/greatfire.txt",
            ),
            path: "./ruleset/greatfire.yaml",
        },
        "tld-not-cn": {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt",
            ),
            path: "./ruleset/tld-not-cn.yaml",
        },
        telegramcidr: {
            ...ruleProviderCommon,
            behavior: "ipcidr",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/telegramcidr.txt",
            ),
            path: "./ruleset/telegramcidr.yaml",
        },
        cncidr: {
            ...ruleProviderCommon,
            behavior: "ipcidr",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt",
            ),
            path: "./ruleset/cncidr.yaml",
        },
        lancidr: {
            ...ruleProviderCommon,
            behavior: "ipcidr",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt",
            ),
            path: "./ruleset/lancidr.yaml",
        },
        applications: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt",
            ),
            path: "./ruleset/applications.yaml",
        },
    };
    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;

    function getAcceleratedUrl(originalUrl) {
        return `${acceleratePrefix}${originalUrl}`;
    }
}
//覆写代理组
function overwriteProxyGroups(params) {
    // 所有代理
    const allProxies = params["proxies"].map((e) => e.name);
    // 自动选择代理组，按地区分组选延迟最低
    const autoProxyGroupRegexs = [
        { name: "HK-自动选择", regex: /香港|HK|Hong|🇭🇰/ },
        { name: "TW-自动选择", regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/ },
        { name: "SG-自动选择", regex: /新加坡|狮城|SG|Singapore|🇸🇬/ },
        { name: "JP-自动选择", regex: /日本|JP|Japan|🇯🇵/ },
        { name: "US-自动选择", regex: /美国|US|United States|America|🇺🇸/ },
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            timeout: 500,
            tolerance: 50,
            proxies: getProxiesByRegex(params, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

    //手动选择代理组
    const manualProxyGroups = [
        {
            name: "HK-手动选择",
            regex: /香港|HK|Hong|🇭🇰/,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg",
        },
        {
            name: "TW-手动选择",
            regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg",
        },
        {
            name: "SG-手动选择",
            regex: /新加坡|狮城|SG|Singapore|🇸🇬/,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg",
        },
        {
            name: "JP-手动选择",
            regex: /日本|JP|Japan|🇯🇵/,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg",
        },
        {
            name: "US-手动选择",
            regex: /美国|US|United States|America|🇺🇸/,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg",
        },
    ];

    const manualProxyGroupsConfig = manualProxyGroups
        .map((item) => ({
            name: item.name,
            type: "select",
            proxies: getManualProxiesByRegex(params, item.regex),
            icon: item.icon,
            hidden: false,
        }))
        .filter((item) => item.proxies.length > 0);

    const groups = [
        {
            name: proxyName,
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
            proxies: [
                "自动选择",
                "手动选择",
                "负载均衡",
                // "负载均衡(轮询)",
                "DIRECT",
            ],
        },
        {
            name: "手动选择",
            type: "select",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg",
            proxies: allProxies,
        },
        {
            name: "自动选择",
            type: "select",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
            proxies: ["ALL-自动选择"],
        },
        {
            name: "负载均衡",
            type: "load-balance",
            url: "http://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
            interval: 300,
            "max-failed-times": 3,
            strategy: "consistent-hashing",
            lazy: true,
            proxies: allProxies,
        },
        // {
        //     name: "负载均衡(轮询)",
        //     type: "load-balance",
        //     url: "http://www.gstatic.com/generate_204",
        //     icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
        //     interval: 300,
        //     "max-failed-times": 3,
        //     strategy: "round-robin",
        //     lazy: true,
        //     proxies: allProxies,
        // },
        {
            name: "ALL-自动选择",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: allProxies,
            hidden: true,
        },
        {
            name: "Telegram",
            type: "select",
            proxies: [
                proxyName,
                "HK-自动选择",
                "TW-自动选择",
                "SG-自动选择",
                "JP-自动选择",
                "US-自动选择",
                "HK-手动选择",
                "TW-手动选择",
                "SG-手动选择",
                "JP-手动选择",
                "US-手动选择",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg",
        },
        {
            name: "ChatGPT",
            type: "select",
            proxies: [
                proxyName,
                "HK-自动选择",
                "TW-自动选择",
                "SG-自动选择",
                "JP-自动选择",
                "US-自动选择",
                "HK-手动选择",
                "TW-手动选择",
                "SG-手动选择",
                "JP-手动选择",
                "US-手动选择",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg",
        },
        {
            name: "Claude",
            type: "select",
            proxies: [
                proxyName,
                "HK-自动选择",
                "TW-自动选择",
                "SG-自动选择",
                "JP-自动选择",
                "US-自动选择",
                "HK-手动选择",
                "TW-手动选择",
                "SG-手动选择",
                "JP-手动选择",
                "US-手动选择",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/claude.svg",
        },
        {
            name: "漏网之鱼",
            type: "select",
            proxies: [proxyName, "DIRECT"],
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
        },
        {
            name: "广告拦截",
            type: "select",
            proxies: ["REJECT", "DIRECT", proxyName],
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg",
        },
    ];

    autoProxyGroups.length &&
        groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    params["proxy-groups"] = groups;
}
//防止dns泄露
function overwriteDns(params) {
    const defaultDnsList = [
        "tls://223.5.5.5",
        "tls://1.12.12.12",
        "tls://8.8.8.8",
    ];
    const cnDnsList = ["https://dns.alidns.com/dns-query", "tls://dot.pub"];
    const trustDnsList = ["192.168.100.11", "https://doh.slinet.me"];
    // const notionDns = 'tls://dns.jerryw.cn'
    // const notionUrls = [
    //     'http-inputs-notion.splunkcloud.com',
    //     '+.notion-static.com',
    //     '+.notion.com',
    //     '+.notion.new',
    //     '+.notion.site',
    //     '+.notion.so',
    // ]
    // const combinedUrls = notionUrls.join(',');
    const dnsOptions = {
        enable: true,
        listen: "0.0.0.0:8853",
        ipv6: false,
        "use-system-hosts": false,
        "prefer-h3": true,
        "cache-algorithm": "arc",
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": [
            // 本地主机/设备
            "+.lan",
            "+.local",
            // Windows网络出现小地球图标
            "+.msftconnecttest.com",
            "+.msftncsi.com",
            // QQ快速登录检测失败
            "localhost.ptlogin2.qq.com",
            "localhost.sec.qq.com",
            // 微信快速登录检测失败
            "localhost.work.weixin.qq.com",
        ],
        "default-nameserver": defaultDnsList,
        nameserver: trustDnsList,

        // 这个用于覆盖上面的 nameserver
        "nameserver-policy": {
            //[combinedUrls]: notionDns,
            "+.slinet.me, +.slinet.moe": [
                "192.168.100.11",
                "https://doh.slinet.me",
            ],
            "geosite:private,cn,geolocation-cn,category-games@cn": cnDnsList,
            "geosite:geolocation-!cn": trustDnsList,
            // 如果你有一些内网使用的DNS，应该定义在这里，多个域名用英文逗号分割
            // '+.公司域名.com, www.4399.com, +.baidu.com': '10.0.0.1'
        },

        // fallback: trustDnsList,
        // "fallback-filter": {
        //     geoip: true,
        //     //除了 geoip-code 配置的国家 IP, 其他的 IP 结果会被视为污染 geoip-code 配置的国家的结果会直接采用，否则将采用 fallback结果
        //     "geoip-code": "CN",
        //     //geosite 列表的内容被视为已污染，匹配到 geosite 的域名，将只使用 fallback解析，不去使用 nameserver
        //     geosite: ["gfw"],
        //     ipcidr: ["240.0.0.0/4"],
        //     domain: ["+.google.com", "+.facebook.com", "+.youtube.com"],
        // },
    };

    // GitHub加速前缀
    const githubPrefix = "https://gh.slinet.me/";

    // GEO数据GitHub资源原始下载地址
    const rawGeoxURLs = {
        geoip: "https://github.com/MetaCubeX/meta-rules-dat/raw/release/geoip-lite.dat",
        geosite:
            "https://github.com/MetaCubeX/meta-rules-dat/raw/release/geosite.dat",
        mmdb: "https://github.com/MetaCubeX/meta-rules-dat/raw/release/country-lite.mmdb",
    };

    // 生成带有加速前缀的GEO数据资源对象
    const accelURLs = Object.fromEntries(
        Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [
            key,
            `${githubPrefix}${githubUrl}`,
        ]),
    );

    const otherOptions = {
        "unified-delay": true,
        "tcp-concurrent": true,
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        sniffer: {
            enable: true,
            sniff: {
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
                TLS: {
                    ports: [443, 8443],
                },
                QUIC: {
                    ports: [443, 8443],
                },
            },
        },
        "geodata-mode": true,
        "geox-url": accelURLs,
    };

    params.dns = { ...params.dns, ...dnsOptions };
    Object.keys(otherOptions).forEach((key) => {
        params[key] = otherOptions[key];
    });
}

function getProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies
        .filter((e) => regex.test(e.name))
        .map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies : ["手动选择"];
}

function getManualProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies
        .filter((e) => regex.test(e.name))
        .map((e) => e.name);
    return matchedProxies.length > 0
        ? matchedProxies
        : ["DIRECT", "手动选择", proxyName];
}

module.exports = { main };
