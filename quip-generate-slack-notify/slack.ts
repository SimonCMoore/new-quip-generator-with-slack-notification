// slack.ts
import fetch from 'node-fetch';

interface SlackNotificationData {
    DocumentLink: string;
    DocumentName: string;
    text: string;
}
interface slackResponse {
    success: boolean;
}

export async function sendSlackNotification(
    webhookUrl: string,
    notificationData: SlackNotificationData,
): Promise<slackResponse> {
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Data sent successfully');
                    return { success: true };
                } else {
                    console.error('Failed to send data');
                    return { success: false };
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } catch (error) {
        console.error('Error sending notification:', error);
    }

    return { success: false };
}
