import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define the structure of a submitted post
interface SubmittedPost {
  title: string;
  email: string;
  category: string;
  content: string;
  submittedAt: string;
}

// Path to the submissions file
const submissionsFilePath = path.join(
  process.cwd(),
  "src",
  "lib",
  "submissions.json",
);

// Ensure the JSON file exists
async function ensureSubmissionsFile() {
  try {
    await fs.access(submissionsFilePath);
  } catch {
    await fs.writeFile(submissionsFilePath, JSON.stringify([]));
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.email || !data.category || !data.content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newSubmission: SubmittedPost = {
      ...data,
      submittedAt: new Date().toISOString(),
    };

    await ensureSubmissionsFile();

    // Read existing submissions
    const fileContents = await fs.readFile(submissionsFilePath, "utf8");
    const submissions: SubmittedPost[] = JSON.parse(fileContents);

    // Add new submission and write back to the file
    submissions.push(newSubmission);
    await fs.writeFile(
      submissionsFilePath,
      JSON.stringify(submissions, null, 2),
    );

    return NextResponse.json(
      { message: "Post submitted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
