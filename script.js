const proxyName = "节点选择";

function main(params) {
    if (!params.proxies) return params;
    params = filterProxies(params);
    overwriteGeneralConfig(params);
    overwriteDns(params);
    overwriteProxyGroups(params);
    overwriteRules(params);
    return params;
}

function filterProxies(params) {
    const excludeRegex = /Traffic|Expire|GB|剩余|到期|主页|官网|游戏|关注/;
    const filteredProxies = params.proxies.filter(
        (proxy) => !excludeRegex.test(proxy.name),
    );
    return { proxies: filteredProxies };
}

function overwriteGeneralConfig(params) {
    const geoxURLs = {
        geoip: getAcceleratedUrl(
            "https://github.com/MetaCubeX/meta-rules-dat/raw/release/geoip-lite.dat",
        ),
        geosite: getAcceleratedUrl(
            "https://github.com/MetaCubeX/meta-rules-dat/raw/release/geosite.dat",
        ),
        mmdb: getAcceleratedUrl(
            "https://github.com/MetaCubeX/meta-rules-dat/raw/release/country-lite.mmdb",
        ),
    };

    const generalConfig = {
        port: 7890,
        "socks-port": 7891,
        "mixed-port": 7892,
        "redir-port": 7893,
        "tproxy-port": 7894,
        "allow-lan": false,
        mode: "rule",
        "log-level": "info",
        ipv6: false,
        "external-controller": "0.0.0.0:9090",
        "keep-alive-interval": 30,
        "find-process-mode": "always",
        "unified-delay": true,
        "tcp-concurrent": true,
        "clash-for-android": {
            "append-system-dns": false,
        },
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
            tracing: true,
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
        "geo-auto-update": true,
        "geo-update-interval": 24,
        "geox-url": geoxURLs,
    };

    Object.keys(generalConfig).forEach((key) => {
        params[key] = generalConfig[key];
    });
}

function overwriteDns(params) {
    const defaultDnsList = [
        "tls://223.5.5.5",
        "tls://1.12.12.12",
        "tls://8.8.8.8",
    ];
    const cnDnsList = [
        "https://dns.alidns.com/dns-query#h3=true",
        "tls://dot.pub",
    ];
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
        "use-hosts": true,
        "use-system-hosts": true,
        "prefer-h3": true,
        "cache-algorithm": "arc",
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": [
            "*.lan",
            "*.localdomain",
            "*.example",
            "*.invalid",
            "*.localhost",
            "*.test",
            "*.local",
            "*.home.arpa",
            "time.*.com",
            "time.*.gov",
            "time.*.edu.cn",
            "time.*.apple.com",
            "time1.*.com",
            "time2.*.com",
            "time3.*.com",
            "time4.*.com",
            "time5.*.com",
            "time6.*.com",
            "time7.*.com",
            "ntp.*.com",
            "ntp1.*.com",
            "ntp2.*.com",
            "ntp3.*.com",
            "ntp4.*.com",
            "ntp5.*.com",
            "ntp6.*.com",
            "ntp7.*.com",
            "*.time.edu.cn",
            "*.ntp.org.cn",
            "+.pool.ntp.org",
            "time1.cloud.tencent.com",
            "music.163.com",
            "*.music.163.com",
            "*.126.net",
            "musicapi.taihe.com",
            "music.taihe.com",
            "songsearch.kugou.com",
            "trackercdn.kugou.com",
            "*.kuwo.cn",
            "api-jooxtt.sanook.com",
            "api.joox.com",
            "joox.com",
            "y.qq.com",
            "*.y.qq.com",
            "streamoc.music.tc.qq.com",
            "mobileoc.music.tc.qq.com",
            "isure.stream.qqmusic.qq.com",
            "dl.stream.qqmusic.qq.com",
            "aqqmusic.tc.qq.com",
            "amobile.music.tc.qq.com",
            "*.xiami.com",
            "*.music.migu.cn",
            "music.migu.cn",
            "*.msftconnecttest.com",
            "*.msftncsi.com",
            "msftconnecttest.com",
            "msftncsi.com",
            "localhost.ptlogin2.qq.com",
            "localhost.sec.qq.com",
            "+.srv.nintendo.net",
            "+.stun.playstation.net",
            "xbox.*.microsoft.com",
            "*.*.xboxlive.com",
            "+.battlenet.com.cn",
            "+.wotgame.cn",
            "+.wggames.cn",
            "+.wowsgame.cn",
            "+.wargaming.net",
            "proxy.golang.org",
            "stun.*.*",
            "stun.*.*.*",
            "+.stun.*.*",
            "+.stun.*.*.*",
            "+.stun.*.*.*.*",
            "heartbeat.belkin.com",
            "*.linksys.com",
            "*.linksyssmartwifi.com",
            "*.router.asus.com",
            "mesu.apple.com",
            "swscan.apple.com",
            "swquery.apple.com",
            "swdownload.apple.com",
            "swcdn.apple.com",
            "swdist.apple.com",
            "lens.l.google.com",
            "stun.l.google.com",
            "+.nflxvideo.net",
            "*.square-enix.com",
            "*.finalfantasyxiv.com",
            "*.ffxiv.com",
            "*.mcdn.bilivideo.cn",
            "WORKGROUP",
        ],
        "default-nameserver": defaultDnsList,
        nameserver: trustDnsList,

        "nameserver-policy": {
            //[combinedUrls]: notionDns,
            "+.slinet.me, +.slinet.moe": [
                "192.168.100.11",
                "https://doh.slinet.me",
            ],
            "geosite:private,cn": cnDnsList,
            "geosite:geolocation-!cn": trustDnsList,
        },
    };
    params.dns = dnsOptions;
}

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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/flags/hk.svg",
            ),
        },
        {
            name: "TW-手动选择",
            regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/,
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/flags/tw.svg",
            ),
        },
        {
            name: "SG-手动选择",
            regex: /新加坡|狮城|SG|Singapore|🇸🇬/,
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/flags/sg.svg",
            ),
        },
        {
            name: "JP-手动选择",
            regex: /日本|JP|Japan|🇯🇵/,
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/flags/jp.svg",
            ),
        },
        {
            name: "US-手动选择",
            regex: /美国|US|United States|America|🇺🇸/,
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/flags/us.svg",
            ),
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/adjust.svg",
            ),
            proxies: ["自动选择", "手动选择", "负载均衡", "DIRECT"],
        },
        {
            name: "手动选择",
            type: "select",
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/link.svg",
            ),
            proxies: allProxies,
        },
        {
            name: "自动选择",
            type: "select",
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/speed.svg",
            ),
            proxies: ["ALL-自动选择"],
        },
        {
            name: "负载均衡",
            type: "load-balance",
            url: "http://www.gstatic.com/generate_204",
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/balance.svg",
            ),
            interval: 300,
            "max-failed-times": 3,
            strategy: "consistent-hashing",
            lazy: true,
            proxies: allProxies,
        },
        {
            name: "Steam",
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
                "DIRECT",
            ],
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/steam.svg",
            ),
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/telegram.svg",
            ),
        },
        {
            name: "OpenAI",
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/chatgpt.svg",
            ),
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/claude.svg",
            ),
        },
        {
            name: "Google",
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/google.svg",
            ),
        },
        {
            name: "Microsoft",
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
                "DIRECT",
            ],
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/microsoft.svg",
            ),
        },
        {
            name: "YouTube",
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/youtube.svg",
            ),
        },
        {
            name: "巴哈姆特",
            type: "select",
            proxies: ["TW-自动选择", "TW-手动选择", proxyName],
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/bahamut.png",
            ),
        },
        {
            name: "哔哩哔哩",
            type: "select",
            proxies: [
                "DIRECT",
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
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/bilibili.svg",
            ),
        },
        {
            name: "漏网之鱼",
            type: "select",
            proxies: [proxyName, "DIRECT"],
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/fish.svg",
            ),
        },
        {
            name: "广告拦截",
            type: "select",
            proxies: ["REJECT", "DIRECT", proxyName],
            icon: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Slinet6056/clash-config-processor/master/icons/block.svg",
            ),
        },
        {
            name: "ALL-自动选择",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: allProxies,
            hidden: true,
        },
    ];

    autoProxyGroups.length &&
        groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    params["proxy-groups"] = groups;
}

function overwriteRules(params) {
    const rules = [
        "RULE-SET,applications,DIRECT",
        "RULE-SET,whitelist,DIRECT",
        "RULE-SET,private,DIRECT",
        "RULE-SET,reject,广告拦截",
        "RULE-SET,steamcn,DIRECT",
        "RULE-SET,steam,Steam",
        "RULE-SET,telegram,Telegram",
        "RULE-SET,openai,OpenAI",
        "RULE-SET,claude,Claude",
        "RULE-SET,google,Google",
        "RULE-SET,microsoft,Microsoft",
        "RULE-SET,youtube,YouTube",
        "RULE-SET,bahamut,巴哈姆特",
        "RULE-SET,bilibili,哔哩哔哩",
        "RULE-SET,proxy," + proxyName,
        "RULE-SET,direct,DIRECT",
        "RULE-SET,lancidr,DIRECT",
        "RULE-SET,cncidr,DIRECT",
        "GEOIP,LAN,DIRECT,no-resolve",
        "GEOIP,CN,DIRECT,no-resolve",
        "MATCH,漏网之鱼",
    ];
    const ruleProviderCommon = {
        type: "http",
        interval: 10800,
    };

    const ruleProviders = {
        applications: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt",
            ),
            path: "./ruleset/applications.yaml",
        },
        whitelist: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml",
            ),
            path: "./ruleset/whitelist.yaml",
        },
        private: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt",
            ),
            path: "./ruleset/private.yaml",
        },
        reject: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising_Classical.yaml",
            ),
            path: "./ruleset/reject.yaml",
        },
        steamcn: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/SteamCN/SteamCN.yaml",
            ),
            path: "./ruleset/steamcn.yaml",
        },
        steam: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/Steam/Steam.yaml",
            ),
            path: "./ruleset/steam.yaml",
        },
        telegram: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml",
            ),
            path: "./ruleset/telegram.yaml",
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
        google: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/Google/Google.yaml",
            ),
            path: "./ruleset/google.yaml",
        },
        microsoft: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/Microsoft/Microsoft.yaml",
            ),
            path: "./ruleset/microsoft.yaml",
        },
        youtube: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/YouTube/YouTube.yaml",
            ),
            path: "./ruleset/youtube.yaml",
        },
        bahamut: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/Bahamut/Bahamut.yaml",
            ),
            path: "./ruleset/bahamut.yaml",
        },
        bilibili: {
            ...ruleProviderCommon,
            behavior: "classical",
            url: getAcceleratedUrl(
                "https://github.com/blackmatrix7/ios_rule_script/raw/master/rule/Clash/BiliBili/BiliBili.yaml",
            ),
            path: "./ruleset/bilibili.yaml",
        },
        proxy: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt",
            ),
            path: "./ruleset/proxy.yaml",
        },
        direct: {
            ...ruleProviderCommon,
            behavior: "domain",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
            ),
            path: "./ruleset/direct.yaml",
        },
        lancidr: {
            ...ruleProviderCommon,
            behavior: "ipcidr",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt",
            ),
            path: "./ruleset/lancidr.yaml",
        },
        cncidr: {
            ...ruleProviderCommon,
            behavior: "ipcidr",
            url: getAcceleratedUrl(
                "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt",
            ),
            path: "./ruleset/cncidr.yaml",
        },
    };
    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;
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

function getAcceleratedUrl(originalUrl) {
    const acceleratePrefix = "https://gh.slinet.me/";
    return `${acceleratePrefix}${originalUrl}`;
}

module.exports = { main };
