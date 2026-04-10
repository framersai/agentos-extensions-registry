// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { createCuratedManifest } from '../src/index';

describe('speech-runtime registry pack', () => {
  it('materializes the built-in speech-runtime providers from AgentOS core', async () => {
    const manifest = await createCuratedManifest({
      channels: 'none',
      tools: 'none',
      voice: ['speech-runtime'],
      productivity: 'none',
      cloud: 'none',
      domains: 'none',
      secrets: {
        'openai.apiKey': 'test-openai-key',
        'elevenlabs.apiKey': 'test-elevenlabs-key',
      },
    });

    const pack = manifest.packs.find((entry) => entry.identifier === 'registry:speech-runtime');
    expect(pack).toBeDefined();

    const resolvedPack = await pack!.factory();
    expect(resolvedPack.name).toBe('@framers/agentos:speech-runtime');
    const descriptorIds = resolvedPack.descriptors.map((descriptor) => descriptor.id);
    expect(descriptorIds).toContain('agentos-openai-whisper-stt');
    expect(descriptorIds).toContain('agentos-openai-tts');
    expect(descriptorIds).toContain('agentos-elevenlabs-tts');
    expect(descriptorIds).toContain('agentos-adaptive-vad');
  });
});
