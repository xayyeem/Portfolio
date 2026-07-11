import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { name, email, company, project_type, budget_range, message } = body;

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length < 10) {
      return new Response(
        JSON.stringify({ error: "Message must be at least 10 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting via a table (durable across instances)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Simple rate limit: max 3 messages per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", oneHourAgo);

    if (count && count >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many messages. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the message
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company?.trim() || null,
        project_type: project_type || null,
        budget_range: budget_range || null,
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit message. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification via Nodemailer if configured
    const smtpUrl = Deno.env.get("SMTP_URL");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL") || "khalidhaider.jafri@gmail.com";

    if (smtpUrl && smtpUser && smtpPass) {
      try {
        // Use Resend or similar HTTP-based email API
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY") || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio <noreply@khalidhaiderjafri.dev>",
            to: [notifyEmail],
            subject: `New Contact Form Submission from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
              ${project_type ? `<p><strong>Project Type:</strong> ${project_type}</p>` : ""}
              ${budget_range ? `<p><strong>Budget:</strong> ${budget_range}</p>` : ""}
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            `,
          }),
        });
        if (!emailRes.ok) {
          console.error("Email send failed:", await emailRes.text());
        }
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
        // Don't fail the request if email fails — the message is saved
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
