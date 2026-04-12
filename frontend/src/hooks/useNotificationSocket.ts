import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';

export interface SocketNotification {
  id: string;
  type: 'EVENT_REMINDER' | 'TEAM_INVITE' | 'CERTIFICATE_ISSUED' | 'HACKATHON_UPDATE' | 'GENERAL';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface UseNotificationSocketOptions {
  onNotification?: (notification: SocketNotification) => void;
}

export const useNotificationSocket = (options?: UseNotificationSocketOptions) => {
  const { user, token } = useAuthStore();
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    if (!user || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('/api/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to personal notification channel
        client.subscribe(`/user/${user.id}/notifications`, (message) => {
          try {
            const notification: SocketNotification = JSON.parse(message.body);

            // Show toast based on type
            switch (notification.type) {
              case 'TEAM_INVITE':
                toast.info(notification.title, {
                  description: notification.message,
                  duration: 6000,
                });
                break;
              case 'CERTIFICATE_ISSUED':
                toast.success(notification.title, {
                  description: notification.message,
                  duration: 8000,
                });
                break;
              case 'EVENT_REMINDER':
                toast.warning(notification.title, {
                  description: notification.message,
                  duration: 5000,
                });
                break;
              default:
                toast(notification.title, {
                  description: notification.message,
                });
            }

            options?.onNotification?.(notification);
          } catch (e) {
            console.error('Failed to parse notification:', e);
          }
        });

        // Subscribe to hackathon updates
        client.subscribe(`/topic/hackathon-updates`, (message) => {
          try {
            const update = JSON.parse(message.body);
            toast.info('Hackathon Update', { description: update.message });
          } catch (e) {
            console.error(e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
    });

    client.activate();
    clientRef.current = client;
  }, [user, token, options]);

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const sendMessage = useCallback((destination: string, body: object) => {
    if (clientRef.current?.active) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, []);

  return { sendMessage, disconnect, reconnect: connect };
};
