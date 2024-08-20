// quip.ts
import fetch from 'node-fetch';

interface QuipTemplate {
    thread: {
        author_id: string;
        created_usec: string;
        id: string;
        is_template: boolean;
        link: string;
        owning_company_id: string;
        secret_path: string;
        title: string;
        type: string;
        updated_usec: string;
    };
}

interface NewDoc {
    title: string;
    folder_id: string;
}

const quipPlatformURL = 'https://platform.quip-amazon.com/';

export async function createQuipDocument(
    quipApiToken: string,
    quipTemplateId: string,
    documentName: string,
    quipFolderId: string,
): Promise<QuipTemplate | null> {
    console.log("running createQuipDocument");
    const newDoc: NewDoc = {
        title: documentName,
        folder_id: quipFolderId,
    };

    try {
        const cloneUrl = `${quipPlatformURL}2/threads/${quipTemplateId}/copy`;
        console.log("Cloneurl: ", cloneUrl);
        const response = await fetch(cloneUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${quipApiToken}`,
            },
            body: JSON.stringify(newDoc),
        });
        if (response.ok) {
            const newDocument = (await response.json()) as QuipTemplate;
            console.log(`New document created from template: ${newDocument.thread.title} (${newDocument.thread.id})`);
            return newDocument;
        } else {
            console.error(`Failed to create new document from template: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error creating new document from template:', error);
    }

    return null;
}
