import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Firebase Admin initialize
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Upload to Firebase Storage
    const blob = bucket.file(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await blob.save(buffer, { contentType: file.type });

    // Return public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return NextResponse.json({ message: "File uploaded", url: publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
