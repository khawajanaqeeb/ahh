-- Enable the pg_net extension if it isn't already enabled (required for webhooks)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the trigger function that will fire the webhook
CREATE OR REPLACE FUNCTION public.trigger_signup_webhook()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Send a POST request to your local Next.js API route
  -- (When you deploy, you will change this URL to your real domain)
  SELECT
    net.http_post(
      url:='http://host.docker.internal:3000/api/webhooks/user-signup',
      headers:='{"Content-Type": "application/json"}'::jsonb,
      body:=json_build_object('record', row_to_json(NEW))::jsonb
    )
  INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the profiles table
DROP TRIGGER IF EXISTS on_profile_created_send_email ON public.profiles;
CREATE TRIGGER on_profile_created_send_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.trigger_signup_webhook();
