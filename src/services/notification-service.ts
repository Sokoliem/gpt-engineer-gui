export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public show(
    type: NotificationType,
    title: string,
    message: string,
    autoClose: boolean = true,
    duration: number = 5000
  ): Notification {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      autoClose,
      duration,
    };

    this.notifications.push(notification);
    this.notifyListeners();

    if (autoClose) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, duration);
    }

    return notification;
  }

  public info(title: string, message: string, autoClose: boolean = true, duration: number = 5000): Notification {
    return this.show('info', title, message, autoClose, duration);
  }

  public success(title: string, message: string, autoClose: boolean = true, duration: number = 5000): Notification {
    return this.show('success', title, message, autoClose, duration);
  }

  public warning(title: string, message: string, autoClose: boolean = true, duration: number = 5000): Notification {
    return this.show('warning', title, message, autoClose, duration);
  }

  public error(title: string, message: string, autoClose: boolean = true, duration: number = 5000): Notification {
    return this.show('error', title, message, autoClose, duration);
  }

  public dismiss(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  public dismissAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Immediately notify the new listener with current notifications
    listener([...this.notifications]);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const notifications = [...this.notifications];
    this.listeners.forEach(listener => listener(notifications));
  }
}

export const notifier = NotificationService.getInstance();