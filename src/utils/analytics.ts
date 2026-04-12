import PostHog from 'posthog-react-native';

let client: PostHog | null = null;

export function initAnalytics() {
  client = new PostHog('phc_SUBSTITUA_PELA_CHAVE_POSTHOG', {
    host: 'https://us.i.posthog.com',
  });
}

export const Analytics = {
  appOpened: () => client?.capture('app_opened'),
  protocolSelected: (protocolo: string) =>
    client?.capture('protocol_selected', { protocolo }),
  laudoGenerated: (protocolo: string, duracao_ms: number) =>
    client?.capture('laudo_generated', { protocolo, duracao_ms }),
  laudoCopied: () => client?.capture('laudo_copied'),
  laudoSavedHistory: () => client?.capture('laudo_saved_history'),
  voiceUsed: () => client?.capture('voice_used'),
  voiceDuration: (seconds: number) =>
    client?.capture('voice_duration_seconds', { seconds }),
  textFreeUsed: () => client?.capture('text_free_used'),
  chipsCount: (count: number) =>
    client?.capture('chips_selected_count', { count }),
  laudousgClicked: (posicao: string) =>
    client?.capture('laudousg_link_clicked', { posicao }),
  laudousgModalShown: () => client?.capture('laudousg_modal_shown'),
  laudousgModalDismissed: () => client?.capture('laudousg_modal_dismissed'),
};
