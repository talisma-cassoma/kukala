import { createClient } from "@supabase/supabase-js";
//#region src/lib/supabase.ts
var client = null;
function getSupabaseClient() {
	if (client) return client;
	client = createClient("https://rqbegbvangiegbnrgxrv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYmVnYnZhbmdpZWdibnJneHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NjkyMzksImV4cCI6MjA5ODA0NTIzOX0.XvXlT2F7kFYydKqAxEK2JOZ4pLZ6R9jdTSlJiFUeT1k", { auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true
	} });
	return client;
}
createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
//#endregion
export { getSupabaseClient as t };
