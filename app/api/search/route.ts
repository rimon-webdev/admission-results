import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roll = searchParams.get("roll");

  if (!roll) return NextResponse.json({ error: "Roll number is required" }, { status: 400 });

  try {
    const docRef = doc(db, "results", roll);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "No result found" }, { status: 404 });
    }

    return NextResponse.json(docSnap.data());
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 });
  }
}
