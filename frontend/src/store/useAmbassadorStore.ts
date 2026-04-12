import { create } from 'zustand';
import { ambassadorApi } from '@/lib/api';
import type { AmbassadorMetrics, ReferralCampaign, ReferralRecord, RewardTransaction } from '../types/ambassador';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface AmbassadorState {
  metrics: AmbassadorMetrics | null;
  funnelData: any | null;
  linkInfo: any | null;
  qrCode: string | null;
  rewardBreakdown: any | null;
  fraudStatus: any | null;
  rankingInsights: any | null;
  networkGraph: any | null;
  assignedEvents: any[];
  campaigns: ReferralCampaign[];
  students: any[];
  chatMessages: any[];
  rewardsHistory: any[];
  isLoading: boolean;
  error: string | null;
  
  // Real-time
  stompClient: Client | null;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;

  // Actions
  fetchMetrics: () => Promise<void>;
  fetchFunnel: () => Promise<void>;
  fetchLinkInfo: () => Promise<void>;
  fetchRewardBreakdown: () => Promise<void>;
  fetchFraudStatus: () => Promise<void>;
  fetchRankingInsights: () => Promise<void>;
  fetchNetworkGraph: () => Promise<void>;
  fetchAssignedEvents: () => Promise<void>;
  
  fetchCampaigns: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchRewardHistory: () => Promise<void>;
  fetchChatHistory: (roomId: string) => Promise<void>;
  sendChatMessage: (roomId: string, content: string) => Promise<void>;
  createCampaign: (data: Partial<ReferralCampaign>) => Promise<void>;
  downloadCertificate: () => Promise<void>;
}

export const useAmbassadorStore = create<AmbassadorState>((set, get) => ({
  metrics: null,
  funnelData: null,
  linkInfo: null,
  qrCode: null,
  rewardBreakdown: null,
  fraudStatus: null,
  rankingInsights: null,
  networkGraph: null,
  assignedEvents: [],
  campaigns: [],
  students: [],
  chatMessages: [],
  rewardsHistory: [],
  isLoading: false,
  error: null,
  stompClient: null,

  connectWebSocket: () => {
    const socket = new SockJS('http://localhost:8080/ws-ambassador');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('Ambassador WebSocket Connected');
        client.subscribe('/topic/metrics', (message) => {
          set({ metrics: JSON.parse(message.body) });
        });
        client.subscribe('/topic/rewards', (message) => {
          set({ rewardBreakdown: JSON.parse(message.body) });
        });
        client.subscribe('/topic/fraud', (message) => {
          set({ fraudStatus: JSON.parse(message.body) });
        });
      },
    });
    client.activate();
    set({ stompClient: client });
  },

  disconnectWebSocket: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.deactivate();
      set({ stompClient: null });
    }
  },

  fetchMetrics: async () => {
    set({ isLoading: true });
    try {
      const data = await ambassadorApi.getMetrics();
      set({ metrics: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchFunnel: async () => {
    try {
      const data = await ambassadorApi.getReferralFunnel();
      set({ funnelData: data });
    } catch (e) {
      console.error("Funnel fetch failed", e);
    }
  },

  fetchLinkInfo: async () => {
    try {
      const [link, qr] = await Promise.all([
        ambassadorApi.getReferralLink(),
        ambassadorApi.getReferralQR()
      ]);
      set({ linkInfo: link, qrCode: qr.qrCode });
    } catch (e) {
      console.error("Link fetch failed", e);
    }
  },

  fetchRewardBreakdown: async () => {
    try {
      const data = await ambassadorApi.getRewardBreakdown();
      set({ rewardBreakdown: data });
    } catch (e) {
      console.error("Reward breakdown fetch failed", e);
    }
  },

  fetchFraudStatus: async () => {
    try {
      const data = await ambassadorApi.getFraudStatus();
      set({ fraudStatus: data });
    } catch (e) {
      console.error("Fraud status fetch failed", e);
    }
  },

  fetchRankingInsights: async () => {
    try {
      const data = await ambassadorApi.getRankingDetails();
      set({ rankingInsights: data });
    } catch (e) {
      console.error("Ranking fetch failed", e);
    }
  },

  fetchNetworkGraph: async () => {
    try {
      const data = await ambassadorApi.getNetworkGraph();
      set({ networkGraph: data });
    } catch (e) {
      console.error("Network graph fetch failed", e);
    }
  },

  fetchAssignedEvents: async () => {
    try {
      const data = await ambassadorApi.getEvents();
      set({ assignedEvents: data });
    } catch (e) {
      console.error("Events fetch failed", e);
    }
  },

  fetchCampaigns: async () => {
    try {
      const data = await ambassadorApi.getCampaigns();
      set({ campaigns: data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchStudents: async () => {
    try {
      const data = await ambassadorApi.getStudents();
      set({ students: data || [] });
    } catch (error) {
      console.error('Failed to fetch referred students:', error);
    }
  },

  fetchRewardHistory: async () => {
    try {
      const data = await ambassadorApi.getRewardHistory();
      set({ rewardsHistory: data || [] });
    } catch (error) {
      console.error('Failed to fetch reward history:', error);
    }
  },

  fetchChatHistory: async (roomId) => {
    try {
      const data = await ambassadorApi.getChatHistory(roomId);
      set({ chatMessages: data || [] });
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  },

  sendChatMessage: async (roomId, content) => {
    try {
      const response = await ambassadorApi.sendMessage(roomId, content);
      set((state) => ({ chatMessages: [...state.chatMessages, response] }));
    } catch (error) {
      console.error('Failed to send message');
    }
  },

  createCampaign: async (data) => {
    set({ isLoading: true });
    try {
      const created = await ambassadorApi.createCampaign(data);
      set((state) => ({ campaigns: [...state.campaigns, created], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  downloadCertificate: async () => {
    try {
      const blob = await ambassadorApi.downloadCertificate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Ambassador_Certificate.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
    }
  }
}));
