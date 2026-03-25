import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";

async function NotificationsContent() {
  const notifications = await getNotifications();

  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

  if (unreadIds.length > 0) {
    await markNotificationsAsRead(unreadIds);
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground">
          No notifications yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Notifications</CardTitle>
          <span className="text-sm text-muted-foreground">
            {unreadIds.length > 0 ? `${unreadIds.length} new` : "All caught up"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 border-b transition-colors ${
                !notification.read ? "bg-muted/30" : ""
              }`}
            >
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={notification.creator.image ?? "/avatar.png"}
                />
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  {notification.type === "LIKE" && (
                    <HeartIcon className="size-4 text-red-500 shrink-0" />
                  )}
                  {notification.type === "COMMENT" && (
                    <MessageCircleIcon className="size-4 text-blue-500 shrink-0" />
                  )}
                  {notification.type === "FOLLOW" && (
                    <UserPlusIcon className="size-4 text-green-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {notification.creator.name ?? notification.creator.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {notification.type === "LIKE" && "liked your post"}
                    {notification.type === "COMMENT" &&
                      "commented on your post"}
                    {notification.type === "FOLLOW" && "started following you"}
                  </span>
                </div>

                {notification.post && (
                  <p className="text-sm text-muted-foreground truncate pl-6">
                    {notification.post.content}
                  </p>
                )}
                {notification.comment && (
                  <p className="text-sm text-muted-foreground pl-6 italic">
                    &ldquo;{notification.comment.content}&rdquo;
                  </p>
                )}

                <p className="text-xs text-muted-foreground pl-6">
                  {formatDistanceToNow(new Date(notification.createdAt))} ago
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="max-w-2xl mx-auto">
      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsContent />
      </Suspense>
    </div>
  );
}
