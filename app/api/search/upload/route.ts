import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { parse } from "papaparse";

if (!admin.apps.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error("Firebase env variables missing!");
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload CSV to Firebase Storage
    const blob = bucket.file((file as any).name);
    await blob.save(buffer, { contentType: (file as any).type });

    // Parse CSV
    const text = buffer.toString("utf-8");
    const parsed = parse(text, { header: true, skipEmptyLines: true });
    const students = parsed.data as any[];

    const db = admin.firestore();
    const batch = db.batch();

    students.forEach(student => {
      if (!student.Roll) return;
      const docRef = db.collection("results").doc(student.Roll);
      batch.set(docRef, student);
    });

    await batch.commit();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${(file as any).name}`;
    return NextResponse.json({ message: "File uploaded and saved", url: publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
