import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface DocPayload {
  type: string;
  file_url: string;
}

interface SubmitPayload {
  title: string;
  description?: string;
  price: number;
  location: string;
  property_type: string;
  area: number;
  approval_type?: string | null;
  seller_id?: string | null;
  documents?: DocPayload[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as SubmitPayload;

    if (!body.title || !body.location || !body.property_type || !body.area || !body.price) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const propertyId = crypto.randomUUID();
    const { error: propError } = await supabase.from("properties").insert({
      id: propertyId,
      title: body.title,
      description: body.description ?? null,
      price: body.price,
      location: body.location,
      property_type: body.property_type,
      area: body.area,
      area_unit: "sq ft",
      approval_type: body.approval_type ?? null,
      seller_id: body.seller_id ?? null,
      status: "pending",
    });

    if (propError) throw propError;

    if (body.documents && body.documents.length > 0) {
      const docInserts = body.documents.map((d) => ({
        property_id: propertyId,
        type: d.type,
        file_url: d.file_url,
        uploaded_by: body.seller_id ?? null,
      }));
      const { error: docsError } = await supabase.from("documents").insert(docInserts);
      if (docsError) throw docsError;
    }

    return new Response(
      JSON.stringify({ success: true, property_id: propertyId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-property error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});