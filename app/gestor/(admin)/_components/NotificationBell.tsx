// src/app/gestor/(admin)/_components/NotificationBell.tsx
import { getNotificationsForBell } from '../notification/actions';
import { NotificationBellClient } from './NotificationBellClient';

export async function NotificationBell() {
  // Busca apenas a lista de notificações (sem contagem de não lidas)
  const { notifications } = await getNotificationsForBell();

  return (
    <NotificationBellClient 
      initialNotifications={notifications} 
    />
  );
}