import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Receive the response...
export async function GET(request) {
    const { searchParams } = new URL(request.url); // take the request URL, whatever we are getting from Google
    const code = searchParams.get("code"); // get the code from our URL that Google is sending us

    if( code ) {
        const supabase = await createClient(); // from the server side
        await supabase.auth.exchangeCodeForSession(code); // exchange the code for a session
    }

    return NextResponse.redirect(new URL("/", request.url)); // redirect to the home page after logging in

}