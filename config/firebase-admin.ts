
import * as admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
    try {
        let serviceAccount;
        // Try the new admin SDK key first, then fall back to old one
        const newKeyPath = path.join(process.cwd(), 'codewithmuhilandb-119e1f5c4edc   cloud key.json');
        const oldKeyPath = path.join(process.cwd(), 'codewithmuhilandb-0e9d2dd2af20.json');

        // Check if we are in production or local and which key exists
        const fs = require('fs');

        // Check local files FIRST, then Env Var
        if (fs.existsSync(newKeyPath)) {
            const fileContent = fs.readFileSync(newKeyPath, 'utf8');
            serviceAccount = JSON.parse(fileContent);
            console.log("ℹ️ Using Firebase Service Account from New Key File (Prioritized):", path.basename(newKeyPath));
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            try {
                let envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
                if ((envKey.startsWith("'") && envKey.endsWith("'")) || (envKey.startsWith('"') && envKey.endsWith('"'))) {
                    envKey = envKey.substring(1, envKey.length - 1);
                }
                serviceAccount = JSON.parse(envKey);
                if (serviceAccount.private_key) {
                    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                }
                console.log("ℹ️ Using Firebase Service Account from Environment Variable");
            } catch (e) {
                console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY from environment:", e);
            }
        } else if (fs.existsSync(oldKeyPath)) {
            const fileContent = fs.readFileSync(oldKeyPath, 'utf8');
            serviceAccount = JSON.parse(fileContent);
            console.log("ℹ️ Using Firebase Service Account from Old Key File:", path.basename(oldKeyPath));
        }

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id // Explicitly set project ID
            });
            console.log(`✅ Firebase Admin Initialized for Project: ${serviceAccount.project_id}`);
            console.log(`ℹ️ Service Account Email: ${serviceAccount.client_email}`);
        } else {
            console.error("❌ Firebase Admin Initialization Failed: No service account found in ENV or Files");
            console.log("ℹ️ Checked paths:", { newKeyPath, oldKeyPath });
        }
    } catch (error) {
        console.error("❌ Firebase Admin Initialization Failed:", error);
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
