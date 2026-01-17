const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { PredictionServiceClient } = require("@google-cloud/aiplatform");

admin.initializeApp();

const client = new PredictionServiceClient();

const PROJECT_ID = "civicsense-07";
const LOCATION = "us-central1";
const ENDPOINT_ID = "9142659637038809088"; // Replace with your actual endpoint ID if different

exports.analyzeReport = onDocumentCreated(
    "reports/{reportId}",
    async (event) => {
        // In v2, event.data is a Firestore snapshot
        const snap = event.data;
        if (!snap) {
            console.log("No data associated with the event");
            return;
        }
        const report = snap.data();
        const reportId = event.params.reportId;

        if (!report.imageUrls || report.imageUrls.length === 0) {
            console.log("No images to analyze for report:", reportId);
            return;
        }

        const instances = report.imageUrls.map((url) => ({
            content: url,
        }));

        const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}`;

        const request = {
            endpoint,
            instances,
        };

        try {
            const [response] = await client.predict(request);
            const prediction = response.predictions ? response.predictions[0] : {};

            const confidence = prediction.confidence || 90;
            const severity = prediction.severity || 8.5;
            const isReal = confidence > 50;

            await admin.firestore().collection("reports").doc(reportId).update({
                aiResult: {
                    confidence,
                    severity,
                    verified: isReal,
                },
                status: isReal ? "VERIFIED" : "REJECTED",
            });
            console.log(`Report ${reportId} processed. Verified: ${isReal}`);
        } catch (error) {
            console.error("AI Prediction failed:", error);
        }
    }
);