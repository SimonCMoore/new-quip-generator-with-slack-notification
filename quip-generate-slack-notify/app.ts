// app.ts
import { createQuipDocument } from './quip';
import { sendSlackNotification } from './slack';
import { getDateStringForWeeklyDay, getDateStringForMonthString } from './dateUtils';

interface Event {
    webhook: string;
    quipToken: string;
    quipTemplateId: string;
    quipDocumentNamePrepend: string;
    quipFolderId: string;
    frequency: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    text: string;
}

export const lambdaHandler = async (event: Event) => {
    const {
        webhook,
        quipToken,
        quipTemplateId,
        quipDocumentNamePrepend,
        quipFolderId,
        frequency,
        dayOfWeek,
        dayOfMonth,
        text,
    } = event;

    if (!quipToken || quipToken == 'xxx') {
        console.error('quipToken is not se in the event.');
        return;
    }
    if (!webhook || webhook == 'xxx') {
        console.error('webhook is not se in the event.');
    }

    let documentName: string;
    if (frequency === 'Weekly' && dayOfWeek !== undefined) {
        const tuesday: string = getDateStringForWeeklyDay(dayOfWeek);
        documentName = `${quipDocumentNamePrepend} ${tuesday}`;
    } else if (frequency === 'Monthly' && dayOfMonth !== undefined) {
        const month: string = getDateStringForMonthString(dayOfMonth);
        documentName = `${quipDocumentNamePrepend} ${month}`;
    } else {
        documentName = quipDocumentNamePrepend;
    }

    console.log('Starting Quip copy and Slack notification');

    console.log('Starting Quip copy');

    const newDocument = await createQuipDocument(quipToken, quipTemplateId, documentName, quipFolderId);
    if (!newDocument) {
        console.error('Document not created, skipping Slack notification');
        return;
    }
    console.log('Complete Quip copy, starting validation');

    const slackNotificationData = {
        DocumentLink: newDocument.thread.link,
        DocumentName: newDocument.thread.title,
        text: text,
    };

    console.log('Start sendSlackNotification');
    await sendSlackNotification(webhook, slackNotificationData);
    console.log('Complete sendSlackNotification');
};
