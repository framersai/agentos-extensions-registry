# @framers/agentos-extensions-registry

Curated extension registry bundle for AgentOS. Single import to register channels, tools, and integrations.

## Installation

```bash
pnpm add @framers/agentos-extensions-registry
```

Channel extensions are **optional dependencies** — only installed channels are loaded. Missing packages are silently skipped.

## Usage

```typescript
import { createCuratedManifest } from '@framers/agentos-extensions-registry';

// Load all available extensions
const manifest = await createCuratedManifest({ channels: 'all', tools: 'all' });

// Or selectively enable specific channels
const manifest = await createCuratedManifest({
  channels: ['telegram', 'discord', 'slack'],
  tools: 'all',
  secrets: {
    'telegram.botToken': process.env.TELEGRAM_BOT_TOKEN,
    'discord.botToken': process.env.DISCORD_BOT_TOKEN,
    'slack.botToken': process.env.SLACK_BOT_TOKEN,
    'slack.signingSecret': process.env.SLACK_SIGNING_SECRET,
    'slack.appToken': process.env.SLACK_APP_TOKEN,
  },
});

// Use with AgentOS
const agent = new AgentOS();
await agent.initialize({ extensionManifest: manifest });
```

## API

### `createCuratedManifest(options?)`

Creates a pre-configured `ExtensionManifest` with all available curated extensions.

**Options:**

| Parameter      | Type                          | Default  | Description                          |
| -------------- | ----------------------------- | -------- | ------------------------------------ |
| `channels`     | `string[] \| 'all' \| 'none'` | `'all'`  | Which channel platforms to enable    |
| `tools`        | `string[] \| 'all' \| 'none'` | `'all'`  | Which tool extensions to enable      |
| `secrets`      | `Record<string, string>`      | `{}`     | Secrets map (falls back to env vars) |
| `basePriority` | `number`                      | `0`      | Base priority for all extensions     |
| `overrides`    | `Record<string, Override>`    | `{}`     | Per-extension overrides              |

Notes:

- Channel packs may have side effects on activation (connect/poll/webhook). Consider using `channels: 'none'` and enabling channels explicitly.
- Secrets provided here are forwarded to extension-pack factories, but `requiredSecrets` gating in AgentOS also depends on environment variables and/or `extensionSecrets` provided to AgentOS.

**Override shape:**

```typescript
{ enabled?: boolean; priority?: number; options?: any }
```

### `getAvailableExtensions()`

Returns a list of extensions whose optional dependencies are installed.

### `getAvailableChannels()`

Returns a list of available channel adapters.

## Available Channel Extensions

Curated catalog currently includes **28** channel platforms. `getAvailableChannels()` marks a channel as available when its npm package is resolvable in your environment.

Note: some channels require external binaries (for example `signal-cli` and `zca-cli`) and won’t work in locked-down sandboxes unless CLI execution is explicitly allowed by your runtime policy.

| Platform | Package | SDK | Required secrets |
|---|---|---|---|
| `telegram` | `@framers/agentos-ext-channel-telegram` | `grammy` | `telegram.botToken` |
| `whatsapp` | `@framers/agentos-ext-channel-whatsapp` | `@whiskeysockets/baileys` | `whatsapp.sessionData` |
| `discord` | `@framers/agentos-ext-channel-discord` | `discord.js` | `discord.botToken` |
| `slack` | `@framers/agentos-ext-channel-slack` | `@slack/bolt` | `slack.botToken`, `slack.signingSecret`, `slack.appToken` |
| `webchat` | `@framers/agentos-ext-channel-webchat` | `socket.io` | none |
| `signal` | `@framers/agentos-ext-channel-signal` | `signal-cli` | `signal.phoneNumber` |
| `imessage` | `@framers/agentos-ext-channel-imessage` | `bluebubbles-node` | `imessage.serverUrl`, `imessage.password` |
| `google-chat` | `@framers/agentos-ext-channel-google-chat` | `google-auth-library` | `googlechat.serviceAccount` |
| `teams` | `@framers/agentos-ext-channel-teams` | `botbuilder` | `teams.appId`, `teams.appPassword` |
| `matrix` | `@framers/agentos-ext-channel-matrix` | `@vector-im/matrix-bot-sdk` | `matrix.homeserverUrl`, `matrix.accessToken` |
| `zalo` | `@framers/agentos-ext-channel-zalo` | `zalo-api` | `zalo.botToken` |
| `email` | `@framers/agentos-ext-channel-email` | `nodemailer` | `email.smtpHost`, `email.smtpUser`, `email.smtpPassword` |
| `sms` | `@framers/agentos-ext-channel-sms` | `twilio` | `twilio.accountSid`, `twilio.authToken`, `twilio.phoneNumber` |
| `twitter` | `@framers/agentos-ext-channel-twitter` | `twitter-api-v2` | `twitter.bearerToken` |
| `instagram` | `@framers/agentos-ext-channel-instagram` | `axios` | `instagram.accessToken` |
| `reddit` | `@framers/agentos-ext-channel-reddit` | `snoowrap` | `reddit.clientId`, `reddit.clientSecret`, `reddit.username`, `reddit.password` |
| `youtube` | `@framers/agentos-ext-channel-youtube` | `googleapis` | `youtube.apiKey` |
| `pinterest` | `@framers/agentos-ext-channel-pinterest` | `axios` | `pinterest.accessToken` |
| `tiktok` | `@framers/agentos-ext-channel-tiktok` | `axios` | `tiktok.accessToken` |
| `nostr` | `@framers/agentos-ext-channel-nostr` | `nostr-tools` | `nostr.privateKey`, `nostr.relayUrls` |
| `twitch` | `@framers/agentos-ext-channel-twitch` | `tmi.js` | `twitch.oauthToken`, `twitch.username`, `twitch.channel` |
| `line` | `@framers/agentos-ext-channel-line` | `@line/bot-sdk` | `line.channelAccessToken`, `line.channelSecret` |
| `feishu` | `@framers/agentos-ext-channel-feishu` | `@larksuiteoapi/node-sdk` | `feishu.appId`, `feishu.appSecret`, `feishu.verificationToken`, `feishu.encryptKey` |
| `mattermost` | `@framers/agentos-ext-channel-mattermost` | `ws` | `mattermost.url`, `mattermost.token` |
| `nextcloud-talk` | `@framers/agentos-ext-channel-nextcloud` | `nextcloud-talk-bot` | `nextcloud.url`, `nextcloud.token` |
| `tlon` | `@framers/agentos-ext-channel-tlon` | `tlon-api` | `tlon.shipUrl`, `tlon.code` |
| `irc` | `@framers/agentos-ext-channel-irc` | `node:net` | `irc.host`, `irc.port`, `irc.nick`, `irc.channels` |
| `zalouser` | `@framers/agentos-ext-channel-zalouser` | `zca-cli` | none |

## License

MIT
