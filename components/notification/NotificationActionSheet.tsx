import { Notification } from '@/types/notification';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

interface NotificationActionsSheetProps {
  notification?: Notification;
  onToggleRead: () => Promise<void>;
  onHide: () => Promise<void>;
  onClose?: () => void;
}

export function showNotificationActionsSheet({
  notification,
  onToggleRead,
  onHide,
  onClose,
}: NotificationActionsSheetProps) {
  const isRead = notification?.is_read ?? false;
  const toggleLabel = isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc';

  const options = [toggleLabel, 'Xóa', 'Hủy'];

  const handleAction = async (index: number) => {
    if (index === 0) {
      await onToggleRead();
    } else if (index === 1) {
      Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => await onHide(),
        },
      ]);
    }
    if (onClose) onClose();
  };

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      handleAction
    );
  } else {
    Alert.alert('Tùy chọn', '', [
      { text: toggleLabel, onPress: () => handleAction(0) },
      { text: 'Xóa', style: 'destructive', onPress: () => handleAction(1) },
      { text: 'Hủy', style: 'cancel' },
    ]);
  }
}
